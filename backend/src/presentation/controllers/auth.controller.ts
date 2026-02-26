// 🏗️ PRESENTATION CONTROLLERS - Capa de presentación HTTP
// PROPÓSITO: Manejar requests HTTP, validar inputs y coordinar con casos de uso

import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Patch, 
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserUseCase, LoginUseCase } from '../../../application/use-cases/auth/create-user.use-case';
import { CreateUserRequest, LoginRequest } from '../../../application/use-cases/auth/create-user.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

// EJEMPLO: DTOs para validación de entrada
export class CreateUserDto implements CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
}

export class LoginDto implements LoginRequest {
  email: string;
  password: string;
}

// EJEMPLO: Controller de autenticación
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  // EJEMPLO: Endpoint de registro
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    // EJEMPLO: El controller solo coordina, no contiene lógica de negocio
    try {
      const result = await this.createUserUseCase.execute(createUserDto);
      
      return {
        success: true,
        data: result.user,
        message: result.message
      };
    } catch (error) {
      // EJEMPLO: Manejo de errores específico del controller
      return {
        success: false,
        message: error.message
      };
    }
  }

  // EJEMPLO: Endpoint de login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.loginUseCase.execute(loginDto);
      
      return {
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        },
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // EJEMPLO: Endpoint protegido
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile() {
    // EJEMPLO: Aquí se inyectaría el caso de uso GetProfileUseCase
    return {
      success: true,
      message: 'Profile endpoint - Implement GetProfileUseCase'
    };
  }
}

// EJEMPLO: Controller de productos
@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(
    // EJEMPLO: Inyectar casos de uso específicos
    // private readonly createProductUseCase: CreateProductUseCase,
    // private readonly getProductsUseCase: GetProductsUseCase,
    // private readonly updateProductUseCase: UpdateProductUseCase,
    // private readonly deleteProductUseCase: DeleteProductUseCase
  ) {}

  @Post()
  @Roles('ADMIN', 'VENDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async createProduct() {
    // EJEMPLO: Coordinar con caso de uso
    return {
      success: true,
      message: 'Product creation - Implement CreateProductUseCase'
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getProducts() {
    // EJEMPLO: Coordinar con caso de uso
    return {
      success: true,
      message: 'Products listing - Implement GetProductsUseCase'
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('id') id: string) {
    // EJEMPLO: Coordinar con caso de uso
    return {
      success: true,
      data: { id },
      message: 'Product details - Implement GetProductByIdUseCase'
    };
  }

  @Patch(':id')
  @Roles('ADMIN', 'VENDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async updateProduct(@Param('id') id: string) {
    // EJEMPLO: Coordinar con caso de uso
    return {
      success: true,
      data: { id },
      message: 'Product update - Implement UpdateProductUseCase'
    };
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async deleteProduct(@Param('id') id: string) {
    // EJEMPLO: Coordinar con caso de uso
    return {
      success: true,
      data: { id },
      message: 'Product deletion - Implement DeleteProductUseCase'
    };
  }
}

// EJEMPLO: Controller de administración
@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    // EJEMPLO: Inyectar casos de uso de administración
    // private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase,
    // private readonly getAnalyticsUseCase: GetAnalyticsUseCase
  ) {}

  @Get('stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  async getDashboardStats() {
    // EJEMPLO: Coordinar con caso de uso
    return {
      success: true,
      message: 'Dashboard stats - Implement GetDashboardStatsUseCase'
    };
  }

  @Get('analytics')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics data' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getAnalytics() {
    // EJEMPLO: Coordinar con caso de uso
    return {
      success: true,
      message: 'Analytics data - Implement GetAnalyticsUseCase'
    };
  }
}
