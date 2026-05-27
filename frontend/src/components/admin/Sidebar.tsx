'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
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

export default function Sidebar({ user, onLogout, activeRoute = '/admin/dashboard' }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-gray-200 bg-white z-40 hidden lg:flex flex-col">
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-6">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Menú Principal</p>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeRoute === item.href
                ? 'bg-zinc-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-zinc-900'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white border border-gray-100 shadow-sm">
          <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold border border-gray-200">
            {user?.firstName?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-all w-full"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
