import {
  IsInt,
  IsNumber,
  IsPositive,
  IsUrl,
  Length,
  Max,
  Min,
  IsDate,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class Wish {
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

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(999999.99)
  price: number;

  @Column({ default: 0 })
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(999999.99)
  raised: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  @JoinTable()
  wishlist: Wishlist[];

  @Column({ default: 0 })
  @IsInt()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
}
