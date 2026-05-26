import { httpClient } from './http-client';
import { UserRole } from '@/types/auth';

// User interfaces for admin operations
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  orderCount?: number;
  totalSpent?: number;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
  sortBy?: 'email' | 'firstName' | 'lastName' | 'createdAt' | 'lastLoginAt';
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

// Admin user service for user management
export const adminUserService = {
  // Get all users (admin view with all fields)
  getAll: async (params?: UserQueryParams): Promise<ApiResponse<AdminUser[]>> => {
    return httpClient.get<AdminUser[]>('/admin/users', params);
  },

  // Get user by ID (admin view)
  getById: async (id: string): Promise<ApiResponse<AdminUser>> => {
    return httpClient.get<AdminUser>(`/admin/users/${id}`);
  },

  // Create new user
  create: async (data: CreateUserRequest): Promise<ApiResponse<AdminUser>> => {
    return httpClient.post<AdminUser>('/admin/users', data);
  },

  // Update existing user
  update: async (id: string, data: UpdateUserRequest): Promise<ApiResponse<AdminUser>> => {
    return httpClient.patch<AdminUser>(`/admin/users/${id}`, data);
  },

  // Delete user
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return httpClient.delete<void>(`/admin/users/${id}`);
  },

  // Toggle user active status
  toggleActive: async (id: string): Promise<ApiResponse<AdminUser>> => {
    return httpClient.patch<AdminUser>(`/admin/users/${id}/toggle-active`);
  },

  // Toggle email verification
  toggleEmailVerified: async (id: string): Promise<ApiResponse<AdminUser>> => {
    return httpClient.patch<AdminUser>(`/admin/users/${id}/toggle-email-verified`);
  },

  // Reset user password
  resetPassword: async (id: string, newPassword: string): Promise<ApiResponse<void>> => {
    return httpClient.post<void>(`/admin/users/${id}/reset-password`, { newPassword });
  },

  // Get user analytics
  getAnalytics: async (id: string, period?: '7d' | '30d' | '90d'): Promise<ApiResponse<{
    orderCount: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: string;
    favoriteCategory?: string;
    orderFrequency: string;
  }>> => {
    return httpClient.get(`/admin/users/${id}/analytics`, { period });
  },

  // Bulk operations
  bulkUpdate: async (updates: Array<{ id: string; data: UpdateUserRequest }>): Promise<ApiResponse<AdminUser[]>> => {
    return httpClient.post<AdminUser[]>('/admin/users/bulk', { updates });
  },

  bulkDelete: async (ids: string[]): Promise<ApiResponse<void>> => {
    return httpClient.post<void>('/admin/users/bulk-delete', { ids });
  },

  // Export users
  export: async (params?: UserQueryParams): Promise<ApiResponse<{
    csv: string;
    filename: string;
  }>> => {
    return httpClient.get('/admin/users/export', params);
  },

  // Get user statistics
  getStats: async (): Promise<ApiResponse<{
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    adminUsers: number;
    newUsersThisMonth: number;
    usersGrowthRate: number;
  }>> => {
    return httpClient.get('/admin/users/stats');
  }
};

export default adminUserService;
