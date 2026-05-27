'use client';

import { tokenManager } from './token-manager';

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: any;
  message?: string;
}

interface RequestConfig extends RequestInit {
  params?: Record<string, any>;
  skipAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    // Fallback to localhost if env var is not set (for development)
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  }

  // Token management via TokenManager
  private getAccessToken(): string | null {
    const token = tokenManager.getAccessToken();
    if (token) return token;
    
    // Fallback: try to read from auth-store if tokenManager is empty
    // This handles edge cases where tokenManager and auth-store get out of sync
    if (typeof window !== 'undefined') {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          const state = parsed.state;
          if (state?.token) {
            // Sync back to tokenManager for consistency
            tokenManager.setTokens(state.token, state.refreshToken);
            return state.token;
          }
        }
      } catch {
        // Ignore parsing errors
      }
    }
    
    return null;
  }

  private getRefreshToken(): string | null {
    const token = tokenManager.getRefreshToken();
    if (token) return token;
    
    // Fallback: try to read from auth-store if tokenManager is empty
    if (typeof window !== 'undefined') {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          const state = parsed.state;
          if (state?.refreshToken) {
            return state.refreshToken;
          }
        }
      } catch {
        // Ignore parsing errors
      }
    }
    
    return null;
  }

  setTokens(accessToken: string, refreshToken: string) {
    tokenManager.setTokens(accessToken, refreshToken);
  }

  clearTokens() {
    tokenManager.clearTokens();
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { params, skipAuth, ...fetchConfig } = config;

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const headers: Record<string, string> = {
      ...(fetchConfig.headers as Record<string, string>),
    };

    // Only set Content-Type for non-FormData requests
    // FormData requires browser to set Content-Type with boundary automatically
    if (!(fetchConfig.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (!skipAuth) {
      const token = this.getAccessToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      let response = await fetch(url, { ...fetchConfig, headers });

      // Auto-refresh on 401
      if (response.status === 401 && !skipAuth) {
        const newToken = await this.handleRefresh();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, { ...fetchConfig, headers });
        }
      }

      return this.handleResponse<T>(response);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const errorData = isJson ? await response.json().catch(() => ({})) : {};
      throw {
        status: response.status,
        message: errorData.message || `Error ${response.status}`,
        data: errorData,
      };
    }

    if (response.status === 204) return { success: true, data: null as any };
    return isJson ? response.json() : ({ success: true, data: null as any });
  }

  private async handleRefresh(): Promise<string | null> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = this._doRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    return result;
  }

  private async _doRefresh(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          window.location.href = '/auth/login';
        }
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.data?.accessToken || data.accessToken;
      const newRefreshToken = data.data?.refreshToken || data.refreshToken;
      this.setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    } catch {
      this.clearTokens();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
      }
      return null;
    }
  }

  private handleError(error: any): Error {
    if (error.status) return error;
    return new Error(error.message || 'Network error');
  }

  get<T>(endpoint: string, params?: any) {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
