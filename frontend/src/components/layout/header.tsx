'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { CartDrawer } from '@/components/cart/cart-drawer';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { items } = useCartStore();
  const { user } = useAuthStore();

  const cartItemsCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <header
        className="
          sticky top-0 z-50 w-full
          bg-white border-b border-gray-200
        "
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-12">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-black font-medium tracking-tight"
          >
            <img 
              src="/favicon.ico" 
              alt="Hack 6 Logo" 
              className="h-10 w-10 rounded-full"
            />
            <span className="text-lg">Hack 6</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-black/80">

            {[
              { name: 'Productos', href: '/products' },
              { name: 'Categorías', href: '/categories' },
              { name: 'Nosotros', href: '/nosotros' }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="
                  relative transition-colors duration-300
                  hover:text-black
                  after:absolute after:left-0 after:-bottom-1
                  after:h-px after:w-0 after:bg-black
                  after:transition-all after:duration-300
                  hover:after:w-full
                "
              >
                {item.name}
              </Link>
            ))}

          </nav>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-sm mx-8">

            <div className="relative w-full">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

              <input
                type="search"
                placeholder="Buscar"
                className="
                  w-full
                  bg-gray-50
                  border border-gray-200
                  rounded-full
                  pl-10 pr-4 py-2
                  text-sm text-black
                  placeholder-gray-400
                  transition-all duration-300
                  focus:outline-none
                  focus:border-gray-300
                  focus:bg-white
                "
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="
                relative
                p-2 rounded-full
                text-black/80
                transition-all duration-300
                hover:bg-gray-100
                hover:text-black
              "
            >
              <ShoppingCart className="h-5 w-5" />

              {cartItemsCount > 0 && (
                <span
                  className="
                    absolute -top-1 -right-1
                    h-4 w-4 rounded-full
                    bg-black text-white
                    text-[10px] font-medium
                    flex items-center justify-center
                  "
                >
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="flex items-center gap-2">

                <span className="hidden sm:block text-sm text-black/70">
                  Hola, {user.firstName}
                </span>

                <div className="h-8 w-8 rounded-full bg-black/90" />

              </div>
            ) : (
              <Link
                href="/auth/login"
                className="
                  px-5 py-2
                  rounded-full
                  bg-black text-white
                  text-sm font-medium
                  transition-all duration-300
                  hover:scale-[1.05]
                  hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]
                "
              >
                Iniciar sesión
              </Link>
            )}

            {/* Mobile */}
            <button
              className="
                md:hidden
                p-2 rounded-full
                text-black/80
                hover:bg-gray-100
              "
            >
              <Menu className="h-5 w-5" />
            </button>

          </div>
        </div>
      </header>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
