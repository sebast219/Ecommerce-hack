'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { ProductFilter } from '@/components/product/product-filter';
import { useProducts } from '@/hooks/use-products';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const { 
    products, 
    isLoading, 
    error, 
    pagination, 
    fetchProducts 
  } = useProducts();

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    fetchProducts({ ...filters, page });
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Productos</h1>
        <p className="text-muted-foreground">
          Descubre nuestra selección de productos de calidad para la comunidad universitaria
        </p>
      </div>

      {/* Filters and View Toggle */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
        
        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/15 text-destructive-foreground p-4 rounded-md mb-6">
          Error: {error}
        </div>
      )}

      {/* Products Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No se encontraron productos con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <span className="text-sm text-muted-foreground">
            Página {pagination.page} de {pagination.pages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
