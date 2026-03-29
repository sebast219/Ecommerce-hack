// USE PRODUCTS HOOK - EJERCICIO PRÁCTICO
// OBJETIVO: Aprender a crear custom hooks con estado asíncrono

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/cart';

// Interfaces
interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  fetchProducts: (filters?: Filters) => void;
}

interface Filters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface ProductResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseProductsReturn['pagination'] | null>(null);

  const fetchProducts = useCallback(async (filters: Filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      // Construir query params
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('categoryId', filters.category);
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      // Llamar al backend
      const response = await fetch(`/api/products?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Handle double-nested response: { success: true, data: { success: true, data: { products... } } }
      const innerData = result.data?.data || result.data || result;

      // Map backend pagination to frontend format
      const backendPagination = innerData.pagination || {
        page: innerData.page || 1,
        limit: innerData.limit || 20,
        total: innerData.total || 0,
        totalPages: innerData.totalPages || 1
      };

      const productsList = innerData.products || [];
      
      setProducts(productsList);
      setPagination({
        page: backendPagination.page,
        limit: backendPagination.limit,
        total: backendPagination.total,
        pages: backendPagination.totalPages
      });
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar productos iniciales al montar el componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    pagination,
    fetchProducts,
  };
}
