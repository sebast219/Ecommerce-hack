'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Search, Filter, ShoppingCart, Heart, Star, Truck, Shield } from 'lucide-react';
import { Product } from '@/types/cart';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

interface ProductGridMLProps {
  products: Product[];
  loading?: boolean;
}

export const ProductGridML = ({ products, loading }: ProductGridMLProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  
  const { addItem, items } = useCartStore();
  const { user } = useAuthStore();

  // Extract unique categories
  const categories = useMemo(() => {
    const categoryNames = products.map(p => p.category?.name).filter(Boolean) as string[];
    const uniqueCategories = Array.from(new Set(categoryNames));
    return ['all', ...uniqueCategories];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
      const matchesPrice = (typeof product.price === 'number' ? product.price : product.price.amount) >= priceRange.min && 
                          (typeof product.price === 'number' ? product.price : product.price.amount) <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : a.price.amount;
          const priceB = typeof b.price === 'number' ? b.price : b.price.amount;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : a.price.amount;
          const priceB = typeof b.price === 'number' ? b.price : b.price.amount;
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // relevance
        // Keep original order or implement relevance scoring
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: typeof product.price === 'number' ? product.price : product.price.amount,
      images: Array.isArray(product.images) ? product.images : [product.images],
      sku: product.sku,
      category: product.category || { id: '', name: '', slug: '' },
      description: product.description
    }, 1);
  };

  const isInCart = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  const formatPrice = (price: number | { amount: number; currency: string }) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(typeof price === 'number' ? price : price.amount);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Agotado', color: 'text-red-600', bg: 'bg-red-50' };
    if (stock <= 5) return { text: `Últimas ${stock} unidades`, color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'En stock', color: 'text-green-600', bg: 'bg-green-50' };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Todas las categorías' : cat}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="relevance">Más relevantes</option>
            <option value="price-low">Menor precio</option>
            <option value="price-high">Mayor precio</option>
            <option value="name">Alfabético</option>
          </select>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de precio
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-24 px-3 py-1 border border-gray-300 rounded"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Máx"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-24 px-3 py-1 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredProducts.length} productos encontrados
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.inventory?.quantity || 0);
          const inCart = isInCart(product.id);
          
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Product Image */}
              <div className="relative">
                <Image
                  src={Array.isArray(product.images) ? product.images[0] : (product.images as string)}
                  alt={product.name}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                
                {/* Wishlist Button */}
                <button
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                </button>

                {/* Stock Badge */}
                <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                  {stockStatus.text}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Product Name */}
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.5)</span>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </div>

                {/* Benefits */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span>Envío gratis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Garantía</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.inventory?.quantity === 0 || inCart}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    product.inventory?.quantity === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : inCart
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {product.inventory?.quantity === 0 ? 'Agotado' : 
                   inCart ? 'En el carrito' : 'Agregar al carrito'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600">
            Intenta ajustar los filtros o la búsqueda
          </p>
        </div>
      )}
    </div>
  );
};
