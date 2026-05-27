'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function Footer() {
  const pathname = usePathname();
  
  // Ocultar footer en la página de perfil y en todas las rutas de admin
  if (pathname?.startsWith('/profile') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-white text-black border-t border-black/[0.08]">

      <div className="container mx-auto px-6 lg:px-16 py-24">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">

          {/* Brand */}
          <div className="space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-black/10 rounded-full blur-xl" />
                <Image 
                  src="/favicon.ico" 
                  alt="Hack 6 Logo" 
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full relative"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">Hack 6</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40">Security Store</span>
              </div>
            </div>

            <p className="text-sm text-black/50 leading-relaxed max-w-xs">
              Plataforma especializada en ciberseguridad, hacking ético y auditoría profesional.
            </p>

            <div className="flex gap-3">
              {['YouTube', 'GitHub', 'Discord'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="
                    px-4 py-2 rounded-full
                    text-xs font-medium text-black/50
                    bg-black/[0.03]
                    hover:bg-black hover:text-white
                    transition-all duration-300
                  "
                >
                  {item}
                </a>
              ))}
            </div>
            
          </div>

          {/* Navigation */}
          <div className="space-y-6">

            <h4 className="text-xs uppercase tracking-[0.2em] text-black/40 font-semibold">
              Navegación
            </h4>

            <ul className="space-y-4">

              {[
                { name: 'Catálogo', href: '/products' },
                { name: 'Categorías', href: '/categories' },
                { name: 'Nosotros', href: '/nosotros' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="
                      text-sm text-black/60
                      hover:text-black
                      transition-colors duration-300
                    "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">

            <h4 className="text-xs uppercase tracking-[0.2em] text-black/40 font-semibold">
              Soporte
            </h4>

            <ul className="space-y-4">

              {[
                { name: 'Centro de ayuda', href: '#' },
                { name: 'Términos de servicio', href: '#' },
                { name: 'Política de privacidad', href: '#' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="
                      text-sm text-black/60
                      hover:text-black
                      transition-colors duration-300
                    "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="space-y-6">

            <h4 className="text-xs uppercase tracking-[0.2em] text-black/40 font-semibold">
              Newsletter
            </h4>

            <p className="text-sm text-black/50 leading-relaxed">
              Alertas de seguridad, análisis y lanzamientos exclusivos.
            </p>

            <form className="space-y-3">

              <input
                type="email"
                placeholder="tu@email.com"
                className="
                  w-full
                  bg-transparent
                  border border-black/[0.08]
                  rounded-2xl
                  px-4 py-3
                  text-sm text-black
                  placeholder-black/30
                  transition-all duration-300
                  focus:outline-none
                  focus:border-black/20
                  focus:bg-black/[0.02]
                "
              />

              <button
                type="submit"
                className="
                  w-full
                  bg-black text-white
                  rounded-2xl
                  py-3
                  text-sm font-semibold
                  transition-all duration-300
                  hover:scale-[1.02]
                  hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                "
              >
                Suscribirse
              </button>

            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 pt-8 border-t border-black/[0.08]">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <p className="text-xs text-black/40">
              © {new Date().getFullYear()} Hack 6 — Ethical Hacking Only
            </p>

            <div className="flex items-center gap-6 text-xs text-black/40">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Todos los sistemas operativos
              </span>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}
