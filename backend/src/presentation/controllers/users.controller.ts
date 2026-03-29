// 🏗️ PRESENTATION CONTROLLERS - User Management
// PROPÓSITO: Manejar direcciones y métodos de pago del usuario

import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PrismaService } from '../../infrastructure/database/prisma.service';

// ========== DTOs ==========

export class CreateAddressDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  brand: string; // visa, mastercard, amex

  @IsString()
  @Length(4, 4)
  last4: string;

  @IsString()
  @Length(2, 2)
  expiryMonth: string;

  @IsString()
  @Length(2, 2)
  expiryYear: string;

  @IsOptional()
  @IsString()
  bank?: string; // bancolombia, davivienda, etc

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  newPassword: string;
}

// ========== CONTROLLER ==========

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  // ========== PROFILE ==========

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: user,
    };
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: req.user.userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
      },
    });

    return {
      success: true,
      data: user,
      message: 'Perfil actualizado exitosamente',
    };
  }

  // ========== ADDRESSES ==========

  @Get('addresses')
  @ApiOperation({ summary: 'Get user addresses' })
  async getAddresses(@Req() req) {
    const addresses = await this.prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' },
    });

    console.log('Prisma findMany result:', addresses);
    console.log('Is array:', Array.isArray(addresses));

    return {
      success: true,
      data: addresses,
    };
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Create new address' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  async createAddress(@Req() req, @Body() dto: CreateAddressDto) {
    try {
      console.log('Creating address for user:', req.user);
      console.log('DTO:', dto);
      // If setting as default, unset other defaults first
      if (dto.isDefault) {
        await this.prisma.address.updateMany({
          where: { userId: req.user.id },
          data: { isDefault: false },
        });
      }

      const address = await this.prisma.address.create({
        data: {
          label: dto.label || 'Mi dirección',
          street: dto.street,
          city: dto.city,
          state: dto.state,
          zipCode: dto.zipCode,
          phone: dto.phone,
          isDefault: dto.isDefault || false,
          userId: req.user.id,
        },
      });

      return {
        success: true,
        data: address,
        message: 'Dirección guardada exitosamente',
      };
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  @Put('addresses/:id')
  @ApiOperation({ summary: 'Update address' })
  async updateAddress(
    @Req() req,
    @Body() dto: UpdateAddressDto,
    @Param('id') id: string,
  ) {
    // Verify address belongs to user
    const existing = await this.prisma.address.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return {
        success: false,
        message: 'Dirección no encontrada',
      };
    }

    // If setting as default, unset other defaults first
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.update({
      where: { id },
      data: dto,
    });

    return {
      success: true,
      data: address,
      message: 'Dirección actualizada exitosamente',
    };
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Delete address' })
  async deleteAddress(@Req() req, @Param('id') id: string) {
    // Verify address belongs to user
    const existing = await this.prisma.address.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return {
        success: false,
        message: 'Dirección no encontrada',
      };
    }

    await this.prisma.address.delete({ where: { id } });

    return {
      success: true,
      message: 'Dirección eliminada exitosamente',
    };
  }

  // ========== PAYMENT METHODS ==========

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get user payment methods' })
  async getPaymentMethods(@Req() req) {
    const methods = await this.prisma.paymentMethod.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' },
    });

    return {
      success: true,
      data: methods,
    };
  }

  @Post('payment-methods')
  @ApiOperation({ summary: 'Create payment method' })
  async createPaymentMethod(@Req() req, @Body() dto: CreatePaymentMethodDto) {
    // If setting as default, unset other defaults first
    if (dto.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const method = await this.prisma.paymentMethod.create({
      data: {
        brand: dto.brand,
        last4: dto.last4,
        expiryMonth: dto.expiryMonth,
        expiryYear: dto.expiryYear,
        bank: dto.bank,
        isDefault: dto.isDefault || false,
        userId: req.user.id,
      },
    });

    return {
      success: true,
      data: method,
      message: 'Método de pago guardado exitosamente',
    };
  }

  @Put('payment-methods/:id')
  @ApiOperation({ summary: 'Update payment method' })
  async updatePaymentMethod(
    @Req() req,
    @Body() dto: CreatePaymentMethodDto,
    @Param('id') id: string,
  ) {
    // Verify method belongs to user
    const existing = await this.prisma.paymentMethod.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return {
        success: false,
        message: 'Método de pago no encontrado',
      };
    }

    // If setting as default, unset other defaults first
    if (dto.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const method = await this.prisma.paymentMethod.update({
      where: { id },
      data: dto,
    });

    return {
      success: true,
      data: method,
      message: 'Método de pago actualizado exitosamente',
    };
  }

  @Delete('payment-methods/:id')
  @ApiOperation({ summary: 'Delete payment method' })
  async deletePaymentMethod(@Req() req, @Param('id') id: string) {
    // Verify method belongs to user
    const existing = await this.prisma.paymentMethod.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return {
        success: false,
        message: 'Método de pago no encontrado',
      };
    }

    await this.prisma.paymentMethod.delete({ where: { id } });

    return {
      success: true,
      message: 'Método de pago eliminado exitosamente',
    };
  }
}
