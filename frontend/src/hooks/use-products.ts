// USE PRODUCTS HOOK - EJERCICIO PRÁCTICO
// OBJETIVO: Aprender a crear custom hooks con estado asíncrono

import { useState, useEffect } from 'react';
import { Product } from '@/types/cart';

// TODO: Define la interfaz de retorno de tu hook
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

// TODO: Define la interfaz de filtros
interface Filters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
}

export function useProducts() {
  // TODO: Define los estados locales
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseProductsReturn['pagination'] | null>(null);

  // TODO: Implementa fetchProducts paso a paso
  const fetchProducts = async (filters: Filters = {}) => {
    // PASO 1: Iniciar loading y limpiar errores
    // - setIsLoading(true)
    // - setError(null)
    
    // PASO 2: Construir query params
    // - Usa URLSearchParams para construir la query string
    // - Ejemplo: const params = new URLSearchParams()
    // - Agrega cada filtro si existe: if (filters.search) params.append('search', filters.search)
    
    // PASO 3: Hacer la llamada a la API
    // - Usa try/catch para manejar errores
    // - Ejemplo: const response = await fetch(`/api/products?${params.toString()}`)
    // - Verifica si response.ok, si no lanza error
    
    // PASO 4: Procesar la respuesta
    // - Convierte a JSON: const data = await response.json()
    // - Actualiza estados: setProducts(data.products), setPagination(data.pagination)
    
    // PASO 5: Manejar errores
    // - En catch: setError(err.message || 'Error al cargar productos')
    
    // PASO 6: Finalizar loading
    // - En finally: setIsLoading(false)
    
    console.log('Implementar fetchProducts con filtros:', filters);
    
    // Código temporal para que funcione
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulación de API call - REEMPLAZAR CON API REAL
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts([]);
      setPagination({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
      });
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Agrega efecto para cargar productos iniciales
  // - Usa useEffect para llamar a fetchProducts() cuando el componente se monte
  // - Ejemplo: useEffect(() => fetchProducts(), [])

  return {
    products,
    isLoading,
    error,
    pagination,
    fetchProducts,
  };
}
