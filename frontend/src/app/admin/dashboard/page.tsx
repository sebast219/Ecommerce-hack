'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Settings,
  LogOut,
  Shield,
  Menu
} from 'lucide-react';

// ==========================================
// 1. DATOS ESTÁTICOS (Fuera del render)
// ==========================================
const DASHBOARD_STATS = [
  { label: 'Ventas Totales', value: '$48,295', change: '+12.5%', trend: 'up', icon: DollarSign },
  { label: 'Pedidos Hoy', value: '156', change: '+8.2%', trend: 'up', icon: ShoppingCart },
  { label: 'Productos Activos', value: '1,247', change: '+3.1%', trend: 'up', icon: Package },
  { label: 'Usuarios Nuevos', value: '89', change: '-2.4%', trend: 'down', icon: Users },
];

const QUICK_ACTIONS = [
  { label: 'Nuevo Producto', icon: Plus, href: '/admin/products/new' },
  { label: 'Ver Pedidos', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Estadísticas', icon: TrendingUp, href: '/admin/analytics' },
  { label: 'Configuración', icon: Settings, href: '/admin/settings' },
];

const RECENT_ORDERS = [
  { id: '#ORD-7523', customer: 'Alex Chen', product: 'WiFi Pineapple', amount: '$199.00', status: 'Completado', date: 'Hace 2 min' },
  { id: '#ORD-7522', customer: 'Maria Silva', product: 'Flipper Zero', amount: '$169.00', status: 'En proceso', date: 'Hace 15 min' },
  { id: '#ORD-7521', customer: 'John Doe', product: 'USB Rubber Ducky', amount: '$59.99', status: 'Completado', date: 'Hace 1 hora' },
  { id: '#ORD-7520', customer: 'Sarah Kim', product: 'LAN Turtle', amount: '$79.99', status: 'Pendiente', date: 'Hace 2 horas' },
  { id: '#ORD-7519', customer: 'Mike Ross', product: 'Bash Bunny', amount: '$119.99', status: 'Completado', date: 'Hace 3 horas' },
];

const TOP_PRODUCTS = [
  { name: 'WiFi Pineapple', sales: 342, revenue: '$68,058', growth: '+24%' },
  { name: 'Flipper Zero', sales: 298, revenue: '$50,362', growth: '+18%' },
  { name: 'USB Rubber Ducky', sales: 256, revenue: '$15,357', growth: '+12%' },
  { name: 'Bash Bunny', sales: 189, revenue: '$22,678', growth: '+9%' },
];

// ==========================================
// 2. SUBCOMPONENTES (UI Modular)
// ==========================================

const Sidebar = ({ user, onLogout }: { user: any, onLogout: () => void }) => (
  <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-gray-200 bg-white z-40 hidden lg:flex flex-col">
    <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-6">
      <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Menú Principal</p>
      {[
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard', active: true },
        { name: 'Productos', icon: Package, href: '/admin/products' },
        { name: 'Pedidos', icon: ShoppingCart, href: '/admin/orders' },
        { name: 'Usuarios', icon: Users, href: '/admin/users' },
        { name: 'Análisis', icon: TrendingUp, href: '/admin/analytics' },
        { name: 'Configuración', icon: Settings, href: '/admin/settings' },
      ].map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            item.active 
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

const StatCard = ({ stat }: { stat: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
        <stat.icon className="h-5 w-5 text-gray-500" />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
        stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}>
        {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {stat.change}
      </div>
    </div>
    <div className="text-3xl font-bold tracking-tight text-zinc-900 mb-1">{stat.value}</div>
    <div className="text-sm font-medium text-gray-500">{stat.label}</div>
  </div>
);

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user?.role !== 'ADMIN') router.push('/');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4 text-zinc-500">
          <div className="h-8 w-8 border-4 border-gray-200 border-t-zinc-900 rounded-full animate-spin" />
          <span className="text-sm font-medium animate-pulse">Preparando entorno seguro...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      {/* Sidebar Modularizado */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Contenido Principal */}
      <main className="lg:ml-64 lg:mt-16 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
          
          {/* Cabecera Responsiva */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Menu className="h-6 w-6 lg:hidden text-zinc-900" /> {/* Menú hamburguesa para móvil (visual) */}
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  Panel de Administración
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mt-2">Resumen General</h1>
            </div>
            
            <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-sm font-medium text-gray-600 capitalize">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                Sistema En Línea
              </div>
            </div>
          </header>

          {/* Grid de Estadísticas */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {DASHBOARD_STATS.map((stat, i) => (
              <StatCard key={i} stat={stat} />
            ))}
          </section>

          {/* Acciones Rápidas */}
          <section className="flex flex-wrap gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="group flex items-center gap-2 bg-white border border-gray-200 text-zinc-700 rounded-xl px-5 py-2.5 text-sm font-semibold hover:border-zinc-900 hover:text-zinc-900 hover:shadow-md transition-all duration-200"
              >
                <action.icon className="h-4 w-4 text-gray-400 group-hover:text-zinc-900 transition-colors" />
                {action.label}
              </Link>
            ))}
          </section>

          {/* Columnas Principales */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
            
            {/* Pedidos Recientes */}
            <section className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-lg font-bold text-zinc-900">Pedidos Recientes</h2>
                <Link href="/admin/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                  Ver todos <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {RECENT_ORDERS.map((order, i) => (
                  <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <Package className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-zinc-900">{order.id}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{order.customer}</div>
                      </div>
                    </div>
                    <div className="flex-1 sm:px-8">
                      <div className="text-sm font-medium text-gray-700">{order.product}</div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Completado' ? 'bg-green-100 text-green-700 border border-green-200' 
                        : order.status === 'En proceso' ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {order.status}
                      </span>
                      <div className="text-right">
                        <div className="font-bold text-sm text-zinc-900">{order.amount}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{order.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Productos Más Vendidos */}
            <section className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-zinc-900">Más Vendidos</h2>
              </div>
              <div className="divide-y divide-gray-100 p-2">
                {TOP_PRODUCTS.map((product, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-md bg-gray-100 text-xs font-bold text-gray-500">
                          {i + 1}
                        </span>
                        <h3 className="font-bold text-sm text-zinc-900">{product.name}</h3>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        {product.growth}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pl-9">
                      <span>{product.sales} ventas</span>
                      <span className="font-semibold text-zinc-700">{product.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Gráfico & CTA Container */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
            {/* Gráfico Placeholder Refinado */}
            <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Actividad de Ventas</h2>
                  <p className="text-sm text-gray-500 mt-1">Ingresos de los últimos 30 días</p>
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                  <button className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-white text-zinc-900 shadow-sm">Mensual</button>
                  <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-zinc-900">Semanal</button>
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-1 sm:gap-2">
                {[65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95, 70, 80, 60, 75, 85, 70, 90, 65, 80, 75, 85, 60, 95, 70, 80, 75, 90, 85, 70].map((height, i) => (
                  <div key={i} className="flex-1 bg-indigo-100 hover:bg-indigo-500 transition-colors rounded-t-md relative group" style={{ height: `${height}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-bold px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      ${(height * 500).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs font-medium text-gray-400 border-t border-gray-100 pt-4">
                <span>1 Dic</span>
                <span>15 Dic</span>
                <span>31 Dic</span>
              </div>
            </section>

            {/* CTA Section Mejorado */}
            <section className="bg-zinc-900 text-white rounded-3xl relative overflow-hidden shadow-xl flex flex-col justify-center p-8 sm:p-10 group">
              {/* Efectos de fondo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20 transition-transform group-hover:scale-110 duration-700" />
              
              <div className="relative z-10 flex flex-col h-full justify-center">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  Gestiona tu catálogo
                </h3>
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                  Mantén tu inventario actualizado, revisa el stock y lanza nuevos productos al mercado de manera sencilla.
                </p>
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center justify-center gap-2 bg-white text-zinc-900 rounded-xl px-6 py-3.5 text-sm font-bold hover:bg-gray-50 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 w-full sm:w-auto"
                >
                  <Plus className="h-5 w-5" />
                  Agregar Nuevo Producto
                </Link>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}