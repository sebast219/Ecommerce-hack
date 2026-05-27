'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { adminService } from '@/lib/admin-service';
import { adminOrderService } from '@/lib/admin-order-service';
import { adminProductService } from '@/lib/admin-product-service';
import { adminUserService } from '@/lib/admin-user-service';
import SkeletonLoader from '@/components/admin/SkeletonLoader';
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
  Menu,
  Loader2,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
    productsGrowth: 0,
  });
  
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    revenueThisMonth: 0,
    revenueGrowth: 0,
  });
  
  const [salesData, setSalesData] = useState<Array<{ date: string; revenue: number; orders: number }>>([]);
  const [topProducts, setTopProducts] = useState<Array<{ name: string; sales: number; revenue: number }>>([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    adminUsers: 0,
    newUsersThisMonth: 0,
    usersGrowthRate: 0,
  });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadAnalytics();
    }
  }, [user, period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [dashboardStats, orderAnalytics, productAnalytics, userAnalytics] = await Promise.all([
        adminService.getStats(),
        adminOrderService.getStats(),
        adminOrderService.getAnalytics(period),
        adminUserService.getStats(),
      ]);

      if (dashboardStats.success && Array.isArray(dashboardStats.data)) {
        const statsData = dashboardStats.data[0] || {};
        setStats({
          totalRevenue: statsData.totalRevenue || 0,
          totalOrders: statsData.totalOrders || 0,
          totalUsers: statsData.totalUsers || 0,
          totalProducts: statsData.totalProducts || 0,
          revenueGrowth: statsData.revenueGrowth || 0,
          ordersGrowth: statsData.ordersGrowth || 0,
          usersGrowth: statsData.usersGrowth || 0,
          productsGrowth: statsData.productsGrowth || 0,
        });
      }

      if (orderAnalytics.success) {
        setOrderStats(orderAnalytics.data);
      }

      if (productAnalytics.success) {
        setSalesData(productAnalytics.data.dailyOrders || []);
        setTopProducts((productAnalytics.data.topProducts || []).map(p => ({
          name: p.productName,
          sales: p.totalSales,
          revenue: p.totalRevenue
        })));
      }

      if (userAnalytics.success) {
        setUserStats(userAnalytics.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  return (
    <>
      <main>
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
          {/* Header */}
          <AdminHeader
            title="Análisis y Reportes"
            subtitle="Métricas clave y rendimiento del negocio"
            badge="Panel de Administración"
            actions={
              <>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
                  {(['7d', '30d', '90d', '1y'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        period === p
                          ? 'bg-zinc-900 text-white'
                          : 'text-gray-600 hover:text-zinc-900'
                      }`}
                    >
                      {p === '7d' ? '7 días' : p === '30d' ? '30 días' : p === '90d' ? '90 días' : '1 año'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={loadAnalytics}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold hover:border-zinc-900 hover:text-zinc-900 transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  Actualizar
                </button>
                <button
                  className="flex items-center gap-2 bg-white border border-gray-200 text-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold hover:border-zinc-900 hover:text-zinc-900 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </button>
              </>
            }
          />

          {loading ? (
            <div className="space-y-8">
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <SkeletonLoader type="stat" count={4} />
              </section>
              <SkeletonLoader type="card" count={2} />
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      stats.revenueGrowth >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {stats.revenueGrowth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(stats.revenueGrowth)}%
                    </div>
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-zinc-900 mb-1">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="text-sm font-medium text-gray-500">Ingresos Totales</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      stats.ordersGrowth >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {stats.ordersGrowth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(stats.ordersGrowth)}%
                    </div>
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-zinc-900 mb-1">{formatNumber(stats.totalOrders)}</div>
                  <div className="text-sm font-medium text-gray-500">Pedidos Totales</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      stats.usersGrowth >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {stats.usersGrowth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(stats.usersGrowth)}%
                    </div>
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-zinc-900 mb-1">{formatNumber(stats.totalUsers)}</div>
                  <div className="text-sm font-medium text-gray-500">Usuarios Totales</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      stats.productsGrowth >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {stats.productsGrowth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(stats.productsGrowth)}%
                    </div>
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-zinc-900 mb-1">{formatNumber(stats.totalProducts)}</div>
                  <div className="text-sm font-medium text-gray-500">Productos Activos</div>
                </div>
              </section>

              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900">Ventas</h2>
                      <p className="text-sm text-gray-500 mt-1">Ingresos y pedidos por día</p>
                    </div>
                    <LineChart className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-64 flex items-end justify-between gap-1">
                    {salesData.length > 0 ? (
                      salesData.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-indigo-500 hover:bg-indigo-600 transition-colors rounded-t-md relative group"
                            style={{ height: `${(day.revenue / Math.max(...salesData.map(d => d.revenue))) * 100}%` }}
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-bold px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                              {formatCurrency(day.revenue)}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 truncate w-full text-center">
                            {new Date(day.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        No hay datos disponibles
                      </div>
                    )}
                  </div>
                </section>

                {/* Order Status Distribution */}
                <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900">Estado de Pedidos</h2>
                      <p className="text-sm text-gray-500 mt-1">Distribución por estado</p>
                    </div>
                    <PieChart className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Pendientes', value: orderStats.pendingOrders, color: 'bg-yellow-500' },
                      { label: 'Procesando', value: orderStats.processingOrders, color: 'bg-blue-500' },
                      { label: 'Enviados', value: orderStats.shippedOrders, color: 'bg-purple-500' },
                      { label: 'Entregados', value: orderStats.deliveredOrders, color: 'bg-green-500' },
                      { label: 'Cancelados', value: orderStats.cancelledOrders, color: 'bg-red-500' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-4">
                        <div className="w-24 text-sm text-gray-600">{item.label}</div>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color} rounded-full transition-all`}
                            style={{ width: `${(item.value / orderStats.totalOrders) * 100}%` }}
                          />
                        </div>
                        <div className="w-16 text-sm font-semibold text-zinc-900 text-right">{formatNumber(item.value)}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Top Products */}
              <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">Productos Más Vendidos</h2>
                    <p className="text-sm text-gray-500 mt-1">Top productos por ingresos</p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  {topProducts.length > 0 ? (
                    topProducts.map((product, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-zinc-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{formatNumber(product.sales)} ventas</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-zinc-900">{formatCurrency(product.revenue)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No hay datos de productos disponibles
                    </div>
                  )}
                </div>
              </section>

              {/* User Statistics */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-zinc-900">{formatNumber(userStats.totalUsers)}</div>
                      <div className="text-sm text-gray-500">Total Usuarios</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-zinc-900">{formatNumber(userStats.activeUsers)}</div>
                      <div className="text-sm text-gray-500">Usuarios Activos</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-zinc-900">{formatNumber(userStats.newUsersThisMonth)}</div>
                      <div className="text-sm text-gray-500">Nuevos este mes</div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
