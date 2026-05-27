'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Settings,
} from 'lucide-react';

interface MobileMenuProps {
  user: any;
  onLogout: () => void;
  activeRoute?: string;
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { name: 'Productos', icon: Package, href: '/admin/products' },
  { name: 'Pedidos', icon: ShoppingCart, href: '/admin/orders' },
  { name: 'Usuarios', icon: Users, href: '/admin/users' },
  { name: 'Análisis', icon: TrendingUp, href: '/admin/analytics' },
  { name: 'Configuración', icon: Settings, href: '/admin/settings' },
];

export default function MobileMenu({ user, onLogout, activeRoute = '/admin/dashboard' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-zinc-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-zinc-800 transition-colors"
        aria-label="Abrir menú"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Sheet */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-zinc-900">Menú</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-zinc-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold border border-gray-200 text-lg">
                {user?.firstName?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Menú Principal</p>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeRoute === item.href
                    ? 'bg-zinc-900 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-zinc-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
            >
              <X className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
