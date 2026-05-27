// 🏗️ PRESENTATION CONTROLLERS - Admin Orders
// PROPÓSITO: Manejar requests HTTP de administración de órdenes

import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { DashboardService } from '../../application/services/dashboard.service';

@ApiTags('Admin Orders')
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminOrdersController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders (admin view)' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
  })
  async getAllOrders() {
    try {
      const orders = await this.dashboardService['prisma'].order.findMany({
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
          shippingAddress: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Transform orders to match frontend interface
      const transformedOrders = orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        currency: 'USD',
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        discount: 0,
        total: order.total,
        notes: order.notes,
        shippingName: order.customerName,
        shippingEmail: order.customerEmail,
        shippingPhone: order.shippingAddress?.phone,
        shippingAddress: order.shippingAddress ? {
          street: order.shippingAddress.street,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          postalCode: order.shippingAddress.zipCode,
          country: 'Colombia',
          apartment: '',
        } : {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'Colombia',
          apartment: '',
        },
        billingAddress: null,
        userId: order.userId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
          product: item.product,
        })),
        payment: null,
        trackingNumber: order.trackingNumber,
        trackingCarrier: order.trackingCarrier,
        estimatedDelivery: order.estimatedDelivery?.toISOString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        paidAt: order.paidAt?.toISOString(),
        shippedAt: order.shippedAt?.toISOString(),
        deliveredAt: order.deliveredAt?.toISOString(),
        cancelledAt: order.cancelledAt?.toISOString(),
        expiresAt: order.expiresAt?.toISOString(),
      }));

      return {
        success: true,
        data: transformedOrders,
        message: 'Orders retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics for admin' })
  @ApiResponse({
    status: 200,
    description: 'Order statistics retrieved successfully',
  })
  async getOrderStats() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get all orders
      const allOrders = await this.dashboardService['prisma'].order.findMany();

      // Calculate stats
      const totalOrders = allOrders.length;
      const pendingOrders = allOrders.filter(o => o.status === 'PENDING').length;
      const processingOrders = allOrders.filter(o => o.status === 'PAID' || o.status === 'PROCESSING').length;
      const shippedOrders = allOrders.filter(o => o.status === 'SHIPPED').length;
      const deliveredOrders = allOrders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length;
      const cancelledOrders = allOrders.filter(o => o.status === 'CANCELLED').length;

      const totalRevenue = allOrders
        .filter(o => ['COMPLETED', 'PAID', 'DELIVERED'].includes(o.status))
        .reduce((sum, o) => sum + o.total, 0);

      const revenueThisMonth = allOrders
        .filter(o => 
          ['COMPLETED', 'PAID', 'DELIVERED'].includes(o.status) &&
          o.createdAt >= startOfMonth
        )
        .reduce((sum, o) => sum + o.total, 0);

      // Calculate growth (simplified)
      const revenueGrowth = 0;

      return {
        success: true,
        data: {
          totalOrders,
          pendingOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          totalRevenue,
          revenueThisMonth,
          revenueGrowth,
        },
        message: 'Order statistics retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get order analytics for admin' })
  @ApiResponse({
    status: 200,
    description: 'Order analytics retrieved successfully',
  })
  async getOrderAnalytics(@Query('period') period: string = '30d') {
    try {
      const now = new Date();
      let days = 30;
      
      if (period === '7d') days = 7;
      else if (period === '90d') days = 90;
      else if (period === '1y') days = 365;

      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      // Get orders in period
      const orders = await this.dashboardService['prisma'].order.findMany({
        where: {
          createdAt: { gte: startDate },
          status: { in: ['COMPLETED', 'PAID', 'DELIVERED'] },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Calculate daily orders
      const dailyOrders: Record<string, { orders: number; revenue: number }> = {};
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateKey = date.toISOString().split('T')[0];
        dailyOrders[dateKey] = { orders: 0, revenue: 0 };
      }

      orders.forEach((order) => {
        const dateKey = order.createdAt.toISOString().split('T')[0];
        if (dailyOrders[dateKey]) {
          dailyOrders[dateKey].orders += 1;
          dailyOrders[dateKey].revenue += order.total;
        }
      });

      const dailyOrdersArray = Object.entries(dailyOrders).map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: data.revenue,
      }));

      // Calculate top products
      const productSales: Record<string, { name: string; totalSales: number; totalRevenue: number }> = {};

      orders.forEach((order) => {
        order.items.forEach((item) => {
          const productId = item.productId;
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.product.name,
              totalSales: 0,
              totalRevenue: 0,
            };
          }
          productSales[productId].totalSales += item.quantity;
          productSales[productId].totalRevenue += item.price * item.quantity;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10)
        .map((p, index) => ({
          productId: index.toString(),
          productName: p.name,
          totalSales: p.totalSales,
          totalRevenue: p.totalRevenue,
        }));

      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      return {
        success: true,
        data: {
          totalOrders: orders.length,
          totalRevenue,
          averageOrderValue,
          ordersByStatus: {},
          revenueByStatus: {},
          topProducts,
          dailyOrders: dailyOrdersArray,
        },
        message: 'Order analytics retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
