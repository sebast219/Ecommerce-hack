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
  getStats: async (): Promise<ApiResponse<DashboardStats[]>> => {
    return httpClient.get<DashboardStats[]>('/admin/dashboard/stats');
  },

  // Recent orders
  getRecentOrders: async (): Promise<ApiResponse<RecentOrder[]>> => {
    return httpClient.get<RecentOrder[]>('/admin/dashboard/recent-orders');
  },

  // Top selling products
  getTopProducts: async (): Promise<ApiResponse<TopProduct[]>> => {
    return httpClient.get<TopProduct[]>('/admin/dashboard/top-products');
  },

  // Sales activity
  getSalesActivity: async (): Promise<ApiResponse<SalesActivity[]>> => {
    return httpClient.get<SalesActivity[]>('/admin/dashboard/sales-activity');
  },

  // Get dashboard summary (all data in one call)
  getDashboardSummary: async (): Promise<{
    stats: DashboardStats[];
    recentOrders: RecentOrder[];
    topProducts: TopProduct[];
    salesActivity: SalesActivity[];
  }> => {
    const [statsResponse, ordersResponse, productsResponse, activityResponse] = await Promise.all([
      adminService.getStats(),
      adminService.getRecentOrders(),
      adminService.getTopProducts(),
      adminService.getSalesActivity()
    ]);

    return {
      stats: statsResponse.data,
      recentOrders: ordersResponse.data,
      topProducts: productsResponse.data,
      salesActivity: activityResponse.data
    };
  }
};

export default adminService;
