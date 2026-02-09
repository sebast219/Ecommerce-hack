'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <section className="relative min-h-screen bg-white text-black overflow-hidden">

      <div className="relative container mx-auto px-6 lg:px-12 min-h-screen">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">

          {/* Left Content */}
          <div className="space-y-10 max-w-xl">

            {/* Eyebrow */}
            <span className="text-sm uppercase tracking-[0.3em] text-gray-600">
              Seguridad • Tecnología • Futuro
            </span>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-semibold tracking-tight leading-[0.95]">
              Hack 6
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Seguridad digital diseñada para estudiantes que piensan en grande.
              Tecnología confiable, elegante y lista para el futuro.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">

              <Link
                href="/products"
                className="
                  group inline-flex items-center justify-center
                  bg-black text-white
                  rounded-full
                  px-8 py-4
                  text-base font-medium
                  transition-all duration-300
                  hover:scale-[1.03]
                  hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)]
                "
              >
                Explorar productos
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/categories"
                className="
                  inline-flex items-center justify-center
                  border border-black/30
                  rounded-full
                  px-8 py-4
                  text-base font-medium
                  text-black/90
                  backdrop-blur-sm
                  transition-all duration-300
                  hover:bg-black/10
                  hover:border-black/60
                "
              >
                Ver categorías
              </Link>

            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-[420px] lg:h-[520px] flex items-center justify-center">

            {/* Soft Glow */}
            <div className="absolute w-[420px] h-[420px] bg-gray-100 blur-[120px] rounded-full" />

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
                    className="
                      w-full h-full object-contain
                      drop-shadow-[0_40px_80px_rgba(0,0,0,0.12)]
                    "
                  />
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
