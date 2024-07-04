import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish])],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {}
