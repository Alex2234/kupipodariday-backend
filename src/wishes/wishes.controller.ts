import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdateWishDto } from './dto/update-wish.dto';

@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Request() req, @Body() createWishDto: CreateWishDto) {
    const user = req.user;
    if (!user) {
      throw new Error(`${user} не найден`);
    }
    return this.wishesService.create(user, createWishDto);
  }

  @Get('last')
  getWishesLast() {
    return this.wishesService.findWishesLast();
  }

  @Get('top')
  getWishesTop() {
    return this.wishesService.findWishesTop();
  }

  @Get(':id')
  getWishById(@Param('id') id: string) {
    const wish = this.wishesService.findOne(Number(id));

    if (!wish) {
      throw new Error('Подарок не найден');
    }
    return wish;
  }

  @Patch(':id')
  updateWishById(
    @Param('id') id: string,
    @Request() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateWish(Number(id), req.user, updateWishDto);
  }

  @Delete(':id')
  deleteWishById(@Param('id') id: string, @Request() req) {
    return this.wishesService.deleteWish(Number(id), req.user);
  }

  @Post(':id/copy')
  copyWishById(@Param('id') id: string, @Request() req) {
    return this.wishesService.copyWish(Number(id), req.user);
  }
}
