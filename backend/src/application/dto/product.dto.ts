// 🏗️ APPLICATION DTOs - Productos con validación (CORREGIDO)
// PROPÓSITO: Definir estructuras de datos con validación robusta

import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  Min, 
  Max, 
  Matches,
  IsBoolean,
  IsUrl,
  ArrayNotEmpty,
  ValidateNested,
  Length
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export class ProductDimensionsDto {
  @ApiProperty({ example: 10, description: 'Length in cm' })
  @IsNumber({}, { message: 'Length must be a number' })
  @Min(0.1, { message: 'Length must be greater than 0' })
  length: number;

  @ApiProperty({ example: 5, description: 'Width in cm' })
  @IsNumber({}, { message: 'Width must be a number' })
  @Min(0.1, { message: 'Width must be greater than 0' })
  width: number;

  @ApiProperty({ example: 2, description: 'Height in cm' })
  @IsNumber({}, { message: 'Height must be a number' })
  @Min(0.1, { message: 'Height must be greater than 0' })
  height: number;

  @ApiProperty({ example: 'cm', description: 'Unit of measurement' })
  @IsEnum(['cm', 'in'], { message: 'Unit must be cm or in' })
  unit: 'cm' | 'in';
}

export class CreateProductDto {
  @ApiProperty({ example: 'WiFi Pineapple Mark VII', description: 'Product name' })
  @IsString({ message: 'Product name must be a string' })
  @Length(3, 200, { message: 'Product name must be between 3 and 200 characters' })
  name: string;

