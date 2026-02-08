import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  Min,
  Max,
  MaxLength,
  IsUrl,
  ArrayMaxSize,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999999.99)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999999.99)
  @Transform(({ value }) => parseFloat(value))
  comparePrice?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999999.99)
  @Transform(({ value }) => parseFloat(value))
  cost?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  sku: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  barcode?: string;

  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean = true;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsArray()
  @IsUrl({}, { each: true })
  @ArrayMaxSize(10)
  images: string[];

  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  @ArrayMaxSize(20)
  tags: string[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Max(999999.999)
  @Transform(({ value }) => parseFloat(value))
  weight?: number;

  @IsOptional()
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };

  @IsOptional()
  @IsString()
  @MaxLength(60)
  @Transform(({ value }) => value?.trim())
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  @Transform(({ value }) => value?.trim())
  seoDescription?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  inventory?: {
    quantity?: number;
    lowStock?: number;
    track?: boolean;
  };
}
