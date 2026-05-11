'use client';

import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/cart';
import { useCartStore } from '@/store/cart-store';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addItem } = useCartStore();

  // Helper to get price value
  const getPrice = () => {
    if (typeof product.price === 'number') {
      return product.price;
    }
    return product.price?.amount || 0;
  };

  const priceValue = getPrice();
  const inStock = (product.inventory?.quantity || 0) > 0;

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  return (
    <div
      className={`
        group relative flex flex-col
        border border-black/8 rounded-2xl overflow-hidden
        hover:border-black/20
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        transition-all duration-500
        hover:scale-[1.02]
        ${viewMode === 'list' ? 'flex-row' : ''}
      `}
    >
      {/* Image Container */}
      <div className="aspect-square bg-black/[0.02] overflow-hidden">
        <Image
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          width={300}
          height={300}
          className="
            w-full h-full object-contain p-6
            transition-transform duration-700
            group-hover:scale-105
          "
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-black/6 group-hover:bg-black/10 transition-colors" />

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Name */}
        <h3 className="font-medium text-base leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-black/60 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-black"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-black/50">({Math.floor(Math.random() * 50) + 10})</span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-semibold tracking-tight">
            ${priceValue.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              transition-all duration-300
              ${inStock
                ? 'bg-black text-white hover:bg-black/80 hover:scale-110'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <span
            className={`
              w-2 h-2 rounded-full
              ${inStock ? 'bg-green-500' : 'bg-red-500'}
            `}
          />
          <span className="text-xs text-black/50">
            {inStock ? 'En stock' : 'Agotado'}
          </span>
        </div>
      </div>
    </div>
  );
}
