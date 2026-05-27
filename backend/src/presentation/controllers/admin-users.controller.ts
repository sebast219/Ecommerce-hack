// 🏗️ PRESENTATION CONTROLLERS - Admin Users
// PROPÓSITO: Manejar requests HTTP de administración de usuarios

import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';

// DTOs
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
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN'])
  role?: 'USER' | 'ADMIN';

  @IsOptional()
  isVerified?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN'])
  role?: 'USER' | 'ADMIN';

  @IsOptional()
  isVerified?: boolean;

  @IsOptional()
  @IsString()
  avatar?: string;
}

@ApiTags('Admin Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminUsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (admin view)' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  async getAllUsers() {
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: users,
        message: 'Users retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics for admin' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  async getUserStats() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const totalUsers = await this.prisma.user.count();
      const verifiedUsers = await this.prisma.user.count({
        where: { isVerified: true },
      });
      const adminUsers = await this.prisma.user.count({
        where: { role: 'ADMIN' },
      });
      const newUsersThisMonth = await this.prisma.user.count({
        where: {
          createdAt: { gte: startOfMonth },
        },
      });

      // Active users: users who have placed an order in the last 30 days
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const activeUsers = await this.prisma.user.count({
        where: {
          orders: {
            some: {
              createdAt: { gte: thirtyDaysAgo },
            },
          },
        },
      });

      // Calculate growth rate based on previous month
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      const usersLastMonth = await this.prisma.user.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      });

      const usersGrowthRate = usersLastMonth > 0
        ? ((newUsersThisMonth - usersLastMonth) / usersLastMonth) * 100
        : 0;

      return {
        success: true,
        data: {
          totalUsers,
          activeUsers,
          verifiedUsers,
          adminUsers,
          newUsersThisMonth,
          usersGrowthRate,
        },
        message: 'User statistics retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (admin view)' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
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
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
        message: 'User retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create new user (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto) {
    try {
      // Check if email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        return {
          success: false,
          message: 'Email already exists',
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          password: hashedPassword,
          phone: dto.phone,
          role: dto.role || 'USER',
          isVerified: dto.isVerified || false,
          certifications: '[]',
        },
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
        },
      });

      return {
        success: true,
        data: user,
        message: 'User created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // If updating email, check if it's already taken by another user
      if (dto.email && dto.email !== existingUser.email) {
        const emailTaken = await this.prisma.user.findUnique({
          where: { email: dto.email },
        });

        if (emailTaken) {
          return {
            success: false,
            message: 'Email already exists',
          };
        }
      }

      // Build update data object
      const updateData: any = {};
      if (dto.email !== undefined) updateData.email = dto.email;
      if (dto.firstName !== undefined) updateData.firstName = dto.firstName;
      if (dto.lastName !== undefined) updateData.lastName = dto.lastName;
      if (dto.phone !== undefined) updateData.phone = dto.phone;
      if (dto.role !== undefined) updateData.role = dto.role;
      if (dto.isVerified !== undefined) updateData.isVerified = dto.isVerified;
      if (dto.avatar !== undefined) updateData.avatar = dto.avatar;

      // Update user
      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
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
        },
      });

      return {
        success: true,
        data: user,
        message: 'User updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string) {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Prevent deleting the last admin
      if (existingUser.role === 'ADMIN') {
        const adminCount = await this.prisma.user.count({
          where: { role: 'ADMIN' },
        });

        if (adminCount <= 1) {
          return {
            success: false,
            message: 'Cannot delete the last admin user',
          };
        }
      }

      // Delete user (cascade will handle related records)
      await this.prisma.user.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
