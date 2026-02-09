'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad2 } from 'lucide-react';

const categories = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    icon: Smartphone,
    description: 'Últimos modelos y accesorios',
    productCount: 156
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: Laptop,
    description: 'Potencia y portabilidad',
    productCount: 89
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: Headphones,
    description: 'Auriculares y parlantes',
    productCount: 234
  },
  {
    id: 'wearables',
    name: 'Wearables',
    icon: Watch,
    description: 'Smartwatches y fitness',
    productCount: 67
  },
  {
    id: 'cameras',
    name: 'Cámaras',
    icon: Camera,
    description: 'Fotografía profesional',
    productCount: 45
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: Gamepad2,
    description: 'Consolas y accesorios',
    productCount: 178
  }
];

export function Categories() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Explora por Categorías</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encuentra exactamente lo que buscas en nuestras categorías organizadas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="group hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {category.productCount} productos
                        </span>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          Ver más →
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
