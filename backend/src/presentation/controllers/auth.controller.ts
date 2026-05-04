// 🏗️ PRESENTATION CONTROLLERS - Capa de presentación HTTP
// PROPÓSITO: Manejar requests HTTP, validar inputs y coordinar con casos de uso

import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, Validate } from 'class-validator';
import { StrongPasswordValidator } from '../../shared/validators/password.validator';
import {
  CreateUserUseCase,
  LoginUseCase,
  CreateUserRequest,
  LoginRequest,
} from '../../application/use-cases/auth/create-user.use-case';
import { RefreshTokenUseCase, RefreshTokenRequest } from '../../application/use-cases/auth/refresh-token.use-case';
import { RegisterDto, RefreshTokenDto } from '../../application/dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';

// EJEMPLO: DTOs para validación de entrada
export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(2)
  firstName: string;
  
  @IsString()
  @MinLength(2)
  lastName: string;
  
  @IsString()
  @Validate(StrongPasswordValidator)
  password: string;
  
  @IsOptional()
  @IsString()
  role?: string;
}

export class LoginRequestDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(6)
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @IsString()
  @Validate(StrongPasswordValidator)
  newPassword: string;
}

// EJEMPLO: Controller de autenticación
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly prisma: PrismaService,
  ) {}

  // EJEMPLO: Endpoint de registro
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('🔐 USER REGISTRATION - SIMPLIFIED AND WORKING');
    console.log('📧 Email:', createUserDto.email);
    console.log('👤 Name:', createUserDto.firstName, createUserDto.lastName);
    
    try {
      // Simple validation - let database handle duplicates
      console.log('🔍 Checking email uniqueness...');
      
      // Try to create user directly - let database handle @unique constraint
      const result = await this.createUserUseCase.execute(createUserDto);
      
      console.log('✅ User created successfully:', result.user);
      console.log('🆔 New User ID:', result.user.id);
      console.log('� New User Email:', result.user.email);

      return {
        success: true,
        data: result.user,
        message: 'Usuario creado exitosamente',
      };
      
    } catch (error: any) {
      console.log('❌ Registration error:', error.message);
      
      // Handle database unique constraint violation
      if (error.message && error.message.includes('Unique constraint')) {
        console.log('� EMAIL DUPLICATE - DATABASE CONSTRAINT VIOLATION');
        return {
          success: false,
          message: 'Este correo electrónico ya está registrado. No puedes usar este correo para crear una nueva cuenta.',
          statusCode: 409,
        };
      }
      
      // Handle application-level duplicate check
      if (error.message === 'Email already exists') {
        console.log('� EMAIL DUPLICATE - APPLICATION LEVEL');
        return {
          success: false,
          message: 'Este correo electrónico ya está registrado. No puedes usar este correo para crear una nueva cuenta.',
          statusCode: 409,
        };
      }
      
      // Generic error
      return {
        success: false,
        message: error.message || 'Error al crear usuario',
      };
    }
  }

  // EJEMPLO: Endpoint de login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginRequestDto) {
    console.log('=== LOGIN DEBUG ===');
    console.log('Login attempt with email:', loginDto.email);
    console.log('Login data received:', { email: loginDto.email, passwordProvided: !!loginDto.password });
    
    try {
      const result = await this.loginUseCase.execute(loginDto);
      console.log('Login successful for:', loginDto.email);

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
      console.log('Login failed for:', loginDto.email);
      console.log('Error:', error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Endpoint de cambiar contraseña
  @Put('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Current password incorrect' })
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      // Get user with password
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.userId },
      });

      if (!user) {
        return {
          success: false,
          message: 'Usuario no encontrado',
        };
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Contraseña actual incorrecta',
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );

      // Update password
      await this.prisma.user.update({
        where: { id: req.user.userId },
        data: { password: hashedPassword },
      });

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // EJEMPLO: Endpoint de refresh token
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const result = await this.refreshTokenUseCase.execute(refreshTokenDto);
      return {
        success: true,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        message: 'Token refreshed successfully',
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
