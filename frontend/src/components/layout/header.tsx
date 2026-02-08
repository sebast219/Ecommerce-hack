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

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary" />
            <span className="font-bold text-xl">Ecommerce</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary">
              Productos
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary">
              Categorías
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              Nosotros
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-accent rounded-md"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm">Hola, {user.firstName}</span>
                <div className="h-8 w-8 rounded-full bg-primary" />
              </div>
            ) : (
              <Link href="/auth/login" className="btn btn-primary">
                Iniciar Sesión
              </Link>
            )}

            {/* Mobile Menu */}
            <button className="md:hidden p-2 hover:bg-accent rounded-md">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
