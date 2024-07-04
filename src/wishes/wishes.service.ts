import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(user: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: user,
    });

    return await this.wishRepository.save(wish);
  }

  async findWishesByUser(id: number): Promise<Wish[]> {
    return await this.wishRepository.find({ where: { owner: { id } } });
  }

  async findWishesLast() {
    return await this.wishRepository.find({
      relations: { owner: true },
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findWishesTop() {
    return await this.wishRepository.find({
      relations: { owner: true },
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wish) {
      throw new NotFoundException(`Wish с ${id} не найден`);
    }
    return wish;
  }

  async updateWish(
    id: number,
    user: User,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException(`Wish с ${id} не найден`);
    }

    if (user.id !== wish.owner.id) {
      throw new NotFoundException('Wish может изменять только owner');
    }

    if (wish.raised !== 0) {
      throw new NotFoundException(
        'Wish можно изменять только, если никто не скинулся',
      );
    }

    return this.wishRepository.save({ ...updateWishDto });
  }

  async deleteWish(id: number, user: User) {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException(`Wish с ${id} не найден`);
    }

    if (user.id !== wish.owner.id) {
      throw new NotFoundException('Wish может удалять только owner');
    }

    return await this.wishRepository.delete({ id });
  }

  async copyWish(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException(`Wish с ${id} не найден`);
    }

    const existingCopy = await this.wishRepository.findOne({
      where: {
        owner: { id: user.id },
        description: wish.description,
        price: wish.price,
        link: wish.link,
        image: wish.image,
      },
    });

    if (existingCopy) {
      throw new NotFoundException('Вы уже копировали себе этот подарок');
    }

    const copiedWish = this.wishRepository.create({
      ...wish,
      createdAt: undefined,
      owner: user,
      id: undefined,
      copied: 0,
      raised: 0,
    });

    wish.copied += 1;
    await this.wishRepository.save(wish);

    return await this.wishRepository.save(copiedWish);
  }
}
