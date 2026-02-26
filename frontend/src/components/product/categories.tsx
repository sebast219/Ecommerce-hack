'use client';

import Link from 'next/link';
import { Wifi, Usb, ShieldAlert, Network, Cpu, Search, ArrowRight } from 'lucide-react';

const categories = [
  { id: 'wireless',   name: 'Ataques Inalámbricos', icon: Wifi,        description: 'Auditorías WiFi y MITM',       productCount: 42 },
  { id: 'usb-attacks',name: 'USB Hacking',           icon: Usb,         description: 'Rubber Ducky y BadUSB',        productCount: 28 },
  { id: 'red-team',   name: 'Red Team',              icon: ShieldAlert, description: 'Herramientas ofensivas',       productCount: 35 },
  { id: 'network',    name: 'Network Monitoring',    icon: Network,     description: 'Sniffing y análisis',          productCount: 51 },
  { id: 'hardware',   name: 'Hardware Implants',     icon: Cpu,         description: 'Dispositivos encubiertos',     productCount: 19 },
  { id: 'forensics',  name: 'Forensics',             icon: Search,      description: 'Análisis digital',            productCount: 24 },
];

export function Categories() {
  const displayed = categories.slice(0, 3);

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
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
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
                    {category.productCount} productos
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