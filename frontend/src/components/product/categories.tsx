'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Wifi,
  Usb,
  ShieldAlert,
  Network,
  Cpu,
  Search,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Categories
const categories = [
  {
    id: 'wireless',
    name: 'Ataques Inalámbricos',
    icon: Wifi,
    description: 'Auditorías WiFi y MITM',
    productCount: 42
  },
  {
    id: 'usb-attacks',
    name: 'USB Hacking',
    icon: Usb,
    description: 'Rubber Ducky y BadUSB',
    productCount: 28
  },
  {
    id: 'red-team',
    name: 'Red Team',
    icon: ShieldAlert,
    description: 'Herramientas ofensivas',
    productCount: 35
  },
  {
    id: 'network',
    name: 'Network Monitoring',
    icon: Network,
    description: 'Sniffing y análisis',
    productCount: 51
  },
  {
    id: 'hardware',
    name: 'Hardware Implants',
    icon: Cpu,
    description: 'Dispositivos encubiertos',
    productCount: 19
  },
  {
    id: 'forensics',
    name: 'Forensics',
    icon: Search,
    description: 'Análisis digital',
    productCount: 24
  }
];

export function Categories() {
  const displayedCategories = categories.slice(0, 3);

  return (
    <section className="relative py-28 bg-white text-black overflow-hidden">

      <div className="relative container mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">

          <span 
            className="text-sm uppercase tracking-[0.3em] text-black"
          >
            Explora
          </span>

          <h2 
            className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight"
          >
            Categorías de Ciberseguridad
          </h2>

          <p 
            className="mt-6 text-lg text-black/60"
          >
            Herramientas profesionales para hacking ético
            y auditoría avanzada.
          </p>

        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">

          {displayedCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <Card
                key={category.id}
                className="
                  group relative
                  bg-white
                  border border-gray-200
                  rounded-2xl
                  transition-all duration-500
                  hover:border-gray-300
                  hover:-translate-y-2
                  hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)]
                "
              >
                <CardContent className="p-8">


                  <div className="relative flex flex-col h-full">

                    {/* Icon */}
                    <div
                      className="
                        mb-6
                        w-12 h-12
                        flex items-center justify-center
                        rounded-full
                        bg-gray-100
                        transition-all duration-500
                        group-hover:bg-gray-200
                        group-hover:scale-110
                      "
                    >
                      <Icon className="h-6 w-6 text-black/90" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-medium mb-2">
                      {category.name}
                    </h3>

                    <p className="text-sm text-black/60 leading-relaxed mb-6">
                      {category.description}
                    </p>

                    {/* Bottom */}
                    <div className="mt-auto flex items-center justify-between">

                      <span className="text-sm text-black/50">
                        {category.productCount} productos
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="
                          text-black/80
                          hover:text-black
                          hover:bg-transparent
                          transition-all duration-300
                        "
                      >
                        Explorar →
                      </Button>

                    </div>

                  </div>
                </CardContent>
              </Card>
            );
          })}

        </div>

      {/* Ver más categorías button */}
      <div className="flex justify-center mt-8">

        <Button
          onClick={() => window.location.href = '/categories'}
          className="

            relative group

            px-10 py-5
            text-base font-medium

            rounded-full

            bg-black text-white

            overflow-hidden

            transition-all duration-500 ease-out

            hover:scale-[1.03]
            hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)]

            active:scale-[0.98]

            flex items-center gap-3
          "
        >


          {/* Glow Layer */}
          <span
            className="
              absolute inset-0
              bg-gradient-to-r
              from-purple-600/40
              via-blue-600/40
              to-cyan-500/40

              opacity-0
              group-hover:opacity-100

              blur-xl
              transition-opacity duration-500
            "
          />


          {/* Shine Effect */}
          <span
            className="
              absolute -left-full top-0
              w-1/2 h-full

              bg-gradient-to-r
              from-transparent
              via-white/30
              to-transparent

              skew-x-12

              group-hover:left-full
              transition-all duration-700
            "
          />


          {/* Content */}
          <span className="relative z-10 flex items-center gap-3">

            <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />

            <span className="tracking-wide">
              Ver más categorías
            </span>

            <ArrowRight
              className="
                h-5 w-5
                transition-transform duration-300
                group-hover:translate-x-1.5
              "
            />
          </span>
        </Button>
      </div>
      </div>
    </section>
  );
}
