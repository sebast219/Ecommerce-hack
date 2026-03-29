import { useState, useEffect, useCallback } from 'react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Handle double-nested response structure: { data: { success: true, data: { categories: [...] } } }
      const innerData = result.data || result;
      
      // Extract categories from inner data.data or innerData directly
      const categoriesArray = innerData.data?.categories || innerData.categories || [];

      setCategories(categoriesArray);
    } catch (err: any) {
      setError(err.message || 'Error al cargar categorías');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
  };
}
