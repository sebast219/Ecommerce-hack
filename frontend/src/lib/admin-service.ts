import { httpClient } from './http-client';

// Dashboard statistics interfaces
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  productsGrowth: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
}

export interface TopProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  totalSales: number;
  totalRevenue: number;
  image?: string;
}

export interface SalesActivity {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

// Admin service for dashboard operations
export const adminService = {
  // Dashboard statistics
  getStats: async (): Promise<DashboardStats[]> => {
    const response = await httpClient.get<any>('/admin/dashboard/stats');
    // Handle nested response: response.data.data
    const data = response.data?.data || response.data || [];
    console.log('Dashboard stats response:', data);
    return data;
  },

  // Recent orders
  getRecentOrders: async (): Promise<RecentOrder[]> => {
    const response = await httpClient.get<any>('/admin/dashboard/recent-orders');
    const data = response.data?.data || response.data || [];
    console.log('Recent orders response:', data);
    return data;
  },

  // Top selling products
  getTopProducts: async (): Promise<TopProduct[]> => {
    const response = await httpClient.get<any>('/admin/dashboard/top-products');
    const data = response.data?.data || response.data || [];
    console.log('Top products response:', data);
    return data;
  },

  // Sales activity
  getSalesActivity: async (): Promise<SalesActivity[]> => {
    const response = await httpClient.get<any>('/admin/dashboard/sales-activity');
    const data = response.data?.data || response.data || [];
    console.log('Sales activity response:', data);
    return data;
  },

  // Get dashboard summary (all data in one call)
  getDashboardSummary: async (): Promise<{
    stats: DashboardStats[];
    recentOrders: RecentOrder[];
    topProducts: TopProduct[];
    salesActivity: SalesActivity[];
  }> => {
    const [stats, orders, products, activity] = await Promise.all([
      adminService.getStats(),
      adminService.getRecentOrders(),
      adminService.getTopProducts(),
      adminService.getSalesActivity()
    ]);

    return {
      stats,
      recentOrders: orders,
      topProducts: products,
      salesActivity: activity
    };
  }
};

export default adminService;
