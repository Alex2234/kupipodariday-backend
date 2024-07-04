import {
  Controller,
  UseGuards,
  Post,
  Body,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Request() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get()
  getAllOffers() {
    return this.offersService.findAll();
  }

  @Get(':id')
  getOfferById(@Param('id') id: string) {
    return this.offersService.findOne(Number(id));
  }
}
