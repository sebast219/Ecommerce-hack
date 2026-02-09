'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart } from 'lucide-react';

// Datos de ejemplo
const featuredProducts = [
  {
    id: '1',
    name: 'Laptop Gaming Pro',
    price: 1299.99,
    rating: 4.5,
    image: '/laptop.jpg'
  },
  {
    id: '2', 
    name: 'Smartphone Ultra',
    price: 899.99,
    rating: 4.8,
    image: '/phone.jpg'
  },
  {
    id: '3',
    name: 'Auriculares Premium',
    price: 199.99,
    rating: 4.3,
    image: '/headphones.jpg'
  },
  {
    id: '4',
    name: 'Tablet Pro Max',
    price: 649.99,
    rating: 4.6,
    image: '/tablet.jpg'
  }
];

export function FeaturedProducts() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra selección de los productos más populares y mejor valorados por nuestros clientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl text-muted-foreground">📦</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    OFERTA
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.rating})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold">${product.price}</span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ${(product.price * 1.3).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <Button className="w-full group-hover:bg-primary/90">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Añadir al Carrito
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Ver Todos los Productos
          </Button>
        </div>
      </div>
    </section>
  );
}
