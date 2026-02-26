'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Filter, SortAsc } from 'lucide-react';

// Mock data - reemplazar con datos reales
const mockProducts = [
  {
    id: '1',
    name: 'USB Rubber Ducky',
    price: 79.99,
    rating: 4.8,
    image: '/favicon.ico',
    category: { id: '1', name: 'Hacking Tools', slug: 'hacking-tools' },
    images: ['/favicon.ico'],
    sku: 'RUBBER-DUCKY-001',
    slug: 'usb-rubber-ducky'
  },
  {
    id: '2',
    name: 'WiFi Pineapple Mark VII',
    price: 119.99,
    rating: 4.7,
    image: '/favicon.ico',
    category: { id: '2', name: 'Network Security', slug: 'network-security' },
    images: ['/favicon.ico'],
    sku: 'WIFI-PINEAPPLE-001',
    slug: 'wifi-pineapple-mark-vii'
  },
  {
    id: '3',
    name: 'Bash Bunny',
    price: 99.99,
    rating: 4.6,
    image: '/favicon.ico',
    category: { id: '1', name: 'Hacking Tools', slug: 'hacking-tools' },
    images: ['/favicon.ico'],
    sku: 'BASH-BUNNY-001',
    slug: 'bash-bunny'
  },
  {
    id: '4',
    name: 'O.MG Cable',
    price: 179.99,
    rating: 4.9,
    image: '/favicon.ico',
    category: { id: '3', name: 'Hardware', slug: 'hardware' },
    images: ['/favicon.ico'],
    sku: 'OMG-CABLE-001',
    slug: 'omg-cable'
  },
  {
    id: '5',
    name: 'LAN Turtle',
    price: 89.99,
    rating: 4.5,
    image: '/favicon.ico',
    category: { id: '2', name: 'Network Security', slug: 'network-security' },
    images: ['/favicon.ico'],
    sku: 'LAN-TURTLE-001',
    slug: 'lan-turtle'
  },
  {
    id: '6',
    name: 'Key Croc',
    price: 149.99,
    rating: 4.7,
    image: '/favicon.ico',
    category: { id: '1', name: 'Hacking Tools', slug: 'hacking-tools' },
    images: ['/favicon.ico'],
    sku: 'KEY-CROC-001',
    slug: 'key-croc'
  }
];

export function ProductGrid() {
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category.name)))];
  
  const filteredProducts = mockProducts.filter(product => 
    filterCategory === 'all' || product.category.name === filterCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Productos</h1>
        <p className="text-gray-600">Explora nuestro catálogo de herramientas profesionales</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="name">Nombre</option>
            <option value="price-low">Precio: Menor a Mayor</option>
            <option value="price-high">Precio: Mayor a Menor</option>
            <option value="rating">Mejor Valorados</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600">Intenta con otros filtros de búsqueda</p>
          <Button
            variant="outline"
            onClick={() => setFilterCategory('all')}
            className="mt-4"
          >
            Mostrar todos los productos
          </Button>
        </div>
      )}
    </div>
  );
}
