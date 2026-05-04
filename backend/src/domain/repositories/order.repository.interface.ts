// 🏗️ DOMAIN REPOSITORIES INTERFACES - Contratos de órdenes
// PROPÓSITO: Definir cómo la capa de dominio interactúa con órdenes

import {
  Order,
  OrderItem,
  Payment,
  OrderStatus,
  PaymentStatus,
} from '../entities/order.entity';
import { Money } from '../entities/user.entity';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface IOrderRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  create(
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Order>;
  update(id: string, orderData: Partial<Order>): Promise<Order>;
  delete(id: string): Promise<void>;

  // Métodos específicos del dominio
  findByStatus(status: OrderStatus): Promise<Order[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  generateOrderNumber(): Promise<string>;

  // Métodos de consulta avanzada
  findWithItems(orderId: string): Promise<Order | null>;
  findWithPayment(orderId: string): Promise<Order | null>;
  findUserOrdersWithDetails(userId: string): Promise<Order[]>;

  // Métodos para items y pagos
  createOrderItem(itemData: {
    orderId: string;
    productId: string;
    quantity: number;
    price: Money;
  }): Promise<OrderItem>;
  createPayment(paymentData: Omit<Payment, 'id'>): Promise<Payment>;

  // Métodos de existencia
  existsByOrderNumber(orderNumber: string): Promise<boolean>;
}

export interface IOrderItemRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<OrderItem | null>;
  create(itemData: Omit<OrderItem, 'id'>): Promise<OrderItem>;
  update(id: string, itemData: Partial<OrderItem>): Promise<OrderItem>;
  delete(id: string): Promise<void>;

  // Métodos específicos
  findByOrderId(orderId: string): Promise<OrderItem[]>;
  findByProductId(productId: string): Promise<OrderItem[]>;
  deleteByOrderId(orderId: string): Promise<void>;
}

export interface IPaymentRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  create(
    paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Payment>;
  update(id: string, paymentData: Partial<Payment>): Promise<Payment>;
  delete(id: string): Promise<void>;

  // Métodos específicos
  findByStatus(status: PaymentStatus): Promise<Payment[]>;
  findByProvider(provider: string): Promise<Payment[]>;
  findByProviderId(providerId: string): Promise<Payment | null>;

  // Métodos de consulta
  findPaymentsByDateRange(startDate: Date, endDate: Date): Promise<Payment[]>;
  findFailedPayments(): Promise<Payment[]>;
  findPendingPayments(): Promise<Payment[]>;
}
