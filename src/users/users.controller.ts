import {
  Controller,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { WishesService } from 'src/wishes/wishes.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Patch('me')
  updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }

  @Get(':username')
  getProfileByUsername(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @Get('me/wishes')
  getWishesByMe(@Request() req) {
    const me = req.user;

    if (!me) {
      throw new Error('Пользователь не найден');
    }
    return this.wishesService.findWishesByUser(me.id);
  }

  @Get(':username/wishes')
  async getWishesByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new Error('Пользователь не найден');
    }
    return this.wishesService.findWishesByUser(user.id);
  }

  @Post('find')
  getAllUsers(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }
}
