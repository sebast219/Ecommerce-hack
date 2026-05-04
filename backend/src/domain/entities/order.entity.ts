// 🏗️ DOMAIN ENTITIES - Entidad de Orden
// PROPÓSITO: Definir las reglas de negocio y datos centrales de órdenes

import { Money, User } from './user.entity';
import { Product } from './product.entity';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  currency: string;
  subtotal: Money;
  tax: Money;
  shipping: Money;
  discount: Money;
  total: Money;
  notes?: string;

  // Shipping Information
  shippingName: string;
  shippingEmail: string;
  shippingPhone?: string;
  shippingAddress: Address;
  billingAddress?: Address;

  userId: string;
  user?: User;

  items: OrderItem[];
  payment?: Payment;

  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: Money;

  orderId: string;
  order?: Order;

  productId: string;
  product?: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  order?: Order;
  amount: Money;
  currency: string;
  status: PaymentStatus;
  provider: string;
  providerId?: string;
  providerData?: any;
  failureReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  apartment?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  DIGITAL_DELIVERY = 'DIGITAL_DELIVERY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// Value Objects
export class OrderNumber {
  constructor(public readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.value || this.value.length < 8) {
      throw new Error('Order number must be at least 8 characters');
    }
    if (!/^ORD-\d{6}-\d{4}$/.test(this.value)) {
      throw new Error('Order number must follow format ORD-YYYY-NNNN');
    }
  }

  static generate(): OrderNumber {
    const date = new Date();
    const year = date.getFullYear().toString();
    const sequence = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const orderNumber = `ORD-${year}-${sequence}`;

    return new OrderNumber(orderNumber);
  }
}

export class ShippingAddress {
  constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly state: string,
    public readonly postalCode: string,
    public readonly country: string,
    public readonly apartment?: string,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.street || this.street.length < 5) {
      throw new Error(
        'Street address is required and must be at least 5 characters',
      );
    }
    if (!this.city || this.city.length < 2) {
      throw new Error('City is required and must be at least 2 characters');
    }
    if (!this.postalCode || this.postalCode.length < 3) {
      throw new Error(
        'Postal code is required and must be at least 3 characters',
      );
    }
    if (!this.country || this.country.length < 2) {
      throw new Error('Country is required and must be at least 2 characters');
    }
  }
}
