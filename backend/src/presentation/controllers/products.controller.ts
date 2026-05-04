// 🏗️ PRESENTATION CONTROLLERS - Productos (CORREGIDO)
// PROPÓSITO: Manejar requests HTTP de productos

import { Controller, Get, Query, Param, Inject, Post, Body, UseGuards, Put, Delete, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  GetProductsUseCase,
  GetProductUseCase,
} from '../../application/use-cases/products/get-products.use-case';
import { GetProductsQueryDto, ProductDifficulty } from '../../application/dto/product.dto';
import { ICategoryRepository, CATEGORY_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'difficulty', required: false, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'price', 'createdAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getProducts(@Query() query: GetProductsQueryDto) {
    try {
      const result = await this.getProductsUseCase.execute(query);

      return {
        success: true,
        data: result,
        message: 'Products retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('search/:term')
  @ApiOperation({ summary: 'Search products by term' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async searchProducts(@Param('term') term: string) {
    try {
      const result = await this.getProductsUseCase.execute({
        search: term,
        limit: 20,
      });

      return {
        success: true,
        data: result,
        message: 'Search results retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get product by ID, slug, or SKU' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('identifier') identifier: string) {
    try {
      // Try to determine if it's an ID, slug, or SKU
      let request;

      if (identifier.length === 25 && identifier.startsWith('c')) {
        // Likely a Prisma ID
        request = { id: identifier };
      } else if (identifier.includes('-')) {
        // Likely a slug
        request = { slug: identifier };
      } else {
        // Likely a SKU
        request = { sku: identifier };
      }

      const result = await this.getProductUseCase.execute(request);

      return {
        success: true,
        data: result.product,
        message: 'Product retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: 200, description: 'Category products retrieved successfully' })
  async getProductsByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: Partial<GetProductsQueryDto>,
  ) {
    try {
      const result = await this.getProductsUseCase.execute({
        ...query,
        categoryId,
      });

      return {
        success: true,
        data: result,
        message: 'Category products retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  // Datos estáticos de categorías para evitar problemas de inyección
  private readonly categories = [
    { id: 'profesionales', name: 'Profesionales', slug: 'profesionales', description: 'Herramientas utilizadas por equipos de ciberseguridad en todo el mundo.' },
    { id: 'ataques-inalambricos', name: 'Ataques Inalámbricos', slug: 'ataques-inalambricos', description: 'Auditorías WiFi, MITM y pentesting inalámbrico' },
    { id: 'usb-hacking', name: 'USB Hacking', slug: 'usb-hacking', description: 'Payloads, BadUSB y ataques físicos' },
    { id: 'red-team', name: 'Red Team', slug: 'red-team', description: 'Operaciones ofensivas avanzadas' },
    { id: 'network', name: 'Network', slug: 'network', description: 'Sniffing, análisis y monitoreo' },
    { id: 'hardware', name: 'Hardware', slug: 'hardware', description: 'Implantes y dispositivos encubiertos' },
  ];

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategories() {
    return {
      success: true,
      data: { categories: this.categories },
      message: 'Categories retrieved successfully',
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryBySlug(@Param('slug') slug: string) {
    const category = this.categories.find(c => c.slug === slug);
    if (!category) {
      return {
        success: false,
        message: 'Category not found',
      };
    }
    return {
      success: true,
      data: { category },
      message: 'Category retrieved successfully',
    };
  }
}
