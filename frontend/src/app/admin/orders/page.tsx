'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { adminOrderService, AdminOrder } from '@/lib/admin-order-service';
import Pagination from '@/components/admin/Pagination';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  Package,
  ShoppingCart,
  Search,
  Eye,
  Edit,
  Trash2,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Menu,
  Loader2
} from 'lucide-react';

// Status configuration
const ORDER_STATUS_CONFIG = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  AWAITING_PAYMENT: { label: 'Esperando pago', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: DollarSign },
  PAID: { label: 'Pagado', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  PROCESSING: { label: 'Procesando', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Package },
  SHIPPED: { label: 'Enviado', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Truck },
  DELIVERED: { label: 'Entregado', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  EXPIRED: { label: 'Expirado', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock },
};

export default function AdminOrdersPage() {
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || undefined,
        status: filterStatus || undefined,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
        page: currentPage,
        limit: pageSize,
      };

      const response = await adminOrderService.getAll(params);
      
      // Manejar respuesta directa o anidada
      const ordersData = Array.isArray(response) ? response : (response?.data || []);
      setOrders(ordersData);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, sortBy, sortOrder, currentPage, pageSize]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await adminOrderService.updateStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));
    } catch (error: any) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este pedido?')) return;
    
    try {
      await adminOrderService.delete(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error: any) {
      console.error('Error deleting order:', error);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(order => order.id)));
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedOrders.size === 0) return;
    
    try {
      const updates = Array.from(selectedOrders).map(id => ({ id, status: newStatus }));
      await adminOrderService.bulkUpdateStatus(updates);
      setOrders(orders.map(order => 
        selectedOrders.has(order.id) ? { ...order, status: newStatus as any } : order
      ));
      setSelectedOrders(new Set());
    } catch (error: any) {
      console.error('Error bulk updating orders:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await adminOrderService.export({ search: searchTerm, status: filterStatus });
      if (response.success) {
        const blob = new Blob([response.data.csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.data.filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error: any) {
      console.error('Error exporting orders:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <>
      <main>
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
          {/* Header */}
          <AdminHeader
            title="Gestión de Pedidos"
            count={orders.length}
            badge="Panel de Administración"
            actions={
              <>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold hover:border-zinc-900 hover:text-zinc-900 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </button>
                <button
                  onClick={fetchOrders}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold hover:border-zinc-900 hover:text-zinc-900 transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  Actualizar
                </button>
              </>
            }
          />

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número de pedido, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="PENDING">Pendiente</option>
                <option value="AWAITING_PAYMENT">Esperando pago</option>
                <option value="PAID">Pagado</option>
                <option value="PROCESSING">Procesando</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregado</option>
                <option value="CANCELLED">Cancelado</option>
                <option value="EXPIRED">Expirado</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              >
                <option value="createdAt-desc">Más recientes</option>
                <option value="createdAt-asc">Más antiguos</option>
                <option value="total-desc">Mayor monto</option>
                <option value="total-asc">Menor monto</option>
                <option value="orderNumber-asc">Número de pedido</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedOrders.size > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedOrders.size} pedidos seleccionados
                </span>
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  >
                    <option value="">Cambiar estado...</option>
                    <option value="PAID">Marcar como pagado</option>
                    <option value="PROCESSING">Marcar como procesando</option>
                    <option value="SHIPPED">Marcar como enviado</option>
                    <option value="DELIVERED">Marcar como entregado</option>
                    <option value="CANCELLED">Cancelar pedidos</option>
                  </select>
                  <button
                    onClick={() => setSelectedOrders(new Set())}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-zinc-900"
                  >
                    Limpiar selección
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-gray-400" />
                <p className="mt-4 text-gray-600">Cargando pedidos...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 mb-2">No se encontraron pedidos</h3>
                <p className="text-gray-600">No hay pedidos que coincidan con los criterios de búsqueda.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedOrders.size === orders.length}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-zinc-900 focus:ring-zinc-900"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Pedido
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => {
                      const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG];
                      const StatusIcon = statusConfig?.icon || Clock;
                      
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedOrders.has(order.id)}
                              onChange={() => handleSelectOrder(order.id)}
                              className="rounded border-gray-300 text-zinc-900 focus:ring-zinc-900"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                <Package className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div>
                                <div className="font-bold text-sm text-zinc-900">{order.orderNumber}</div>
                                <div className="text-xs text-gray-500">{order.items.length} items</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-sm text-zinc-900">{order.customerName}</div>
                              <div className="text-xs text-gray-500">{order.customerEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig?.label || order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-sm text-zinc-900">
                              {formatCurrency(order.total, order.currency)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              {formatDate(order.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/orders/${order.id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`/admin/orders/${order.id}/edit`}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(orders.length / pageSize)}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                totalItems={orders.length}
              />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
