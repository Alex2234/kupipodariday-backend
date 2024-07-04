import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const { itemsId, ...rest } = createWishlistDto;

    const items = await this.wishRepository.findBy({ id: In(itemsId) });
    if (items.length !== itemsId.length) {
      throw new NotFoundException('Некоторые из указанных wish не найдены');
    }

    const wishlist = this.wishlistRepository.create({
      ...rest,
      items,
      owner: user,
    });

    return this.wishlistRepository.save(wishlist);
  }

  async findAll() {
    return await this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    if (!wishlist) {
      throw new NotFoundException(`Wishlist с ${id} не найден`);
    }
    return wishlist;
  }

  async updateWishlist(
    id: number,
    user: User,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new NotFoundException(`Wishlist с ${id} не найден`);
    }

    if (user.id !== wishlist.owner.id) {
      throw new NotFoundException('Wishlist может изменять только owner');
    }

    return this.wishlistRepository.save({ ...updateWishlistDto });
  }

  async deleteWishlist(id: number, user: User) {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new NotFoundException(`Wishlist с ${id} не найден`);
    }

    if (user.id !== wishlist.owner.id) {
      throw new NotFoundException('Wishlist может удалять только owner');
    }

    await this.wishlistRepository
      .createQueryBuilder()
      .relation(Wishlist, 'items')
      .of(wishlist)
      .remove(wishlist.items);

    return await this.wishlistRepository.delete({ id });
  }
}
