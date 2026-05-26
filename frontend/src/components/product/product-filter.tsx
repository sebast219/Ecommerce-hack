'use client';

import { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';

import {
  X,
  SlidersHorizontal,
  Star,
  PackageCheck,
  Loader2,
} from 'lucide-react';

// Category interface (moved from use-categories hook)
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

// Direct categories implementation (moved from use-categories hook)
function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<any>('/categories');
      
      // Handle double-nested response structure: { data: { success: true, data: { categories: [...] } } }
      const innerData = response.data || response;
      
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


/* ========================
   TYPES
======================== */

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}


/* ========================
   DATA - REMOVED: Now using API categories
======================== */

// Categories now come from useCategories hook


/* ========================
   COMPONENT
======================== */

export function ProductFilter({ onFilterChange }: ProductFilterProps) {

  const { categories, isLoading: categoriesLoading } = useCategories();

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 2000],
    rating: 0,
    inStock: false,
  });


  /* ========================
     HANDLERS
  ======================== */

  function updateFilters(newFilters: FilterState) {
    setFilters(newFilters);
    onFilterChange(newFilters);
  }


  function handleCategory(id: string, checked: boolean) {

    const categories = checked
      ? [...filters.categories, id]
      : filters.categories.filter(c => c !== id);

    updateFilters({
      ...filters,
      categories,
    });
  }


  function handlePrice(value: number[]) {

    updateFilters({
      ...filters,
      priceRange: [0, value[0]],
    });
  }


  function handleRating(value: number) {

    updateFilters({
      ...filters,
      rating: value,
    });
  }


  function handleStock(checked: boolean) {

    updateFilters({
      ...filters,
      inStock: checked,
    });
  }


  function clearFilters() {

    updateFilters({
      categories: [],
      priceRange: [0, 2000],
      rating: 0,
      inStock: false,
    });
  }



  /* ========================
     ACTIVE FILTERS
  ======================== */

  const activeCategories = categories.filter((c: { id: string }) =>
    filters.categories.includes(c.id)
  );



  return (
    <Card
      className="
        sticky top-24

        border-slate-200/60
        bg-white/80
        backdrop-blur-xl

        shadow-xl
        rounded-2xl
      "
    >

      {/* ================= HEADER ================= */}

      <CardHeader className="pb-3">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <SlidersHorizontal className="h-5 w-5 text-slate-600" />

            <CardTitle className="text-lg">
              Filtros
            </CardTitle>

          </div>


          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="
              text-slate-500
              hover:text-red-500
              hover:bg-red-50
            "
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>

        </div>

      </CardHeader>



      <CardContent className="space-y-7">


        {/* ================= ACTIVE CHIPS ================= */}

        {(filters.categories.length > 0 ||
          filters.rating > 0 ||
          filters.inStock) && (

          <div className="flex flex-wrap gap-2">

            {activeCategories.map((cat: { id: string; name: string }) => (

              <FilterChip
                key={cat.id}
                label={cat.name}
                onRemove={() => handleCategory(cat.id, false)}
              />

            ))}


            {filters.rating > 0 && (

              <FilterChip
                label={`${filters.rating}+ ⭐`}
                onRemove={() => handleRating(0)}
              />

            )}


            {filters.inStock && (

              <FilterChip
                label="En stock"
                onRemove={() => handleStock(false)}
              />

            )}

          </div>

        )}



        {/* ================= CATEGORIES ================= */}

        <div>

          <Label className="text-base font-semibold mb-3 block">
            Categorías
          </Label>

          <div className="grid grid-cols-3 gap-2">

            {categoriesLoading ? (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Cargando categorías...</span>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-slate-500">No hay categorías disponibles</p>
            ) : (
              categories.map((cat: { id: string; name: string }) => (
                <div
                  key={cat.id}
                  className="
                    flex items-center gap-3
                    p-2 rounded-lg
                    hover:bg-slate-50
                    transition
                  "
                >
                  <Checkbox
                    id={cat.id}
                    checked={filters.categories.includes(cat.id)}
                    onCheckedChange={(v) =>
                      handleCategory(cat.id, v as boolean)
                    }
                  />
                  <Label
                    htmlFor={cat.id}
                    className="cursor-pointer text-sm"
                  >
                    {cat.name}
                  </Label>
                </div>
              ))
            )}

          </div>

        </div>



        {/* ================= PRICE ================= */}

        <div>

          <Label className="text-base font-semibold mb-2 block">

            Precio

            <span className="ml-2 text-sm text-slate-500 font-normal">
              Hasta ${filters.priceRange[1]}
            </span>

          </Label>


          <Slider
            value={[filters.priceRange[1]]}
            onValueChange={handlePrice}
            min={0}
            max={2000}
            step={50}
            className="mt-3"
          />

        </div>



        {/* ================= RATING ================= */}

        <div>

          <Label className="text-base font-semibold mb-3 block">
            Calificación
          </Label>


          <div className="flex gap-2">

            {[1, 2, 3, 4, 5].map(star => (

              <Button
                key={star}
                variant={
                  filters.rating >= star
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                onClick={() => handleRating(star)}
                className="w-10"
              >

                <Star className="h-4 w-4" />

              </Button>

            ))}

          </div>

        </div>



        {/* ================= STOCK ================= */}

        <div
          className="
            flex items-center gap-3

            p-3 rounded-xl

            border border-slate-200/60
            bg-slate-50/50
          "
        >

          <PackageCheck className="h-4 w-4 text-green-600" />

          <Checkbox
            id="stock"
            checked={filters.inStock}
            onCheckedChange={(v) =>
              handleStock(v as boolean)
            }
          />

          <Label
            htmlFor="stock"
            className="text-sm cursor-pointer"
          >
            Solo disponibles
          </Label>

        </div>


      </CardContent>

    </Card>
  );
}



/* ========================
   CHIP COMPONENT
======================== */

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {

  return (

    <div
      className="
        flex items-center gap-2

        px-3 py-1.5
        rounded-full

        bg-slate-100
        text-sm

        border border-slate-200

        animate-in fade-in zoom-in-95
      "
    >

      {label}

      <button
        onClick={onRemove}
        className="hover:text-red-500"
      >
        <X className="h-3 w-3" />
      </button>

    </div>

  );
}
