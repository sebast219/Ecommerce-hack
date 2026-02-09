'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad2, Search, Filter } from 'lucide-react';

const categories = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    icon: Smartphone,
    description: 'Últimos modelos y accesorios móviles',
    productCount: 156,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: Laptop,
    description: 'Potencia y portabilidad para trabajo y estudio',
    productCount: 89,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: Headphones,
    description: 'Auriculares, parlantes y equipos de sonido',
    productCount: 234,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'wearables',
    name: 'Wearables',
    icon: Watch,
    description: 'Smartwatches y dispositivos fitness',
    productCount: 67,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'cameras',
    name: 'Cámaras',
    icon: Camera,
    description: 'Fotografía y videografía profesional',
    productCount: 45,
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: Gamepad2,
    description: 'Consolas, accesorios y periféricos gaming',
    productCount: 178,
    color: 'from-red-500 to-red-600'
  }
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Categorías</h1>
        <p className="text-muted-foreground">
          Explora nuestras categorías y encuentra los productos perfectos para ti
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-0">
                {/* Header con gradiente */}
                <div className={`h-32 bg-gradient-to-r ${category.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-xs font-semibold text-gray-800">
                      {category.productCount} productos
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    Ver Productos
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No se encontraron categorías</h3>
          <p className="text-gray-600">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {categories.reduce((sum, cat) => sum + cat.productCount, 0)}+
            </div>
            <div className="text-gray-600">Productos Totales</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {categories.length}
            </div>
            <div className="text-gray-600">Categorías</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Soporte</div>
          </div>
        </div>
      </div>
    </div>
  );
}
