import { httpClient } from './http-client';

// Order interfaces for admin operations
export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'AWAITING_PAYMENT' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'EXPIRED';
  currency: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  notes?: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    apartment?: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    apartment?: string;
  };
  userId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    productId: string;
    product?: {
      id: string;
      name: string;
      slug: string;
      images: string[];
    };
  }>;
  payment?: {
    id: string;
    amount: {
      amount: number;
      currency: string;
    };
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
    provider: string;
    providerId?: string;
    failureReason?: string;
  };
  trackingNumber?: string;
  trackingCarrier?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  expiresAt?: string;
}

export interface UpdateOrderRequest {
  status?: 'PENDING' | 'AWAITING_PAYMENT' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'EXPIRED';
  trackingNumber?: string;
  trackingCarrier?: string;
  estimatedDelivery?: string;
  notes?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    apartment?: string;
  };
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  userId?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'total' | 'orderNumber';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// Admin order service for order management
export const adminOrderService = {
  // Get all orders (admin view with all fields)
  getAll: async (params?: OrderQueryParams): Promise<ApiResponse<AdminOrder[]>> => {
    const response: any = await httpClient.get<AdminOrder[]>('/admin/orders', params);
    return response.data?.data || response.data;
  },

  // Get order by ID (admin view)
  getById: async (id: string): Promise<ApiResponse<AdminOrder>> => {
    return httpClient.get<AdminOrder>(`/admin/orders/${id}`);
  },

  // Update order status and details
  update: async (id: string, data: UpdateOrderRequest): Promise<ApiResponse<AdminOrder>> => {
    return httpClient.patch<AdminOrder>(`/admin/orders/${id}`, data);
  },

  // Update order status
  updateStatus: async (id: string, status: string): Promise<ApiResponse<AdminOrder>> => {
    return httpClient.patch<AdminOrder>(`/admin/orders/${id}/status`, { status });
  },

  // Add tracking information
  addTracking: async (id: string, trackingNumber: string, trackingCarrier: string, estimatedDelivery?: string): Promise<ApiResponse<AdminOrder>> => {
    return httpClient.post<AdminOrder>(`/admin/orders/${id}/tracking`, {
      trackingNumber,
      trackingCarrier,
      estimatedDelivery
    });
  },

  // Cancel order
  cancel: async (id: string, reason?: string): Promise<ApiResponse<AdminOrder>> => {
    return httpClient.post<AdminOrder>(`/admin/orders/${id}/cancel`, { reason });
  },

  // Refund order
  refund: async (id: string, amount?: number, reason?: string): Promise<ApiResponse<AdminOrder>> => {
    return httpClient.post<AdminOrder>(`/admin/orders/${id}/refund`, { amount, reason });
  },

  // Delete order (soft delete or hard delete depending on backend)
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return httpClient.delete<void>(`/admin/orders/${id}`);
  },

  // Get order analytics
  getAnalytics: async (period?: '7d' | '30d' | '90d' | '1y'): Promise<any> => {
    const response: any = await httpClient.get('/admin/orders/analytics', { period });
    return response.data?.data || response.data;
  },

  // Export orders
  export: async (params?: OrderQueryParams): Promise<ApiResponse<{
    csv: string;
    filename: string;
  }>> => {
    return httpClient.get('/admin/orders/export', params);
  },

  // Get order statistics
  getStats: async (): Promise<any> => {
    const response: any = await httpClient.get('/admin/orders/stats');
    return response.data?.data || response.data;
  },

  // Bulk operations
  bulkUpdateStatus: async (updates: Array<{ id: string; status: string }>): Promise<ApiResponse<AdminOrder[]>> => {
    return httpClient.post<AdminOrder[]>('/admin/orders/bulk-status', { updates });
  },

  bulkCancel: async (ids: string[], reason?: string): Promise<ApiResponse<AdminOrder[]>> => {
    return httpClient.post<AdminOrder[]>('/admin/orders/bulk-cancel', { ids, reason });
  }
};

export default adminOrderService;
