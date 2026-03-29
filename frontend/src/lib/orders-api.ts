import api from './api';

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
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | 'DIGITAL_DELIVERY';
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
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

export const ordersApi = {
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

export default ordersApi;
