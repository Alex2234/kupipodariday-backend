import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Request() req, @Body() createWishlistDto: CreateWishlistDto) {
    const user = req.user;
    if (!user) {
      throw new Error(`${user} не найден`);
    }
    return this.wishlistsService.create(user, createWishlistDto);
  }

  @Get()
  getAllWishlists() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  getWislistById(@Param('id') id: string) {
    const wishlist = this.wishlistsService.findOne(Number(id));

    if (!wishlist) {
      throw new Error('Подарок не найден');
    }
    return wishlist;
  }

  @Patch(':id')
  updateWishlistById(
    @Param('id') id: string,
    @Request() req,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateWishlist(
      Number(id),
      req.user,
      updateWishlistDto,
    );
  }

  @Delete(':id')
  deleteWishlistById(@Param('id') id: string, @Request() req) {
    return this.wishlistsService.deleteWishlist(Number(id), req.user);
  }
}
