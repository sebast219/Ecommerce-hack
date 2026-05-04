// APPLICATION USE CASES - Create Product
// PURPOSE: Create a new product with inventory

import { Injectable, Inject } from '@nestjs/common';
import {
  Product,
  Money,
  ProductDifficulty,
} from '../../../domain/entities/product.entity';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product.repository.interface';
import { CreateProductDto } from '../../dto/product.dto';

export interface CreateProductRequest {
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku: string;
  barcode?: string;
  trackInventory: boolean;
  isActive: boolean;
  images: string[];
  tags: string[];
  weight?: number;
  dimensions?: any;
  seoTitle?: string;
  seoDescription?: string;
  difficulty: ProductDifficulty;
  licenseType?: string;
  compatibility: string[];
  tutorials: string[];
  isPhysical: boolean;
  downloadUrl?: string;
  categoryId: string;
}

export interface CreateProductResponse {
  product: Product;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    const {
      name,
      slug,
      description,
      price,
      comparePrice,
      sku,
      barcode,
      trackInventory,
      isActive,
      images,
      tags,
      weight,
      dimensions,
      seoTitle,
      seoDescription,
      difficulty,
      licenseType,
      compatibility,
      tutorials,
      isPhysical,
      downloadUrl,
      categoryId,
    } = request;

    // Check if product with same slug or SKU already exists
    const existingBySlug = await this.productRepository.findBySlug(slug);
    if (existingBySlug) {
      throw new Error('Product with this slug already exists');
    }

    const existingBySku = await this.productRepository.findBySku(sku);
    if (existingBySku) {
      throw new Error('Product with this SKU already exists');
    }

    // Create Money value object
    const priceMoney = new Money(price, 'USD');
    const comparePriceMoney = comparePrice
      ? new Money(comparePrice, 'USD')
      : undefined;

    // Create product
    const product = await this.productRepository.create({
      name,
      slug,
      description,
      price: priceMoney,
      comparePrice: comparePriceMoney,
      sku,
      barcode,
      trackInventory,
      isActive,
      images,
      tags,
      weight,
      dimensions,
      seoTitle,
      seoDescription,
      difficulty,
      licenseType,
      compatibility,
      tutorials,
      isPhysical,
      downloadUrl,
      categoryId,
    });

    return { product };
  }
}