  @ApiProperty({ example: 'wifi-pineapple-mark-vii', description: 'Product slug' })
  @IsString({ message: 'Product slug must be a string' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Product slug can only contain lowercase letters, numbers, and hyphens' })
  @Length(3, 100, { message: 'Product slug must be between 3 and 100 characters' })
  slug: string;

  @ApiPropertyOptional({ example: 'Advanced WiFi auditing platform', description: 'Product description' })
  @IsOptional()
  @IsString({ message: 'Product description must be a string' })
  @Length(0, 2000, { message: 'Product description cannot exceed 2000 characters' })
  description?: string;

  @ApiProperty({ example: 299.99, description: 'Product price' })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  @Max(999999.99, { message: 'Price cannot exceed 999999.99' })
  price: number;

  @ApiPropertyOptional({ example: 399.99, description: 'Compare at price' })
  @IsOptional()
  @IsNumber({}, { message: 'Compare price must be a number' })
  @Min(0.01, { message: 'Compare price must be greater than 0' })
  comparePrice?: number;

  @ApiProperty({ example: 'HAK5-WP007', description: 'Product SKU' })
  @IsString({ message: 'Product SKU must be a string' })
  @Length(3, 50, { message: 'Product SKU must be between 3 and 50 characters' })
  sku: string;

  @ApiPropertyOptional({ example: '1234567890123', description: 'Product barcode' })
  @IsOptional()
  @IsString({ message: 'Product barcode must be a string' })
  @Matches(/^\d+$/, { message: 'Barcode can only contain numbers' })
  barcode?: string;

  @ApiProperty({ example: true, description: 'Track inventory' })
  @IsBoolean({ message: 'Track inventory must be a boolean' })
  trackInventory: boolean;

  @ApiProperty({ example: true, description: 'Product is active' })
  @IsBoolean({ message: 'Product active status must be a boolean' })
  isActive: boolean;

  @ApiProperty({ example: ['https://example.com/image1.jpg'], description: 'Product images' })
  @IsArray({ message: 'Product images must be an array' })
  @ArrayNotEmpty({ message: 'Product must have at least one image' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images: string[];

  @ApiProperty({ example: ['wifi', 'pentesting', 'audit'], description: 'Product tags' })
  @IsArray({ message: 'Product tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags: string[];

  @ApiPropertyOptional({ example: 0.5, description: 'Product weight in kg' })
  @IsOptional()
  @IsNumber({}, { message: 'Product weight must be a number' })
  @Min(0.001, { message: 'Product weight must be greater than 0' })
  weight?: number;

  @ApiPropertyOptional({ type: ProductDimensionsDto, description: 'Product dimensions' })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductDimensionsDto)
  dimensions?: ProductDimensionsDto;

  @ApiPropertyOptional({ example: 'WiFi Pineapple Mark VII', description: 'SEO title' })
  @IsOptional()
  @IsString({ message: 'SEO title must be a string' })
  @Length(0, 60, { message: 'SEO title cannot exceed 60 characters' })
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'Advanced WiFi auditing platform for penetration testing', description: 'SEO description' })
  @IsOptional()
  @IsString({ message: 'SEO description must be a string' })
  @Length(0, 160, { message: 'SEO description cannot exceed 160 characters' })
  seoDescription?: string;

  @ApiProperty({ example: 'INTERMEDIATE', enum: ProductDifficulty, description: 'Product difficulty level' })
  @IsEnum(ProductDifficulty, { message: 'Product difficulty must be a valid difficulty level' })
  difficulty: ProductDifficulty;

  @ApiPropertyOptional({ example: 'commercial', description: 'License type' })
  @IsOptional()
  @IsString({ message: 'License type must be a string' })
  @IsEnum(['open-source', 'commercial', 'educational', 'freeware'], { 
    message: 'License type must be open-source, commercial, educational, or freeware' 
  })
  licenseType?: string;

  @ApiProperty({ example: ['windows', 'linux', 'mac'], description: 'Product compatibility' })
  @IsArray({ message: 'Product compatibility must be an array' })
  @IsEnum(['windows', 'linux', 'mac', 'android', 'ios'], { 
    each: true, 
    message: 'Each compatibility option must be valid' 
  })
  compatibility: string[];

  @ApiProperty({ example: true, description: 'Product is physical' })
  @IsBoolean({ message: 'Product physical status must be a boolean' })
  isPhysical: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/download', description: 'Download URL for digital products' })
  @IsOptional()
  @IsUrl({}, { message: 'Download URL must be a valid URL' })
  downloadUrl?: string;

  @ApiProperty({ example: 'category-id-here', description: 'Category ID' })
  @IsString({ message: 'Category ID must be a string' })
  @Length(1, 100, { message: 'Category ID is required' })
  categoryId: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'WiFi Pineapple Mark VII', description: 'Product name' })
  @IsOptional()
  @IsString({ message: 'Product name must be a string' })
  @Length(3, 200, { message: 'Product name must be between 3 and 200 characters' })
  name?: string;

  @ApiPropertyOptional({ example: 'wifi-pineapple-mark-vii', description: 'Product slug' })
  @IsOptional()
  @IsString({ message: 'Product slug must be a string' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Product slug can only contain lowercase letters, numbers, and hyphens' })
  slug?: string;

  @ApiPropertyOptional({ example: 'Advanced WiFi auditing platform', description: 'Product description' })
  @IsOptional()
  @IsString({ message: 'Product description must be a string' })
  @Length(0, 2000, { message: 'Product description cannot exceed 2000 characters' })
  description?: string;

  @ApiPropertyOptional({ example: 299.99, description: 'Product price' })
  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  price?: number;

  @ApiPropertyOptional({ example: true, description: 'Product is active' })
  @IsOptional()
  @IsBoolean({ message: 'Product active status must be a boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({ example: ['https://example.com/image1.jpg'], description: 'Product images' })
  @IsOptional()
  @IsArray({ message: 'Product images must be an array' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images?: string[];

  @ApiPropertyOptional({ example: ['wifi', 'pentesting', 'audit'], description: 'Product tags' })
  @IsOptional()
  @IsArray({ message: 'Product tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];
}

export class GetProductsQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be greater than 0' })
  page?: number;

  @ApiPropertyOptional({ example: 20, description: 'Items per page' })
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be greater than 0' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number;

  @ApiPropertyOptional({ example: 'category-id', description: 'Category ID filter' })
  @IsOptional()
  @IsString({ message: 'Category ID must be a string' })
  categoryId?: string;

  @ApiPropertyOptional({ example: 'INTERMEDIATE', enum: ProductDifficulty, description: 'Difficulty filter' })
  @IsOptional()
  @IsEnum(ProductDifficulty, { message: 'Difficulty must be a valid difficulty level' })
  difficulty?: ProductDifficulty;

  @ApiPropertyOptional({ example: 'wifi', description: 'Search term' })
  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
  search?: string;

  @ApiPropertyOptional({ example: ['wifi', 'pentesting'], description: 'Tags filter' })
  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  tags?: string[];

  @ApiPropertyOptional({ example: 50, description: 'Minimum price' })
  @IsOptional()
  @IsNumber({}, { message: 'Minimum price must be a number' })
  @Min(0, { message: 'Minimum price cannot be negative' })
  minPrice?: number;

  @ApiPropertyOptional({ example: 500, description: 'Maximum price' })
  @IsOptional()
  @IsNumber({}, { message: 'Maximum price must be a number' })
  @Min(0, { message: 'Maximum price cannot be negative' })
  maxPrice?: number;

  @ApiPropertyOptional({ example: 'name', enum: ['name', 'price', 'createdAt'], description: 'Sort by field' })
  @IsOptional()
  @IsEnum(['name', 'price', 'createdAt'], { message: 'Sort by must be name, price, or createdAt' })
  sortBy?: 'name' | 'price' | 'createdAt';

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'], description: 'Sort order' })
  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'Sort order must be asc or desc' })
  sortOrder?: 'asc' | 'desc';
}
