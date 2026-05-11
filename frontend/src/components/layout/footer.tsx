'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function Footer() {
  const pathname = usePathname();
  
  // Ocultar footer en la página de perfil
  if (pathname === '/profile') {
    return null;
  }

  return (
    <footer className="bg-white text-black border-t border-black/10">

      <div className="container mx-auto px-6 lg:px-12 py-20">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">

          {/* Brand */}
          <div className="space-y-5">
            
            <h3 className="text-xl font-medium tracking-tight flex items-center gap-2">
            <Image 
              src="/favicon.ico" 
              alt="Hack 6 Logo" 
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
              Hack 6
            </h3>

            <p className="text-sm text-black/60 leading-relaxed">
              Plataforma especializada en ciberseguridad,
              hacking ético y auditoría profesional.
            </p>

            <div className="flex justify-center md:justify-start gap-5 text-sm">

              {['YouTube', 'GitHub', 'Discord'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="
                    text-black/60
                    transition-colors duration-300
                    hover:text-black
                  "
                >
                  {item}
                </a>
              ))}

            </div>
            
          </div>

          {/* Navigation */}
          <div className="space-y-5">

            <h4 className="text-sm font-medium uppercase tracking-widest text-black/80">
              Navegación
            </h4>

            <ul className="space-y-3 text-sm">

              {[
                { name: 'Catálogo', href: '/products' },
                { name: 'Categorías', href: '/categories' },
                { name: 'Nosotros', href: '/nosotros' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="
                      text-black/60
                      transition-colors duration-300
                      hover:text-black
                    "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          
          {/* Newsletter */}
          <div className="space-y-5 max-w-sm mx-auto md:mx-0">

            <h4 className="text-sm font-medium uppercase tracking-widest text-black/80">
              Newsletter
            </h4>

            <p className="text-sm text-black/60">
              Alertas de seguridad, análisis y lanzamientos exclusivos.
            </p>

            <form className="space-y-3">

              <input
                type="email"
                placeholder="Correo electrónico"
                className="
                  w-full
                  bg-black/5
                  border border-black/10
                  rounded-full
                  px-4 py-2.5
                  text-sm text-black
                  placeholder-black/40
                  backdrop-blur
                  transition-all duration-300
                  focus:outline-none
                  focus:border-black/30
                  focus:bg-black/10
                "
              />

              <button
                type="submit"
                className="
                  w-full
                  bg-black text-white
                  rounded-full
                  py-2.5
                  text-sm font-medium
                  transition-all duration-300
                  hover:scale-[1.03]
                  hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]
                "
              >
                Suscribirse
              </button>

            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-black/10">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-black/50">

            <p>
              © {new Date().getFullYear()} Hack 6 — Ethical Hacking Only
            </p>

          </div>
        </div>

      </div>
    </footer>
  );
}
