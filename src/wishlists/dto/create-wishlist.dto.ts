import { IsUrl } from 'class-validator';

export class CreateWishlistDto {
  name: string;

  @IsUrl()
  image: string;

  itemsId: number[];
}
