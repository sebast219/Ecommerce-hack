// PRESENTATION CONTROLLERS - Admin Products
// PURPOSE: Admin endpoints for product management

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CreateProductDto, UpdateProductDto } from '../../application/dto/product.dto';
import { CreateProductUseCase } from '../../application/use-cases/products/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/products/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/products/delete-product.use-case';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository.interface';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@ApiTags('Admin Products')
@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminProductsController {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products (admin view)' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
  })
  async getAllProducts() {
    try {
      const products = await this.prisma.product.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          inventory: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Transform products to match frontend interface
      const transformedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        sku: product.sku,
        barcode: product.barcode,
        trackInventory: product.trackInventory,
        inventoryCount: product.inventory?.quantity || 0,
        isActive: product.isActive,
        images: product.images ? JSON.parse(product.images) : [],
        tags: product.tags ? JSON.parse(product.tags) : [],
        weight: product.weight,
        dimensions: product.dimensions ? JSON.parse(product.dimensions) : undefined,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        category: product.category,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }));

      return {
        success: true,
        data: transformedProducts,
        message: 'Products retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID (admin view)' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
  })
  async getProductById(@Param('id') id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          inventory: true,
        },
      });

      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      const transformedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        sku: product.sku,
        barcode: product.barcode,
        trackInventory: product.trackInventory,
        inventoryCount: product.inventory?.quantity || 0,
        isActive: product.isActive,
        images: product.images ? JSON.parse(product.images) : [],
        tags: product.tags ? JSON.parse(product.tags) : [],
        weight: product.weight,
        dimensions: product.dimensions ? JSON.parse(product.dimensions) : undefined,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        category: product.category,
        categoryId: product.categoryId,
        difficulty: product.difficulty,
        experienceLevel: 'INTERMEDIATE',
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };

      return {
        success: true,
        data: transformedProduct,
        message: 'Product retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation errors' })
  @Roles('ADMIN')
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
        message: error.message,
      };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Roles('ADMIN')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
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
        message: error.message,
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Roles('ADMIN')
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
        message: error.message,
      };
    }
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle product active status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product status toggled successfully' })
  @Roles('ADMIN')
  async toggleActive(@Param('id') id: string) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      const updated = await this.prisma.product.update({
        where: { id },
        data: { isActive: !product.isActive },
      });

      return {
        success: true,
        data: updated,
        message: 'Product status toggled successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id/inventory')
  @ApiOperation({ summary: 'Update product inventory (Admin only)' })
  @ApiResponse({ status: 200, description: 'Inventory updated successfully' })
  @Roles('ADMIN')
  async updateInventory(@Param('id') id: string, @Body() body: { inventoryCount: number }) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: { inventory: true },
      });

      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      if (product.inventory) {
        await this.prisma.productInventory.update({
          where: { id: product.inventory.id },
          data: { quantity: body.inventoryCount },
        });
      } else {
        await this.prisma.productInventory.create({
          data: {
            productId: id,
            quantity: body.inventoryCount,
          },
        });
      }

      const updated = await this.prisma.product.findUnique({
        where: { id },
        include: { inventory: true },
      });

      return {
        success: true,
        data: updated,
        message: 'Inventory updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
