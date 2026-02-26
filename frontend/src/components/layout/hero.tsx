'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const images = [
    {
      url: 'https://lab401.com/cdn/shop/files/wifi-pineapple-pager-black-alpha_700x700.png?v=1765278306',
      alt: 'Escudo de ciberseguridad',
    },
    {
      url: 'https://lab401.com/cdn/shop/files/Flipper-Zero_799x700.png?v=1682525077',
      alt: 'Candado de seguridad',
    },
    {
      url: 'https://lab401.com/cdn/shop/files/2023---hak5-rubber-ducky-1_700x700.png?v=1689852107',
      alt: 'Protección de datos',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen bg-white text-black overflow-hidden">

      {/* Ambient glow — mismo estilo nosotros */}
      <div
        className="pointer-events-none absolute right-[-150px] top-[-150px] w-[600px] h-[600px] rounded-full bg-gray-100 blur-[140px] opacity-70"
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
      />

      <div className="relative container mx-auto px-6 lg:px-12 min-h-screen flex flex-col justify-between">

        {/* Top label row — toque editorial nosotros */}
        <div
          className="pt-32 flex items-center justify-between"
          style={{ opacity: 1 - scrollY * 0.004 }}
        >
          <span className="uppercase tracking-[0.6em] text-xs text-black-900/70 font-bold font-mono">
            • Seguridad • Tecnología • Futuro •
          </span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-1 py-16">

          {/* Left Content */}
          <div
            className="space-y-10 max-w-xl"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              opacity: 1 - scrollY * 0.0008,
            }}
          >
            {/* Title — ghost text igual que nosotros */}
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-semibold tracking-[-0.03em] leading-[0.92]">
              Hack 6
            </h1>

            <p className="text-lg text-black/50 leading-relaxed max-w-sm">
              Seguridad digital diseñada para estudiantes que piensan en grande.
              Tecnología confiable, elegante y lista para el futuro.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/products"
                className="
                  group inline-flex items-center justify-center gap-2
                  bg-black text-white
                  rounded-full px-8 py-4
                  text-sm font-medium
                  transition-all duration-300
                  hover:scale-[1.03]
                  hover:shadow-[0_10px_40px_rgba(0,0,0,0.18)]
                "
              >
                Explorar productos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/categories"
                className="
                  inline-flex items-center justify-center
                  border border-black/25
                  rounded-full px-8 py-4
                  text-sm font-medium text-black/80
                  transition-all duration-300
                  hover:bg-black/5
                  hover:border-black/50
                "
              >
                Ver categorías
              </Link>
            </div>
          </div>

          {/* Right Visual — sin cambios funcionales */}
          <div
            className="relative h-[420px] lg:h-[520px] flex items-center justify-center"
            style={{
              transform: `translateY(${scrollY * 0.06}px)`,
              opacity: 1 - scrollY * 0.0005,
            }}
          >
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`
                    absolute inset-0 flex items-center justify-center
                    transition-all duration-[1000ms] ease-out
                    ${
                      index === currentImageIndex
                        ? 'opacity-100 scale-105 blur-0'
                        : 'opacity-0 scale-95 blur-sm'
                    }
                  `}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.10)]"
                  />
                </div>
              ))}
            </div>

            {/* Dot indicator — sutil */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-px transition-all duration-500 ${
                    i === currentImageIndex ? 'w-8 bg-black' : 'w-4 bg-black/20'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Bottom thin divider — igual que nosotros */}
        <div className="h-px bg-black/10 w-full" />

      </div>
    </section>
  );
}
