// Order types for the new state machine system
export type OrderStatus = 'PENDING' | 'AWAITING_PAYMENT' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'EXPIRED';

export interface OrderEvent {
  id: string;
  type: string;
  fromStatus?: string;
  toStatus?: string;
  description: string;
  triggeredBy?: string;
  metadata?: any;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customerEmail: string;
  customerName: string;
  stripePaymentId?: string;
  stripeChargeId?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  estimatedDelivery?: string;
  shippingAddressId?: string;
  notes?: string;
  metadata?: any;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  events?: OrderEvent[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string | string[];
  };
}

export interface OrderSummary {
  orderId: string;
  orderNumber: string;
  total: number;
  itemCount: number;
  status: OrderStatus;
}

export interface TrackingInfo {
  trackingNumber?: string;
  trackingCarrier?: string;
  estimatedDelivery?: string;
  events: OrderEvent[];
}

// Status colors and icons for UI
export const ORDER_STATUS_CONFIG = {
  PENDING: { color: 'warning', label: 'Pendiente', icon: 'clock' },
  AWAITING_PAYMENT: { color: 'info', label: 'Esperando pago', icon: 'credit-card' },
  PAID: { color: 'success', label: 'Pagado', icon: 'check-circle' },
  PROCESSING: { color: 'primary', label: 'Procesando', icon: 'package' },
  SHIPPED: { color: 'info', label: 'Enviado', icon: 'truck' },
  DELIVERED: { color: 'success', label: 'Entregado', icon: 'home' },
  CANCELLED: { color: 'danger', label: 'Cancelado', icon: 'x-circle' },
  EXPIRED: { color: 'danger', label: 'Expirado', icon: 'alert-triangle' },
} as const;
