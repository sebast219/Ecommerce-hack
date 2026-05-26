import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Order, OrderEvent, OrderSummary, TrackingInfo } from '@/lib/order-service';
import { tokenManager } from '@/lib/token-manager';

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user orders
  const getOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/orders');
      setOrders((response.data as any)?.data?.orders || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  // Get order details
  const getOrder = async (orderId: string): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/orders/${orderId}`);
      return (response.data as any)?.data;
    } catch (err: any) {
      setError(err.message || 'Error al cargar la orden');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get order tracking
  const getOrderTracking = async (orderId: string): Promise<TrackingInfo | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/orders/${orderId}/tracking`);
      return (response.data as any)?.data;
    } catch (err: any) {
      setError(err.message || 'Error al cargar el tracking');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create order
  const createOrder = async (orderData: {
    shippingAddressId?: string;
    notes?: string;
  }): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/orders', orderData);
      const newOrder = (response.data as any)?.data;
      
      // Add to local state
      if (newOrder) {
        setOrders(prev => [newOrder, ...prev]);
      }
      
      return newOrder;
    } catch (err: any) {
      setError(err.message || 'Error al crear la orden');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.post(`/orders/${orderId}/cancel`);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'CANCELLED', cancelledAt: new Date().toISOString() }
          : order
      ));
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al cancelar la orden');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Create payment intent for order
  const createPaymentIntent = async (orderId: string, amount: number = 0): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      // Use the correct endpoint: /payments/orders/:orderId/intent
      const response = await apiClient.post(`/payments/orders/${orderId}/intent`);
      return (response.data as any)?.data?.clientSecret;
    } catch (err: any) {
      setError(err.message || 'Error al crear el payment intent');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Real-time order updates (polling)
  const startOrderTracking = (orderId: string, callback: (order: Order) => void) => {
    const interval = setInterval(async () => {
      const updatedOrder = await getOrder(orderId);
      if (updatedOrder) {
        callback(updatedOrder);
        
        // Stop tracking if order is in final state
        if (['DELIVERED', 'CANCELLED', 'EXPIRED'].includes(updatedOrder.status)) {
          clearInterval(interval);
        }
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  };

  // Calculate order expiration time
  const getOrderExpirationTime = (order: Order): number | null => {
    if (!order.expiresAt || order.status !== 'PENDING') return null;
    const expirationTime = new Date(order.expiresAt).getTime();
    const now = new Date().getTime();
    return Math.max(0, expirationTime - now);
  };

  // Format order status for display
  const formatOrderStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      PENDING: 'Pendiente',
      AWAITING_PAYMENT: 'Esperando pago',
      PAID: 'Pagado',
      PROCESSING: 'Procesando',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregado',
      CANCELLED: 'Cancelado',
      EXPIRED: 'Expirado',
    };
    return statusMap[status] || status;
  };

  // Get status color for UI
  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      PENDING: 'warning',
      AWAITING_PAYMENT: 'info',
      PAID: 'success',
      PROCESSING: 'primary',
      SHIPPED: 'info',
      DELIVERED: 'success',
      CANCELLED: 'danger',
      EXPIRED: 'danger',
    };
    return colorMap[status] || 'secondary';
  };

  useEffect(() => {
    if (tokenManager.hasValidTokens()) {
      getOrders();
    }
  }, []);

  return {
    orders,
    loading,
    error,
    getOrders,
    getOrder,
    getOrderTracking,
    createOrder,
    cancelOrder,
    createPaymentIntent,
    startOrderTracking,
    getOrderExpirationTime,
    formatOrderStatus,
    getStatusColor,
  };
};
