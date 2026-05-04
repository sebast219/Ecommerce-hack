// USE PRODUCTS HOOK - EJERCICIO PRÁCTICO
// OBJETIVO: Aprender a crear custom hooks con estado asíncrono

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/cart';
import { apiClient } from '@/lib/api-client';

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

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseProductsReturn['pagination'] | null>(null);

  const fetchProducts = useCallback(async (filters: Filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      // Llamar al backend con apiClient
      const response = await apiClient.get('/products', filters);
      
      // Handle double-nested response: { success: true, data: { success: true, data: { products... } } }
      const innerData = (response.data as any)?.data?.data || (response.data as any)?.data || response.data;

      // Transform backend data to frontend format
      const productsList = (innerData.products || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        images: Array.isArray(product.images) ? product.images : [product.images],
        sku: product.sku,
        category: product.category,
        inventory: product.inventory
      }));

      // Map backend pagination to frontend format
      const backendPagination = innerData.pagination || {
        page: innerData.page || 1,
        limit: innerData.limit || 20,
        total: innerData.total || 0,
        totalPages: innerData.totalPages || 1
      };
      
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
