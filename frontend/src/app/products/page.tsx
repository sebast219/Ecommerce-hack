'use client';

import { useState, useEffect } from 'react';
import { Grid, List, SlidersHorizontal } from 'lucide-react';

import { ProductCard } from '@/components/product/product-card';
import { ProductFilter } from '@/components/product/product-filter';
import { useProducts } from '@/hooks/use-products';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'name',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const [filterState, setFilterState] = useState({
    categories: [] as string[],
    priceRange: [0, 2000] as [number, number],
    rating: 0,
    inStock: false,
  });

  const { products, isLoading, error, pagination, fetchProducts } = useProducts();

  // Animación de entrada optimizada
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Refetch cuando cambian los filtros
  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  // Convierte estado de filtros a API
  const handleFilterChange = (newFilters: typeof filterState) => {
    setFilterState(newFilters);

    setFilters({
      ...filters,
      category: newFilters.categories.join(','),
      minPrice: newFilters.priceRange[0],
      maxPrice: newFilters.priceRange[1],
    });
  };

  return (
    <section className={`min-h-screen bg-background transition-all duration-700 ease-out ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>

      {/* HERO */}
      <div className="relative overflow-hidden py-24 text-center max-w-7xl mx-auto px-6 lg:px-12 fade-in">
        <p className="uppercase tracking-widest text-sm text-muted-foreground mb-4">
          Premium Store
        </p>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-center">
          Tecnología diseñada <br /> para tu rendimiento
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Productos seleccionados para estudiantes, desarrolladores
          y profesionales exigentes.
        </p>
      </div>

      {/* CONTROLES */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">

        <div className="flex flex-wrap items-center gap-4 mb-8">

          {/* Toggle Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-muted transition"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>

          {/* Vista Grid/List */}
          <div className="ml-auto flex items-center gap-2 bg-muted rounded-full p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full transition ${viewMode === 'grid' ? 'bg-background shadow' : 'opacity-60 hover:opacity-100'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition ${viewMode === 'list' ? 'bg-background shadow' : 'opacity-60 hover:opacity-100'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* PANEL DE FILTROS */}
        {showFilters && (
          <div className="mb-10 p-6 rounded-2xl border bg-muted/30 backdrop-blur slide-up">
            <ProductFilter onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive">
            {error}
          </div>
        )}

        {/* PRODUCTS */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[320px] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center fade-in">
            <h3 className="text-xl font-semibold mb-2 text-center">
              Sin resultados
            </h3>
            <p className="text-muted-foreground text-center">
              Ajusta los filtros para encontrar lo que buscas.
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 slide-up' : 'space-y-6 slide-up'}>
            {products.map((product, index) => (
              <div
                key={product.id}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <ProductCard product={product} viewMode={viewMode} />
              </div>
            ))}
          </div>
        )}

        {/* PAGINACIÓN */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center mt-16 gap-4">
            <button
              disabled={pagination.page === 1}
              onClick={() => fetchProducts({ ...filters, page: pagination.page - 1 })}
              className="px-6 py-2 border rounded-full disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="flex items-center text-sm text-muted-foreground">
              {pagination.page} / {pagination.pages}
            </span>
            <button
              disabled={pagination.page === pagination.pages}
              onClick={() => fetchProducts({ ...filters, page: pagination.page + 1 })}
              className="px-6 py-2 border rounded-full disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
