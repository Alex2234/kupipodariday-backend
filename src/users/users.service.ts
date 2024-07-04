import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw new NotFoundException(
        'Пользователь с таким email уже зарегистрирован',
      );
    }

    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUserByUsername) {
      throw new NotFoundException(
        'Пользователь с таким username уже зарегистрирован',
      );
    }

    const hashedPassword = await this.hashService.hashPassword(
      createUserDto.password,
    );
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User с ${id} не найден`);
    }
    return user;
  }

  async findMany(query: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });

    if (!users.length) {
      throw new NotFoundException('Нет пользователей в базе данных');
    }

    return users;
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email) {
      const existingUserByEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email, id: Not(id) },
      });

      if (existingUserByEmail) {
        throw new NotFoundException(
          'Пользователь с таким email уже зарегистрирован',
        );
      }
    }

    if (updateUserDto.username) {
      const existingUserByUsername = await this.userRepository.findOne({
        where: { username: updateUserDto.username, id: Not(id) },
      });

      if (existingUserByUsername) {
        throw new NotFoundException(
          'Пользователь с таким username уже зарегистрирован',
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.hashPassword(
        updateUserDto.password,
      );
    } else {
      delete updateUserDto.password;
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }
}
