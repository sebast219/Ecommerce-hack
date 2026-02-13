'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart } from 'lucide-react';

// Productos destacados
const featuredProducts = [
  {
    id: '1',
    name: 'USB Rubber Ducky',
    price: 79.99,
    rating: 4.8,
    image: '/rubber-ducky.jpg'
  },
  {
    id: '2',
    name: 'WiFi Pineapple Mark VII',
    price: 119.99,
    rating: 4.7,
    image: '/wifi-pineapple.jpg'
  },
  {
    id: '3',
    name: 'Bash Bunny',
    price: 99.99,
    rating: 4.6,
    image: '/bash-bunny.jpg'
  },
  {
    id: '4',
    name: 'O.MG Cable',
    price: 179.99,
    rating: 4.9,
    image: '/omg-cable.jpg'
  }
];

export function FeaturedProducts() {
  return (
    <section className="relative py-28 bg-white text-black overflow-hidden">

      {/* Ambient Light */}
      <div className="absolute inset-0 bg-white" />

      <div className="relative container mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">

          <span className="text-sm uppercase tracking-[0.3em] text-black">
            Destacados
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Herramientas Profesionales
          </h2>

          <p className="mt-6 text-lg text-black/60">
            Tecnología utilizada por expertos en ciberseguridad
            en todo el mundo.
          </p>

        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {featuredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="
                group relative
                bg-white
                border border-gray-200
                rounded-2xl
                overflow-hidden
                transition-all duration-500
                hover:border-gray-300
                hover:-translate-y-3
                hover:shadow-[0_40px_100px_rgba(0,0,0,0.15)]
              "
            >
              <CardContent className="p-0">

                {/* Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="
                      w-full h-full object-contain p-6
                      transition-transform duration-700
                      group-hover:scale-110
                    "
                  />
                </div>

                {/* Info */}
                <div className="p-6 space-y-4">

                  <h3 className="font-medium text-lg leading-snug line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">

                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`
                            h-4 w-4
                            ${
                              i < Math.round(product.rating)
                                ? 'fill-black text-black'
                                : 'text-black/30'
                            }
                          `}
                        />
                      ))}
                    </div>

                    <span className="text-sm text-black/50">
                      {product.rating}
                    </span>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-2">

                    <div>
                      <span className="text-xl font-semibold">
                        ${product.price}
                      </span>

                      <span className="ml-2 text-sm text-black/40 line-through">
                        ${(product.price * 1.25).toFixed(2)}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className="
                        rounded-full
                        bg-black text-white
                        px-4
                        transition-all duration-300
                        hover:scale-105
                        hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)]
                      "
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Comprar
                    </Button>

                  </div>

                </div>

              </CardContent>
            </Card>
          ))}

        </div>

        {/* Footer CTA */}
        <div className="text-center mt-20">

          <Link href="/products">
            <Button
              variant="outline"
              size="lg"
              className="
                rounded-full
                border-black/30
                text-black
                hover:bg-black/10
                transition-all duration-300
              "
            >
              Ver todo el catálogo
            </Button>
          </Link>

        </div>

      </div>
    </section>
  );
}
