import { httpClient } from './http-client';

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

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  apartment?: string;
}

export interface CreateOrderRequest {
  shippingName: string;
  shippingEmail: string;
  shippingPhone?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  notes?: string;
  paymentMethod: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: {
    amount: number;
    currency: string;
  };
  productId: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
}

export interface Payment {
  id: string;
  amount: {
    amount: number;
    currency: string;
  };
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  provider: string;
  providerId?: string;
  failureReason?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  currency: string;
  subtotal: {
    amount: number;
    currency: string;
  };
  tax: {
    amount: number;
    currency: string;
  };
  shipping: {
    amount: number;
    currency: string;
  };
  discount: {
    amount: number;
    currency: string;
  };
  total: {
    amount: number;
    currency: string;
  };
  notes?: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  userId: string;
  items: OrderItem[];
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
  customerEmail: string;
  customerName: string;
  stripePaymentId?: string;
  stripeChargeId?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  estimatedDelivery?: string;
  shippingAddressId?: string;
  metadata?: any;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  expiresAt?: string;
  events?: OrderEvent[];
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

export const orderService = {
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await httpClient.post<Order>('/orders', data);
    return response;
  },

  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await httpClient.get<Order[]>('/orders');
    return response;
  },

  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await httpClient.get<Order>(`/orders/${id}`);
    return response;
  },
};

export default orderService;
