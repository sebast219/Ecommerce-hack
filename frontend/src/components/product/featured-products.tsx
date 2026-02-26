'use client';

import Link from 'next/link';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';

const featuredProducts = [
  { id: '1', name: 'USB Rubber Ducky',       price: 79.99,  rating: 4.8, image: 'https://lab401.com/cdn/shop/files/2023---hak5-rubber-ducky-1_700x700.png?v=1689852107' },
  { id: '2', name: 'WiFi Pineapple Mark VII', price: 119.99, rating: 4.7, image: 'https://lab401.com/cdn/shop/files/wifi-pineapple-pager-black-alpha_700x700.png?v=1765278306' },
  { id: '3', name: 'Bash Bunny Mark II',      price: 99.99,  rating: 4.6, image: 'https://lab401.com/cdn/shop/files/Bash-Bunny-Mark-II_873x700.png?v=1711536452' },
  { id: '4', name: 'Flipper Zero',            price: 179.99, rating: 4.9, image: 'https://lab401.com/cdn/shop/files/Flipper-Zero_799x700.png?v=1682525077' },
];

export function FeaturedProducts() {
  return (
    <section className="py-32 bg-white text-black transition-all duration-500 ease-in-out">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 fade-in">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.35em] text-black/35 font-medium block">
              Destacados
            </span>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] leading-tight">
              Herramientas
              <br />
              <span className="text-black/25">Profesionales</span>
            </h2>
          </div>
          <p className="text-sm text-black/45 max-w-xs leading-relaxed md:text-right">
            Tecnología utilizada por expertos en ciberseguridad en todo el mundo.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 slide-up">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="
                group relative flex flex-col
                border border-black/8 rounded-2xl overflow-hidden
                hover:border-black/20
                hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                transition-all duration-500
                hover:scale-[1.02]
              "
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Image */}
              <div className="aspect-square bg-black/[0.02] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    w-full h-full object-contain p-6
                    transition-transform duration-700
                    group-hover:scale-105
                  "
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-black/6 group-hover:bg-black/10 transition-colors" />

              {/* Info */}
              <div className="p-5 flex flex-col gap-4 flex-1">
                <h3 className="font-medium text-base leading-snug line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.round(product.rating)
                            ? 'fill-black text-black'
                            : 'text-black/15'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-black/35 tabular-nums">{product.rating}</span>
                </div>

                {/* Price + CTA */}
                <div className="mt-auto flex items-center justify-between pt-1">
                  <div>
                    <span className="text-lg font-semibold tabular-nums">
                      ${product.price}
                    </span>
                    <span className="ml-2 text-xs text-black/30 line-through tabular-nums">
                      ${(product.price * 1.25).toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="
                      group/btn w-8 h-8 rounded-full
                      border border-black/15
                      flex items-center justify-center
                      hover:bg-black hover:border-black
                      transition-all duration-300
                    "
                  >
                    <ShoppingCart className="h-3.5 w-3.5 group-hover/btn:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/products"
            className="
              group inline-flex items-center gap-2
              border border-black/20
              rounded-full px-8 py-3.5
              text-sm font-medium text-black/70
              hover:border-black/50 hover:text-black hover:bg-black/[0.02]
              transition-all duration-300
            "
          >
            Ver todo el catálogo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}