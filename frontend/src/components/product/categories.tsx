'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Wifi, Usb, ShieldAlert, Network, Cpu, Search, ArrowRight, Package } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  _count?: {
    products: number;
  };
}

const iconMap: { [key: string]: any } = {
  'wireless-attacks': Wifi,
  'usb-hacking': Usb,
  'red-team': ShieldAlert,
  'network-monitoring': Network,
  'hardware-implants': Cpu,
  'forensics': Search,
  'physical-security': Package,
  'osint-reconnaissance': Search,
  'cryptography': ShieldAlert,
  'malware-analysis': Cpu,
  'social-engineering': Wifi,
  'default': Package,
};

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          console.log('Categories API Response:', data);
          // Handle nested response structure: data.data.categories contains the actual array
          const categoriesData = data.data?.categories || data.categories || data.data?.data || data.data || data;
          console.log('Categories Data Extracted:', categoriesData);
          if (Array.isArray(categoriesData)) {
            setCategories(categoriesData);
            console.log('Categories loaded successfully:', categoriesData.length);
          }
        } else {
          console.error('Failed to fetch categories:', response.status);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const displayed = categories.slice(0, 3);

  if (loading) {
    return (
      <section className="py-32 bg-white text-black">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="animate-pulse">
            <div className="h-8 bg-black/10 rounded w-64 mb-4"></div>
            <div className="h-12 bg-black/10 rounded w-96 mb-16"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/8 border border-black/8 rounded-2xl overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8">
                  <div className="h-6 bg-black/10 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-black/10 rounded w-full mb-2"></div>
                  <div className="h-4 bg-black/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-white text-black transition-all duration-500 ease-in-out">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 fade-in">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.35em] text-black/35 font-medium block">
              Explora
            </span>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] leading-tight">
              Categorías de
              <br />
              <span className="text-black/25">Ciberseguridad</span>
            </h2>
          </div>
          <p className="text-sm text-black/45 max-w-xs leading-relaxed md:text-right">
            Herramientas profesionales para hacking ético y auditoría avanzada.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/8 border border-black/8 rounded-2xl overflow-hidden slide-up">
          {displayed.map((category, index) => {
            const Icon = iconMap[category.slug] || iconMap['default'];
            const productCount = category._count?.products || 0;
            
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="
                  group bg-white p-8
                  flex flex-col gap-6
                  hover:bg-black hover:text-white
                  transition-all duration-500
                  hover:scale-[1.02]
                "
                style={{
                  animationDelay: `${index * 60}ms`
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono text-black/25 group-hover:text-white/25 transition-colors">
                    0{index + 1}
                  </span>
                  <Icon className="h-5 w-5 text-black/30 group-hover:text-white/60 transition-colors" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold tracking-tight leading-snug">
                    {category.name}
                  </h3>
                  <p className="text-sm text-black/50 group-hover:text-white/55 transition-colors leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-black/30 group-hover:text-white/30 transition-colors">
                    {productCount} productos
                  </span>
                  <ArrowRight className="h-4 w-4 text-black/25 group-hover:text-white/60 transition-all duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/categories"
            className="
              group inline-flex items-center gap-2
              border border-black/20
              rounded-full px-8 py-3.5
              text-sm font-medium text-black/70
              hover:border-black/50 hover:text-black hover:bg-black/[0.02]
              transition-all duration-300
            "
          >
            Ver todas las categorías
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}