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
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateUserUseCase,
  LoginUseCase,
  CreateUserRequest,
  LoginRequest,
} from '../../application/use-cases/auth/create-user.use-case';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
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
    private readonly loginUseCase: LoginUseCase,
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
        message: result.message,
      };
    } catch (error) {
      // EJEMPLO: Manejo de errores específico del controller
      return {
        success: false,
        message: error.message,
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
          refreshToken: result.refreshToken,
        },
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
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
      message: 'Profile endpoint - Implement GetProfileUseCase',
    };
  }
}
