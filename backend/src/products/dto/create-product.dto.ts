import { IsString, IsDecimal, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDecimal()
  @Type(() => Number)
  price: number;

  @IsInt()
  stock: number;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
