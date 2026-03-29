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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import {
  CreateUserUseCase,
  LoginUseCase,
  CreateUserRequest,
  LoginRequest,
} from '../../application/use-cases/auth/create-user.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';

// EJEMPLO: DTOs para validación de entrada
export class CreateUserDto implements CreateUserRequest {
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(2)
  firstName: string;
  
  @IsString()
  @MinLength(2)
  lastName: string;
  
  @IsString()
  @MinLength(6)
  password: string;
  
  @IsOptional()
  @IsString()
  role?: string;
}

export class LoginDto implements LoginRequest {
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
  @MinLength(8)
  newPassword: string;
}

// EJEMPLO: Controller de autenticación
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly prisma: PrismaService,
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
