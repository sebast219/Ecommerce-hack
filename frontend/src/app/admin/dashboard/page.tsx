'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { adminService, DashboardStats, RecentOrder, TopProduct, SalesActivity } from '@/lib/admin-service';
import { usePathname } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
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
  Menu,
  Loader2
} from 'lucide-react';

// ==========================================
// 1. TIPOS DE DATOS
// ==========================================

// Use types from admin-service to avoid conflicts

// ==========================================
// 2. ACCIONES RÁPIDAS (Estáticas)
// ==========================================
const QUICK_ACTIONS = [
  { label: 'Nuevo Producto', icon: Plus, href: '/admin/products/new' },
  { label: 'Ver Pedidos', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Estadísticas', icon: TrendingUp, href: '/admin/analytics' },
  { label: 'Configuración', icon: LayoutDashboard, href: '/admin/settings' },
];

const StatCard = ({ stat, isLoading }: { stat: any, isLoading: boolean }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    {isLoading ? (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    ) : stat ? (
      <>
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
            {stat.icon === 'DollarSign' && <DollarSign className="h-5 w-5 text-gray-500" />}
            {stat.icon === 'ShoppingCart' && <ShoppingCart className="h-5 w-5 text-gray-500" />}
            {stat.icon === 'Package' && <Package className="h-5 w-5 text-gray-500" />}
            {stat.icon === 'Users' && <Users className="h-5 w-5 text-gray-500" />}
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
      </>
    ) : (
      <div className="flex items-center justify-center h-24 text-gray-400">
        Error loading data
      </div>
    )}
  </div>
);

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================

export default function AdminDashboardPage() {
  const pathname = usePathname();
  
  // Estados para datos del dashboard
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesActivity, setSalesActivity] = useState<any[]>([]);
  
  // Estados de carga
  const [loading, setLoading] = useState({
    stats: true,
    orders: true,
    products: true,
    activity: true
  });
  
  // Estado de error
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setError(null);
        
        // Cargar todos los datos del dashboard en una sola llamada
        setLoading({ stats: true, orders: true, products: true, activity: true });
        
        const dashboardData = await adminService.getDashboardSummary();
        
        setStats(Array.isArray(dashboardData.stats) ? dashboardData.stats : []);
        setRecentOrders(dashboardData.recentOrders || []);
        setTopProducts(dashboardData.topProducts || []);
        setSalesActivity(dashboardData.salesActivity || []);
        
        setLoading({ stats: false, orders: false, products: false, activity: false });
        
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Error loading dashboard data');
        setLoading({ stats: false, orders: false, products: false, activity: false });
      }
    };

    loadDashboardData();
  }, []);

  if (error && !loading.stats && !loading.orders && !loading.products && !loading.activity) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4 text-zinc-500">
          <div className="text-red-500">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Contenido Principal */}
      <main>
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
          
          {/* Cabecera Responsiva */}
          <AdminHeader
            title="Resumen General"
            subtitle="Vista general de métricas y actividad reciente"
            badge="Panel de Administración"
            actions={
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
            }
          />

          {/* Grid de Estadísticas */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading.stats ? (
              // Skeleton loaders para estadísticas
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-6 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))
            ) : (
              stats.map((stat, i) => (
                <StatCard key={i} stat={stat} isLoading={false} />
              ))
            )}
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
                {loading.orders ? (
                  // Skeleton loaders para pedidos
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gray-200 animate-pulse"></div>
                        <div>
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex-1 sm:px-8">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="text-right">
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                          <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : recentOrders.length > 0 ? (
                  recentOrders.map((order, i) => (
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
                          : order.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {order.status}
                        </span>
                        <div className="text-right">
                          <div className="font-bold text-sm text-zinc-900">{order.amount}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{order.date}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No hay pedidos recientes
                  </div>
                )}
              </div>
            </section>

            {/* Productos Más Vendidos */}
            <section className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-zinc-900">Más Vendidos</h2>
              </div>
              <div className="divide-y divide-gray-100 p-2">
                {loading.products ? (
                  // Skeleton loaders para productos
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-md bg-gray-200 animate-pulse"></div>
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-5 w-12 rounded-md bg-gray-200 animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 pl-9">
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))
                ) : topProducts.length > 0 ? (
                  topProducts.map((product, i) => (
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
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No hay productos vendidos
                  </div>
                )}
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
                {loading.activity ? (
                  // Skeleton loader para gráfico
                  Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="flex-1 bg-gray-200 rounded-t-md animate-pulse" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                  ))
                ) : salesActivity.length > 0 ? (
                  salesActivity.map((day, i) => (
                    <div key={i} className="flex-1 bg-indigo-100 hover:bg-indigo-500 transition-colors rounded-t-md relative group" style={{ height: `${(day.value / Math.max(...salesActivity.map(d => d.value))) * 100}%` }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-bold px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {day.label}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    No hay datos de ventas disponibles
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-4 text-xs font-medium text-gray-400 border-t border-gray-100 pt-4">
                {salesActivity.length > 0 && (
                  <>
                    <span>{new Date(salesActivity[0]?.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                    <span>{new Date(salesActivity[Math.floor(salesActivity.length / 2)]?.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                    <span>{new Date(salesActivity[salesActivity.length - 1]?.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                  </>
                )}
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
    </>
  );
}