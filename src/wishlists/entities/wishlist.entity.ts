import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUrl, Length, IsDate } from 'class-validator';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column({ default: 'Описание' })
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.wishlist)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
