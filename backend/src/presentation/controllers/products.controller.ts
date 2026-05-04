// 🏗️ PRESENTATION CONTROLLERS - Productos (CORREGIDO)
// PROPÓSITO: Manejar requests HTTP de productos

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  Inject,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { NotFoundExceptionFilter } from '../filters/not-found.filter';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  GetProductsUseCase,
  GetProductUseCase,
} from '../../application/use-cases/products/get-products.use-case';
import { CreateProductUseCase } from '../../application/use-cases/products/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/products/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/products/delete-product.use-case';
import {
  GetProductsQueryDto,
  ProductDifficulty,
  CreateProductDto,
  UpdateProductDto,
} from '../../application/dto/product.dto';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repositories/product.repository.interface';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({
    name: 'difficulty',
    required: false,
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'price', 'createdAt'],
  })
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
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
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
  @UseFilters(NotFoundExceptionFilter)
  async getProduct(@Param('identifier') identifier: string) {
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
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({
    status: 200,
    description: 'Category products retrieved successfully',
  })
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

  // Admin endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const result = await this.createProductUseCase.execute(createProductDto);

      return {
        success: true,
        data: result.product,
        message: 'Product created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create product',
      };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const result = await this.updateProductUseCase.execute({
        id,
        ...updateProductDto,
      });

      return {
        success: true,
        data: result.product,
        message: 'Product updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update product',
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async deleteProduct(@Param('id') id: string) {
    try {
      await this.deleteProductUseCase.execute({ id });

      return {
        success: true,
        data: null,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete product',
      };
    }
  }
}

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  // Datos estáticos de categorías para evitar problemas de inyección
  private readonly categories = [
    {
      id: 'profesionales',
      name: 'Profesionales',
      slug: 'profesionales',
      description:
        'Herramientas utilizadas por equipos de ciberseguridad en todo el mundo.',
    },
    {
      id: 'ataques-inalambricos',
      name: 'Ataques Inalámbricos',
      slug: 'ataques-inalambricos',
      description: 'Auditorías WiFi, MITM y pentesting inalámbrico',
    },
    {
      id: 'usb-hacking',
      name: 'USB Hacking',
      slug: 'usb-hacking',
      description: 'Payloads, BadUSB y ataques físicos',
    },
    {
      id: 'red-team',
      name: 'Red Team',
      slug: 'red-team',
      description: 'Operaciones ofensivas avanzadas',
    },
    {
      id: 'network',
      name: 'Network',
      slug: 'network',
      description: 'Sniffing, análisis y monitoreo',
    },
    {
      id: 'hardware',
      name: 'Hardware',
      slug: 'hardware',
      description: 'Implantes y dispositivos encubiertos',
    },
  ];

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
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
    const category = this.categories.find((c) => c.slug === slug);
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
