'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}

const categories = [
  { id: 'smartphones', name: 'Smartphones' },
  { id: 'laptops', name: 'Laptops' },
  { id: 'audio', name: 'Audio' },
  { id: 'wearables', name: 'Wearables' },
  { id: 'cameras', name: 'Cámaras' },
  { id: 'gaming', name: 'Gaming' },
];

export function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 2000],
    rating: 0,
    inStock: false,
  });

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId);
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStockChange = (checked: boolean) => {
    const newFilters = { ...filters, inStock: checked };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      categories: [],
      priceRange: [0, 2000] as [number, number],
      rating: 0,
      inStock: false,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categorías */}
        <div>
          <Label className="text-base font-medium mb-3 block">Categorías</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.id, checked as boolean)
                  }
                />
                <Label htmlFor={category.id} className="text-sm">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Rango de Precios */}
        <div>
          <Label className="text-base font-medium mb-3 block">
            Rango de Precios: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </Label>
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            max={2000}
            min={0}
            step={50}
            className="w-full"
          />
        </div>

        {/* Calificación */}
        <div>
          <Label className="text-base font-medium mb-3 block">Calificación Mínima</Label>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating > rating ? "default" : "outline"}
                size="sm"
                onClick={() => handleRatingChange(rating + 1)}
                className="min-w-[40px]"
              >
                {rating + 1}+
              </Button>
            ))}
          </div>
        </div>

        {/* Stock */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={handleStockChange}
          />
          <Label htmlFor="inStock" className="text-sm">
            Solo productos disponibles
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
