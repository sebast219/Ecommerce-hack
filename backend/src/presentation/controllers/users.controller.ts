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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { File } from 'multer';
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
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
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

  // ========== ADMIN USER MANAGEMENT ==========

  @Get('all')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getAllUsers(@Req() req) {
    // Verificar si el usuario es administrador
    if (req.user.role !== 'ADMIN') {
      return {
        success: false,
        message: 'Acceso denegado. Se requiere rol de administrador.',
      };
    }

    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          phone: true,
          avatar: true,
          // No incluir la contraseña
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: users,
        message: 'Usuarios obtenidos exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener usuarios',
        error: error.message,
      };
    }
  }

  // ========== PROFILE ==========

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    const updateData: any = {};

    // Solo actualizar campos si se proporcionan
    if (dto.firstName !== undefined) {
      updateData.firstName = dto.firstName;
    }
    if (dto.lastName !== undefined) {
      updateData.lastName = dto.lastName;
    }
    if (dto.email !== undefined) {
      updateData.email = dto.email;
    }
    if (dto.avatar !== undefined) {
      // Si el avatar es base64, guardarlo como archivo
      if (dto.avatar.startsWith('data:image/')) {
        console.log('=== PROCESSING BASE64 AVATAR ===');
        try {
          const fs = require('fs');
          const path = require('path');
          
          // Extraer el tipo y los datos base64
          const matches = dto.avatar.match(/^data:image\/(\w+);base64,(.+)$/);
          if (!matches) {
            console.log('Invalid base64 format');
            return {
              success: false,
              message: 'Formato de imagen inválido',
            };
          }
          
          const imageType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Crear nombre de archivo único
          const filename = `${req.user.id}-${Date.now()}-${Math.round(Math.random() * 1E9)}.${imageType}`;
          const uploadPath = join(process.cwd(), 'uploads', 'avatars');
          const filePath = path.join(uploadPath, filename);
          
          // Asegurar que el directorio exista
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          
          // Guardar archivo
          fs.writeFileSync(filePath, buffer);
          
          // Guardar la URL relativa en la base de datos
          updateData.avatar = `/uploads/avatars/${filename}`;
          console.log('Base64 avatar saved as:', updateData.avatar);
        } catch (error) {
          console.error('Error saving base64 avatar:', error);
          return {
            success: false,
            message: 'Error al guardar la imagen',
            error: error.message,
          };
        }
      } else {
        // Si es una URL normal, guardarla directamente
        updateData.avatar = dto.avatar;
      }
    }

    // Verificar que haya al menos un campo para actualizar
    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        message: 'No fields provided for update',
      };
    }

    const user = await this.prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
      },
    });

    return {
      success: true,
      data: user,
      message: 'Perfil actualizado exitosamente',
    };
  }

  // ========== AVATAR UPLOAD ==========

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'avatars');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          cb(null, `${req.user.id}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png, gif)'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiResponse({ status: 200, description: 'Avatar uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file format or size' })
  async uploadAvatar(
    @Req() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
      }),
    )
    file: File,
  ) {
    console.log('=== UPLOAD AVATAR DEBUG ===');
    console.log('User ID:', req.user.id);
    console.log('File received:', file ? 'YES' : 'NO');
    
    if (!file) {
      console.log('ERROR: No file provided');
      return {
        success: false,
        message: 'No se proporcionó ningún archivo',
      };
    }

    console.log('File details:', {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    });

    // Guardar la ruta del archivo en la base de datos
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    console.log('Avatar URL to save:', avatarUrl);
    
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: req.user.id },
        data: { avatar: avatarUrl },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      });
      
      console.log('User updated successfully:', updatedUser);
      
      return {
        success: true,
        data: {
          avatarUrl: avatarUrl,
          filename: file.filename,
          user: updatedUser,
        },
        message: 'Avatar subido exitosamente',
      };
    } catch (error) {
      console.error('ERROR updating user avatar:', error);
      return {
        success: false,
        message: 'Error al guardar el avatar en la base de datos',
        error: error.message,
      };
    }
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
