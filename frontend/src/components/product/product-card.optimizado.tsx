// Product Card Optimizado con Memoización y Lazy Loading
'use client';

import { memo, useMemo, useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { LazyImage } from '../ui/lazy-image';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    imageUrl?: string | null;
    images?: string[];
    category?: { name: string; slug: string } | null;
    inventory?: { quantity: number; lowStock: number } | null;
    rating?: number;
    reviewCount?: number;
    tags?: string[];
  };
  className?: string;
  priority?: boolean; // Para productos destacados
}

// Memoizar el componente para evitar re-renders innecesarios
const ProductCard = memo<ProductCardProps>(({ 
  product, 
  className = '', 
  priority = false 
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const { addItem, items } = useCartStore();
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoizar cálculos pesados
  const priceDisplay = useMemo(() => {
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
    
    return {
      current: formatter.format(product.price),
      original: product.comparePrice 
        ? formatter.format(product.comparePrice) 
        : null,
      hasDiscount: product.comparePrice && product.comparePrice > product.price,
      discountPercentage: product.comparePrice && product.comparePrice > product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0,
    };
  }, [product.price, product.comparePrice]);

  // Memoizar estado del stock
  const stockStatus = useMemo(() => {
    if (!product.inventory) return { status: 'unknown', message: 'Stock no disponible' };
    
    const { quantity, lowStock } = product.inventory;
    
    if (quantity === 0) {
      return { status: 'out', message: 'Agotado', color: 'text-red-600' };
    } else if (quantity <= lowStock) {
      return { 
        status: 'low', 
        message: `¡Últimas ${quantity} unidades!`, 
        color: 'text-orange-600' 
      };
    } else {
      return { status: 'available', message: 'En stock', color: 'text-green-600' };
    }
  }, [product.inventory]);

  // Memoizar si el producto ya está en el carrito
  const isInCart = useMemo(() => {
    return items.some(item => item.productId === product.id);
  }, [items, product.id]);

  // Memoizar imagen principal
  const mainImage = useMemo(() => {
    return product.imageUrl || product.images?.[0] || '/images/placeholder-product.jpg';
  }, [product.imageUrl, product.images]);

  // Optimizar callbacks con useCallback
  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Redirigir a login o mostrar modal
      return;
    }

    if (stockStatus.status === 'out') return;

    setIsLoading(true);
    try {
      await addItem({
        productId: product.id,
        quantity: 1,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [product.id, stockStatus.status, isAuthenticated, addItem]);

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(prev => !prev);
  }, []);

  const renderStars = useMemo(() => {
    if (!product.rating) return null;

    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating!)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {product.rating.toFixed(1)}
          {product.reviewCount && ` (${product.reviewCount})`}
        </span>
      </div>
    );
  }, [product.rating, product.reviewCount]);

  const renderTags = useMemo(() => {
    if (!product.tags || product.tags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {product.tags.slice(0, 2).map(tag => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
          >
            {tag}
          </span>
        ))}
        {product.tags.length > 2 && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
            +{product.tags.length - 2}
          </span>
        )}
      </div>
    );
  }, [product.tags]);

  return (
    <div className={`group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}>
      {/* Badge de descuento */}
      {priceDisplay.hasDiscount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          -{priceDisplay.discountPercentage}%
        </div>
      )}

      {/* Badge de stock bajo */}
      {stockStatus.status === 'low' && (
        <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          Últimas unidades
        </div>
      )}

      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/products/${product.slug}`}>
          <LazyImage
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            fallback="/images/placeholder-product.jpg"
          />
        </Link>

        {/* Botón de wishlist */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
          aria-label="Añadir a favoritos"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        {/* Categoría */}
        {product.category && (
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {product.category.name}
          </Link>
        )}

        {/* Nombre del producto */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {renderStars}

        {/* Tags */}
        {renderTags}

        {/* Precio */}
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {priceDisplay.current}
            </span>
            {priceDisplay.original && (
              <span className="text-sm text-gray-500 line-through">
                {priceDisplay.original}
              </span>
            )}
          </div>
        </div>

        {/* Estado del stock */}
        <div className={`mt-2 text-sm ${stockStatus.color}`}>
          {stockStatus.message}
        </div>

        {/* Botón de añadir al carrito */}
        <Button
          onClick={handleAddToCart}
          disabled={stockStatus.status === 'out' || isLoading || isInCart}
          className="w-full mt-3"
          variant={isInCart ? "secondary" : "default"}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Añadiendo...
            </span>
          ) : isInCart ? (
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              En el carrito
            </span>
          ) : stockStatus.status === 'out' ? (
            'Agotado'
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Añadir al carrito
            </span>
          )}
        </Button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
