'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Shield, Wifi, Cpu, HardDrive, Network, Lock } from 'lucide-react';

// Mock data - reemplazar con datos reales
const mockCategories = [
  {
    id: '1',
    name: 'Hacking Tools',
    slug: 'hacking-tools',
    description: 'Herramientas profesionales para auditorías de seguridad y pruebas de penetración',
    icon: Shield,
    productCount: 12,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Network Security',
    slug: 'network-security',
    description: 'Equipamiento para análisis de redes y monitoreo de tráfico',
    icon: Wifi,
    productCount: 8,
    color: 'bg-green-500'
  },
  {
    id: '3',
    name: 'Hardware',
    slug: 'hardware',
    description: 'Dispositivos físicos para testing de seguridad',
    icon: HardDrive,
    productCount: 15,
    color: 'bg-purple-500'
  },
  {
    id: '4',
    name: 'Software Tools',
    slug: 'software-tools',
    description: 'Aplicaciones y utilidades para ciberseguridad',
    icon: Cpu,
    productCount: 23,
    color: 'bg-orange-500'
  },
  {
    id: '5',
    name: 'Communication',
    slug: 'communication',
    description: 'Herramientas de comunicación segura y cifrada',
    icon: Network,
    productCount: 6,
    color: 'bg-red-500'
  },
  {
    id: '6',
    name: 'Authentication',
    slug: 'authentication',
    description: 'Sistemas de autenticación y gestión de identidades',
    icon: Lock,
    productCount: 9,
    color: 'bg-indigo-500'
  }
];

export function CategoryGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Categorías</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explora nuestra amplia gama de herramientas y equipos especializados 
          en ciberseguridad y testing ético
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockCategories.map((category) => {
          const Icon = category.icon;
          
          return (
            <Card 
              key={category.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-6">
                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center mb-6
                  ${category.color} text-white
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <Icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {category.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.productCount} productos
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                  >
                    Explorar
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Category Detail */}
      {selectedCategory && (
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Categoría seleccionada: {mockCategories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <Button
              variant="ghost"
              onClick={() => setSelectedCategory(null)}
            >
              Limpiar selección
            </Button>
          </div>
          <p className="text-gray-600">
            Esta característica te permitirá filtrar productos por categoría. 
            Próximamente podrás ver todos los productos de esta categoría.
          </p>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-gray-600 mb-6">
            Contáctanos y te ayudaremos a encontrar la herramienta perfecta para tus necesidades
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Contactar Soporte
          </Button>
        </div>
      </div>
    </div>
  );
}
