// 🏗️ PRESENTATION CONTROLLERS - Dashboard
// PROPÓSITO: Manejar requests HTTP del dashboard de administración

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { DashboardService } from '../../application/services/dashboard.service';

@ApiTags('Dashboard')
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
  })
  async getDashboardStats() {
    try {
      const stats = await this.dashboardService.getStats();

      return {
        success: true,
        data: stats,
        message: 'Dashboard statistics retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('recent-orders')
  @ApiOperation({ summary: 'Get recent orders with customer details' })
  @ApiResponse({
    status: 200,
    description: 'Recent orders retrieved successfully',
  })
  async getRecentOrders() {
    try {
      const orders = await this.dashboardService.getRecentOrders();

      return {
        success: true,
        data: orders,
        message: 'Recent orders retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Get top-selling products' })
  @ApiResponse({
    status: 200,
    description: 'Top products retrieved successfully',
  })
  async getTopProducts() {
    try {
      const products = await this.dashboardService.getTopProducts();

      return {
        success: true,
        data: products,
        message: 'Top products retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('sales-activity')
  @ApiOperation({ summary: 'Get sales activity for the last 30 days' })
  @ApiResponse({
    status: 200,
    description: 'Sales activity retrieved successfully',
  })
  async getSalesActivity() {
    try {
      const activity = await this.dashboardService.getSalesActivity();

      return {
        success: true,
        data: activity,
        message: 'Sales activity retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
