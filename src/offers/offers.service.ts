import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number): Promise<Offer> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User не найден');
    }

    const item = await this.wishesRepository.findOne({
      where: { id: createOfferDto.itemId },
    });
    if (!item) {
      throw new NotFoundException('Wish не найден');
    }

    const offer = this.offersRepository.create({
      ...createOfferDto,
      user: user,
      item: item,
    });

    const savedOffer = await this.offersRepository.save(offer);

    if (item.raised >= item.price) {
      throw new NotFoundException('Сумма собрана');
    }

    if (createOfferDto.amount > item.price) {
      throw new NotFoundException('Сумма больше нужной');
    }
    item.raised += createOfferDto.amount;
    await this.wishesRepository.save(item);

    return savedOffer;
  }

  async findAll() {
    return await this.offersRepository.find({
      relations: ['user', 'item'],
    });
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });

    if (!offer) {
      throw new NotFoundException(`Offer с ${id} не найден`);
    }

    return offer;
  }
}
