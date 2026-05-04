// 🏗️ APPLICATION SERVICES - Dashboard
// PROPÓSITO: Lógica de negocio para estadísticas del dashboard

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Ventas totales
    const totalSales = await this.prisma.order.aggregate({
      where: {
        status: { in: ['COMPLETED', 'PAID'] }
      },
      _sum: { total: true }
    });

    // Pedidos hoy
    const todayOrders = await this.prisma.order.count({
      where: {
        createdAt: { gte: startOfDay }
      }
    });

    // Pedidos mes pasado para calcular cambio
    const lastMonthOrders = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      }
    });

    // Pedidos este mes
    const thisMonthOrders = await this.prisma.order.count({
      where: {
        createdAt: { gte: startOfMonth }
      }
    });

    // Productos activos
    const activeProducts = await this.prisma.product.count({
      where: { isActive: true }
    });

    // Usuarios nuevos hoy
    const newUsersToday = await this.prisma.user.count({
      where: {
        createdAt: { gte: startOfDay }
      }
    });

    // Usuarios nuevos mes pasado
    const lastMonthUsers = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      }
    });

    // Usuarios nuevos este mes
    const thisMonthUsers = await this.prisma.user.count({
      where: {
        createdAt: { gte: startOfMonth }
      }
    });

    // Calcular porcentajes de cambio
    const ordersChange = lastMonthOrders > 0 
      ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1)
      : '0.0';

    const usersChange = lastMonthUsers > 0
      ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100).toFixed(1)
      : '0.0';

    return [
      {
        label: 'Ventas Totales',
        value: `$${(totalSales._sum.total || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: '+12.5%', // Placeholder - se puede calcular con datos históricos
        trend: 'up' as const,
        icon: 'DollarSign'
      },
      {
        label: 'Pedidos Hoy',
        value: todayOrders.toString(),
        change: ordersChange.startsWith('-') ? ordersChange : `+${ordersChange}%`,
        trend: ordersChange.startsWith('-') ? 'down' as const : 'up' as const,
        icon: 'ShoppingCart'
      },
      {
        label: 'Productos Activos',
        value: activeProducts.toLocaleString('es-ES'),
        change: '+3.1%', // Placeholder
        trend: 'up' as const,
        icon: 'Package'
      },
      {
        label: 'Usuarios Nuevos',
        value: newUsersToday.toString(),
        change: usersChange.startsWith('-') ? usersChange : `+${usersChange}%`,
        trend: usersChange.startsWith('-') ? 'down' as const : 'up' as const,
        icon: 'Users'
      }
    ];
  }

  async getRecentOrders() {
    const orders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return orders.map(order => ({
      id: `#${order.orderNumber}`,
      customer: `${order.user.firstName} ${order.user.lastName}`,
      product: order.items[0]?.product.name || 'Multiple products',
      amount: `$${order.total.toFixed(2)}`,
      status: this.translateStatus(order.status),
      date: this.formatRelativeTime(order.createdAt)
    }));
  }

  async getTopProducts() {
    // Obtener productos más vendidos basados en orderItems
    const topProducts = await this.prisma.product.findMany({
      take: 4,
      include: {
        orderItems: {
          include: {
            order: true
          }
        }
      }
    });

    return topProducts
      .map(product => {
        // Filtrar solo los pedidos completados o pagados
        const validOrderItems = product.orderItems.filter(item => 
          item.order && ['COMPLETED', 'PAID'].includes(item.order.status)
        );
        const totalSales = validOrderItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalRevenue = validOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
          name: product.name,
          sales: totalSales,
          revenue: `$${totalRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          growth: `+${Math.floor(Math.random() * 25 + 5)}%` // Placeholder - se puede calcular con datos históricos
        };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);
  }

  async getSalesActivity() {
    // Obtener datos de ventas de los últimos 30 días
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ['COMPLETED', 'PAID'] }
      },
      select: {
        total: true,
        createdAt: true
      }
    });

    // Agrupar por día
    const dailySales: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      dailySales[dateKey] = 0;
    }

    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      if (dailySales.hasOwnProperty(dateKey)) {
        dailySales[dateKey] += order.total;
      }
    });

    // Convertir al formato esperado para el gráfico
    const chartData = Object.values(dailySales).map(sales => ({
      value: sales,
      label: `$${sales.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }));

    return chartData;
  }

  private translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'Pendiente',
      'PAID': 'En proceso',
      'COMPLETED': 'Completado',
      'CANCELLED': 'Cancelado',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado'
    };
    return statusMap[status] || status;
  }

  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) { // 24 horas
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
  }
}
