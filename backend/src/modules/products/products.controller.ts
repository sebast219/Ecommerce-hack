// PRODUCTS CONTROLLER - EJERCICIO PRÁCTICO
// OBJETIVO: Aprender a crear endpoints RESTful con NestJS

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../../common';

// Definir roles localmente para el ejercicio
enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
}

@ApiTags('Products')
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // TODO: Implementa endpoint POST /products - Crear producto
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 409, description: 'Product SKU already exists' })
  create(@Body() createProductDto: CreateProductDto) {
    // CONCEPTO: Endpoint protegido con autenticación y roles
    // - @UseGuards: Middleware de autenticación
    // - @Roles: Restricción por rol (ADMIN, VENDOR)
    // - @Body: Inyecta y valida el DTO automáticamente
    
    // CONCEPTO: Validación automática con DTOs
    // - NestJS valida createProductDto antes de llegar al service
    // - Si la validación falla, retorna 400 automáticamente
    
    console.log('POST /products - Crear producto:', createProductDto.name);
    return this.productsService.create(createProductDto);
  }

  // TODO: Implementa endpoint GET /products - Listar productos con filtros
  @Get()
  @ApiOperation({ summary: 'Get all products with filtering' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  findAll(@Query() filterDto: FilterProductDto) {
    // CONCEPTO: Query parameters con DTOs
    // - @Query: Convierte query params a objeto tipado
    // - Ejemplo: /products?page=1&limit=10&search=laptop
    
    // CONCEPTO: Paginación y filtros
    // - filterDto contiene: page, limit, search, minPrice, maxPrice
    // - Valores por defecto se definen en el DTO
    
    console.log('GET /products - Listar con filtros:', filterDto);
    return this.productsService.findAll(filterDto);
  }

  // TODO: Implementa endpoint GET /products/:id - Obtener producto por ID
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    // CONCEPTO: Path parameters
    // - @Param('id'): Extrae ID de la URL
    // - Ejemplo: /products/123
    
    // CONCEPTO: Resource identification
    // - Los IDs deben ser strings únicos (cuid)
    // - El service maneja el caso de "no encontrado"
    
    console.log('GET /products/:id - Buscar por ID:', id);
    return this.productsService.findOne(id);
  }

  // TODO: Implementa endpoint GET /products/slug/:slug - Buscar por slug
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findBySlug(@Param('slug') slug: string) {
    // CONCEPTO: SEO-friendly URLs
    // - Los slugs son URLs amigables: "laptop-gamer-rgb"
    // - Útiles para SEO y用户体验
    
    // CONCEPTO: Multiple route parameters
    // - NestJS diferencia rutas por orden y patrón
    // - /products/slug/:slug vs /products/:id
    
    console.log('GET /products/slug/:slug - Buscar por slug:', slug);
    return this.productsService.findBySlug(slug);
  }

  // TODO: Implementa endpoint PATCH /products/:id - Actualizar producto
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    // CONCEPTO: Partial updates con PATCH
    // - PATCH vs PUT: PATCH actualiza parcialmente
    // - UpdateProductDto tiene campos opcionales
    
    // CONCEPTO: Validación de actualización
    // - DTOs de update pueden tener reglas diferentes
    // - Ejemplo: SKU no debe duplicarse
    
    console.log('PATCH /products/:id - Actualizar producto:', id);
    return this.productsService.update(id, updateProductDto);
  }

  // TODO: Implementa endpoint DELETE /products/:id - Eliminar producto
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: string) {
    // CONCEPTO: Restricción estricta de roles
    // - Solo ADMIN puede eliminar (no VENDOR)
    // - Prevenir eliminación accidental
    
    // CONCEPTO: HTTP Status Codes
    // - 204 No Content: Eliminación exitosa sin body
    // - @HttpCode: Override status code por defecto
    
    console.log('DELETE /products/:id - Eliminar producto (ADMIN):', id);
    return this.productsService.remove(id);
  }

  // TODO: Implementa endpoint PATCH /products/:id/inventory - Actualizar inventario
  @Patch(':id/inventory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product inventory' })
  @ApiResponse({ status: 200, description: 'Inventory updated successfully' })
  updateInventory(
    @Param('id') id: string, 
    @Body('quantity') quantity: number
  ) {
    // CONCEPTO: Body parameter específico
    // - @Body('quantity'): Extrae campo específico del body
    // - Espera { "quantity": 100 } en el request body
    
    // CONCEPTO: Nested routes
    // - /products/:id/inventory: sub-recurso de producto
    // - Organiza endpoints relacionados
    
    console.log('PATCH /products/:id/inventory - Actualizar inventario:', id, quantity);
    return this.productsService.updateInventory(id, quantity);
  }
}
