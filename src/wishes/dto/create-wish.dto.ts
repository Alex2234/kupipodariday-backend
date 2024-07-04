import { IsUrl, Length, Min } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  image: string;

  @Min(1)
  price: number;

  description: string;
}
