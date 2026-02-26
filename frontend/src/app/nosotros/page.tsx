'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Users,
  Target,
  Award,
  Zap,
  Star,
  ArrowRight,
} from 'lucide-react';

export default function NosotrosPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animación de entrada optimizada
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { value: '10K+', label: 'Profesionales Formados' },
    { value: '500+', label: 'Herramientas Disponibles' },
    { value: '98%', label: 'Satisfacción Clientes' },
    { value: '24/7', label: 'Soporte Técnico' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Seguridad Máxima',
      description:
        'Compromiso absoluto con la calidad y seguridad de cada herramienta que ofrecemos.',
      number: '01',
    },
    {
      icon: Users,
      title: 'Comunidad Activa',
      description:
        'Red de profesionales y estudiantes compartiendo conocimiento y experiencias.',
      number: '02',
    },
    {
      icon: Target,
      title: 'Enfoque Práctico',
      description:
        'Herramientas diseñadas para uso real en escenarios de ciberseguridad profesionales.',
      number: '03',
    },
    {
      icon: Award,
      title: 'Excelencia Garantizada',
      description:
        'Estándares de calidad superiores con validación de expertos en la industria.',
      number: '04',
    },
  ];

  const manifesto = [
    'Creemos que la seguridad no es un lujo.',
    'Es una responsabilidad compartida.',
    'Construimos para quienes piensan en grande.',
  ];

  return (
    <main className={`bg-white text-black overflow-hidden transition-all duration-700 ease-out ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-between px-6 lg:px-12 overflow-hidden fade-in">

        {/* Ambient blur */}
        <div
          className="pointer-events-none absolute right-[-200px] top-[-200px] w-[700px] h-[700px] rounded-full bg-gray-100 blur-[160px] opacity-60"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />

        {/* Top label row */}
        <div className="relative z-10 pt-32 flex items-center justify-between">
          <span className="uppercase tracking-[0.4em] text-xs text-black/40 font-medium">
            • Seguridad • Tecnología • Futuro •
          </span>
          <span className="uppercase tracking-[0.4em] text-xs text-black/40 font-medium">
            Nosotros
          </span>
        </div>

        {/* Main headline */}
        <div
          className="relative z-10 pb-0"
          style={{
            transform: `translateY(${scrollY * 0.18}px)`,
            opacity: 1 - scrollY * 0.0009,
          }}
        >
          <h1
            className="
              text-[clamp(4rem,11vw,9.5rem)]
              font-semibold
              tracking-[-0.03em]
              leading-[0.92]
              max-w-5xl
            "
          >
            Seguridad
            <br />
            <span className="text-black/25">al más alto</span>
            <br />
            nivel.
          </h1>
        </div>

        {/* Bottom row */}
        <div
          className="relative z-10 pb-20 flex flex-col sm:flex-row items-end justify-between gap-10"
          style={{
            transform: `translateY(${scrollY * 0.08}px)`,
            opacity: 1 - scrollY * 0.0006,
          }}
        >
          <p className="text-base text-black/50 max-w-sm leading-relaxed">
            Formamos expertos y desarrollamos herramientas diseñadas
            para el mundo real.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => valuesRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="
                group inline-flex items-center gap-2
                bg-black text-white
                rounded-full px-7 py-3.5
                text-sm font-medium
                hover:scale-[1.03]
                hover:shadow-[0_10px_40px_rgba(0,0,0,0.18)]
                transition-all duration-300
              "
            >
              Descubrir más
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <Link
              href="/products"
              className="
                inline-flex items-center gap-2
                border border-black/25
                rounded-full px-7 py-3.5
                text-sm font-medium
                hover:bg-black/5
                hover:border-black/50
                transition-all duration-300
              "
            >
              Ver productos
            </Link>
          </div>
        </div>

        {/* Thin divider line animating in */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10" />
      </section>


      {/* ─── MANIFESTO / MARQUEE ──────────────────────────────────── */}
      <section className="border-y border-black/10 overflow-hidden py-6">
        <div
          className="flex gap-24 whitespace-nowrap animate-[marquee_22s_linear_infinite]"
          style={{ width: 'max-content' }}
        >
          {[...manifesto, ...manifesto, ...manifesto].map((line, i) => (
            <span
              key={i}
              className="text-sm uppercase tracking-[0.3em] text-black/40 font-medium"
            >
              {line}
              <span className="mx-12 text-black/15">·</span>
            </span>
          ))}
        </div>

        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
        `}</style>
      </section>


      {/* ─── STATS ────────────────────────────────────────────────── */}
      <section className="py-28 max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-black/10 border border-black/10 rounded-3xl overflow-hidden">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group p-10 flex flex-col gap-3 hover:bg-black/[0.02] transition-colors duration-300"
            >
              <div className="text-[3.5rem] md:text-[4.5rem] font-semibold tracking-tight leading-none">
                {stat.value}
              </div>
              <div className="h-px w-8 bg-black/20 group-hover:w-14 transition-all duration-300" />
              <div className="text-xs uppercase tracking-[0.25em] text-black/40 leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ─── STORY / EDITORIAL BLOCK ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-[1fr_2fr] gap-16 items-start border-t border-black/10">
        <div className="lg:sticky lg:top-32">
          <span className="uppercase tracking-[0.35em] text-xs text-black/40 font-medium block mb-4">
            Nuestra historia
          </span>
          <h2 className="text-3xl font-semibold tracking-tight leading-snug">
            Nacimos de
            <br />
            la necesidad.
          </h2>
        </div>

        <div className="space-y-8 text-lg text-black/60 leading-relaxed">
          <p>
            Hack 6 nació de la frustración de no encontrar herramientas
            de ciberseguridad confiables, bien documentadas y accesibles
            para quienes recién empiezan —y también para los que ya llevan
            años en el campo.
          </p>
          <p>
            Construimos una plataforma donde la tecnología profesional
            se encuentra con la educación práctica. Cada herramienta que
            listamos la probamos. Cada recurso que publicamos lo validamos
            con expertos reales.
          </p>
          <p className="text-black font-medium">
            No somos un marketplace genérico.
            Somos una comunidad con estándares.
          </p>
        </div>
      </section>


      {/* ─── VALUES ───────────────────────────────────────────────── */}
      <section ref={valuesRef} className="py-28 border-t border-black/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          <div className="flex items-end justify-between mb-20">
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight leading-tight max-w-sm">
              Nuestros
              <br />
              Valores
            </h2>
            <span className="text-xs uppercase tracking-[0.35em] text-black/40 hidden sm:block">
              Principios fundamentales
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10">
            {values.map((value, i) => (
              <div
                key={i}
                className="group bg-white p-10 hover:bg-black hover:text-white transition-all duration-500 flex flex-col gap-6"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono text-black/30 group-hover:text-white/30 transition-colors">
                    {value.number}
                  </span>
                  <value.icon className="h-5 w-5 text-black/30 group-hover:text-white/60 transition-colors" />
                </div>

                <h3 className="text-2xl font-semibold tracking-tight">
                  {value.title}
                </h3>

                <p className="text-black/55 group-hover:text-white/65 text-sm leading-relaxed transition-colors">
                  {value.description}
                </p>

                <div className="h-px w-8 bg-black/15 group-hover:bg-white/25 group-hover:w-16 transition-all duration-500 mt-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-black text-white relative overflow-hidden">

        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.06),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.04),transparent_55%)]" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-40">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-16 items-end">

            <h2
              className="
                text-[clamp(3rem,7vw,6rem)]
                font-semibold
                tracking-[-0.03em]
                leading-[0.92]
              "
            >
              La seguridad
              <br />
              no es
              <br />
              <span className="text-white/30">opcional.</span>
            </h2>

            <div className="space-y-8">
              <p className="text-lg text-white/50 leading-relaxed">
                Únete a una comunidad que trabaja con herramientas
                diseñadas para el más alto nivel profesional.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href="/products"
                  className="
                    group inline-flex items-center justify-center gap-2
                    bg-white text-black
                    rounded-full px-8 py-4
                    text-sm font-medium
                    hover:scale-[1.02]
                    hover:shadow-[0_10px_50px_rgba(255,255,255,0.2)]
                    transition-all duration-300
                  "
                >
                  Explorar productos
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/auth/register"
                  className="
                    inline-flex items-center justify-center
                    border border-white/20
                    rounded-full px-8 py-4
                    text-sm font-medium text-white/70
                    hover:border-white/50
                    hover:text-white
                    hover:bg-white/5
                    transition-all duration-300
                  "
                >
                  Crear cuenta gratuita
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
