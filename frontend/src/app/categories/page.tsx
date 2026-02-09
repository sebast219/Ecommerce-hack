'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Wifi,
  Usb,
  ShieldAlert,
  Network,
  Cpu,
  Search,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const categories = [
  {
    id: 'wireless',
    name: 'Ataques Inalámbricos',
    description: 'Auditorías WiFi, MITM y pentesting inalámbrico',
    icon: Wifi,
    image: 'https://lab401.com/cdn/shop/products/Wifi-Pineapple-M7-Tactical_520x520.png?v=1617383382',
  },
  {
    id: 'usb',
    name: 'USB Hacking',
    description: 'Payloads, BadUSB y ataques físicos',
    icon: Usb,
    image: 'https://lab401.com/cdn/shop/files/Bash-Bunny-Mark-II_873x700.png?v=1711536452',
  },
  {
    id: 'redteam',
    name: 'Red Team',
    description: 'Operaciones ofensivas avanzadas',
    icon: ShieldAlert,
    image: 'https://lab401.com/cdn/shop/files/WHIDBoard--Complete-Kit-Square_700x700.png?v=1765465610',
  },
  {
    id: 'network',
    name: 'Network',
    description: 'Sniffing, análisis y monitoreo',
    icon: Network,
    image: 'https://lab401.com/cdn/shop/files/AWOK-Dual-V3-Front---v2_700x700.png?v=1759511405',
  },
  {
    id: 'hardware',
    name: 'Hardware',
    description: 'Implantes y dispositivos encubiertos',
    icon: Cpu,
    image: 'https://lab401.com/cdn/shop/files/MacoBox---Standalone_700x700.png?v=1746622691',
  },
];

export default function CategoriesPage() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFirstCategory = () => {
    const firstSection = sectionRefs.current[0];
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="bg-white text-black">

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center text-center px-6 relative overflow-hidden">

        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />

        <div className="max-w-4xl space-y-8 relative z-10">

          <span 
            className="uppercase tracking-[0.4em] text-sm text-black/60 inline-block"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              opacity: 1 - scrollY * 0.001,
            }}
          >
            Hack 6 Platform
          </span>

          <h1 
            className="text-6xl md:text-8xl font-semibold tracking-tight leading-[0.95]"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: 1 - scrollY * 0.0008,
            }}
          >
            Categorías
            <br />
            Profesionales
          </h1>

          <p 
            className="text-xl text-black/60 max-w-2xl mx-auto"
            style={{
              transform: `translateY(${scrollY * 0.15}px)`,
              opacity: 1 - scrollY * 0.0006,
            }}
          >
            Herramientas utilizadas por equipos
            de ciberseguridad en todo el mundo.
          </p>

          <Button
            size="lg"
            className="
              rounded-full
              bg-black text-white
              px-10
              hover:scale-105
              transition
            "
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              opacity: 1 - scrollY * 0.0004,
            }}
            onClick={scrollToFirstCategory}
          >
            Explorar ahora
          </Button>

        </div>

      </section>

      {/* Sections */}
      {categories.map((cat, index) => {
        const Icon = cat.icon;
        const isEven = index % 2 === 0;

        return (
          <section
            key={cat.id}
            ref={el => { sectionRefs.current[index] = el; }}
            className="min-h-screen flex items-center relative overflow-hidden"
          >

            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5"
              style={{
                transform: `translateY(${(scrollY - (index + 1) * window.innerHeight) * 0.3}px)`,
              }}
            />

            <div
              className={`
                container mx-auto px-6 lg:px-12
                grid lg:grid-cols-2 gap-16 items-center
                ${isEven ? '' : 'lg:flex-row-reverse'}
                relative z-10
              `}
            >

              {/* Image */}
              <div className={`relative h-[400px] lg:h-[600px] overflow-hidden rounded-3xl ${isEven ? 'lg:order-first' : 'lg:order-last'}`}>

                <img
                  src={cat.image}
                  alt={cat.name}
                  className="
                    w-full h-full
                    object-cover
                    rounded-3xl
                    shadow-[0_40px_120px_rgba(0,0,0,0.15)]
                  "
                />

              </div>

              {/* Content */}
              <div 
                className={`space-y-8 max-w-xl ${isEven ? 'lg:order-last' : 'lg:order-first'}`}
                style={{
                  transform: `translateY(${(scrollY - (index + 1) * window.innerHeight) * 0.2}px)`,
                  opacity: Math.max(0, Math.min(1, 1 - Math.abs(scrollY - (index + 1) * window.innerHeight) * 0.0005)),
                }}
              >

                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <Icon className="h-7 w-7" />
                </div>

                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                  {cat.name}
                </h2>

                <p className="text-lg text-black/60 leading-relaxed">
                  {cat.description}
                </p>

                <Link href={`/categories/${cat.id}`}>

                  <Button
                    size="lg"
                    variant="outline"
                    className="
                      rounded-full
                      border-black/30
                      hover:bg-black/5
                    "
                  >
                    Ver herramientas →
                  </Button>

                </Link>

              </div>

            </div>

          </section>
        );
      })}

    </main>
  );
}
