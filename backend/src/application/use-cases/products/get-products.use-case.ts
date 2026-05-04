// 🏗️ APPLICATION USE CASES - Obtener Productos
// PROPÓSITO: Casos de uso para gestión de productos

import { Injectable, Inject } from '@nestjs/common';
import { Product, ProductDifficulty } from '../../../domain/entities/product.entity';
import { IProductRepository, PRODUCT_REPOSITORY, CATEGORY_REPOSITORY } from '../../../domain/repositories/product.repository.interface';
import { ICategoryRepository } from '../../../domain/repositories/product.repository.interface';

export interface GetProductsRequest {
  page?: number;
  limit?: number;
  categoryId?: string;
  difficulty?: ProductDifficulty;
  search?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  active?: boolean;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(request: GetProductsRequest): Promise<GetProductsResponse> {
    const {
      page = 1,
      limit = 20,
      categoryId,
      difficulty,
      search,
      tags,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      active,
    } = request;

    // Validar límites
    const adjustedLimit = Math.min(limit, 50); // Limitar automáticamente a 50
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    // Obtener productos base
    let products: Product[];

    if (search) {
      products = await this.productRepository.search(search);
    } else if (categoryId) {
      products = await this.productRepository.findByCategory(categoryId);
    } else if (difficulty) {
      products = await this.productRepository.findByDifficulty(difficulty);
    } else if (tags && tags.length > 0) {
      products = await this.productRepository.findByTags(tags);
    } else {
      products = await this.productRepository.findActive(); // Por defecto, solo activos
    }

    // Aplicar filtro active si se especificó
    if (active !== undefined) {
      products = products.filter(product => product.isActive === active);
    }

    // Filtrar por precio si se especifica
    if (minPrice !== undefined || maxPrice !== undefined) {
      products = products.filter(product => {
        const price = product.price.amount;
        if (minPrice !== undefined && price < minPrice) return false;
        if (maxPrice !== undefined && price > maxPrice) return false;
        return true;
      });
    }

    // Ordenar productos
    products = this.sortProducts(products, sortBy, sortOrder);

    // Calcular paginación
    const total = products.length;
    const totalPages = Math.ceil(total / adjustedLimit);
    const startIndex = (page - 1) * adjustedLimit;
    const endIndex = startIndex + adjustedLimit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total,
      page,
      limit: adjustedLimit,
      totalPages,
    };
  }

  private sortProducts(
    products: Product[],
    sortBy: string,
    sortOrder: 'asc' | 'desc',
  ): Product[] {
    return products.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price.amount - b.price.amount;
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        default:
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }
}

export interface GetProductRequest {
  id?: string;
  slug?: string;
  sku?: string;
}

export interface GetProductResponse {
  product: Product;
}

export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(request: GetProductRequest): Promise<GetProductResponse> {
    const { id, slug, sku } = request;

    let product: Product | null = null;

    if (id) {
      product = await this.productRepository.findById(id);
    } else if (slug) {
      product = await this.productRepository.findBySlug(slug);
    } else if (sku) {
      product = await this.productRepository.findBySku(sku);
    } else {
      throw new Error('Must provide either id, slug, or sku');
    }

    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.isActive) {
      throw new Error('Product is not active');
    }

    return { product };
  }
}
