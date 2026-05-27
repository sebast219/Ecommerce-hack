import { httpClient } from './http-client';

// Product interfaces for admin operations
export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  barcode?: string;
  trackInventory: boolean;
  inventoryCount: number;
  isActive: boolean;
  images: string[];
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  barcode?: string;
  trackInventory: boolean;
  inventoryCount: number;
  isActive: boolean;
  images: string[];
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  categoryId?: string;
}

export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  comparePrice?: number;
  sku?: string;
  barcode?: string;
  trackInventory?: boolean;
  inventoryCount?: number;
  isActive?: boolean;
  images?: string[];
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  categoryId?: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
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

// Admin product service for CRUD operations
export const adminProductService = {
  // Get all products (admin view with all fields)
  getAll: async (params?: ProductQueryParams): Promise<ApiResponse<AdminProduct[]>> => {
    const response: any = await httpClient.get<AdminProduct[]>('/admin/products', params);
    return response.data?.data || response.data;
  },

  // Get product by ID (admin view)
  getById: async (id: string): Promise<ApiResponse<AdminProduct>> => {
    return httpClient.get<AdminProduct>(`/admin/products/${id}`);
  },

  // Create new product
  create: async (data: CreateProductRequest): Promise<ApiResponse<AdminProduct>> => {
    return httpClient.post<AdminProduct>('/admin/products', data);
  },

  // Update existing product
  update: async (id: string, data: UpdateProductRequest): Promise<ApiResponse<AdminProduct>> => {
    return httpClient.patch<AdminProduct>(`/admin/products/${id}`, data);
  },

  // Delete product
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return httpClient.delete<void>(`/admin/products/${id}`);
  },

  // Bulk operations
  bulkUpdate: async (updates: Array<{ id: string; data: UpdateProductRequest }>): Promise<ApiResponse<AdminProduct[]>> => {
    return httpClient.post<AdminProduct[]>('/admin/products/bulk', { updates });
  },

  bulkDelete: async (ids: string[]): Promise<ApiResponse<void>> => {
    return httpClient.post<void>('/admin/products/bulk-delete', { ids });
  },

  // Toggle product active status
  toggleActive: async (id: string): Promise<ApiResponse<AdminProduct>> => {
    return httpClient.patch<AdminProduct>(`/admin/products/${id}/toggle-active`);
  },

  // Update inventory
  updateInventory: async (id: string, inventoryCount: number): Promise<ApiResponse<AdminProduct>> => {
    return httpClient.patch<AdminProduct>(`/admin/products/${id}/inventory`, { inventoryCount });
  },

  // Get product analytics
  getAnalytics: async (id: string, period?: '7d' | '30d' | '90d'): Promise<ApiResponse<{
    views: number;
    sales: number;
    revenue: number;
    conversionRate: number;
    averageRating: number;
    reviewCount: number;
  }>> => {
    return httpClient.get(`/admin/products/${id}/analytics`, { period });
  }
};

export default adminProductService;
