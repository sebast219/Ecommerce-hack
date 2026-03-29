// 🏗️ INFRASTRUCTURE REPOSITORIES IMPLEMENTATIONS - Órdenes
// PROPÓSITO: Implementar interfaces de órdenes usando Prisma

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  Order,
  OrderItem,
  Payment,
  OrderStatus,
  PaymentStatus,
} from '../../../domain/entities/order.entity';
import { Money } from '../../../domain/entities/user.entity';
import { IOrderRepository } from '../../../domain/repositories/order.repository.interface';

@Injectable()
export class OrderRepositoryImpl implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const prismaOrder = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: true,
      },
    });

    return prismaOrder ? this.mapPrismaOrderToOrder(prismaOrder) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const prismaOrders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return prismaOrders.map((order) => this.mapPrismaOrderToOrder(order));
  }

  async create(
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Order> {
    const prismaOrder = await this.prisma.order.create({
      data: {
        orderNumber: orderData.orderNumber,
        status: orderData.status,
        currency: orderData.currency,
        subtotal: orderData.subtotal.amount,
        tax: orderData.tax.amount,
        shipping: orderData.shipping.amount,
        discount: orderData.discount.amount,
        total: orderData.total.amount,
        notes: orderData.notes,
        shippingName: orderData.shippingName,
        shippingEmail: orderData.shippingEmail,
        shippingPhone: orderData.shippingPhone,
        shippingAddress: orderData.shippingAddress as any,
        billingAddress: orderData.billingAddress as any,
        userId: orderData.userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: true,
      },
    });

    return this.mapPrismaOrderToOrder(prismaOrder);
  }

  async update(id: string, orderData: Partial<Order>): Promise<Order> {
    const prismaOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status: orderData.status,
        notes: orderData.notes,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: true,
      },
    });

    return this.mapPrismaOrderToOrder(prismaOrder);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id },
    });
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const prismaOrders = await this.prisma.order.findMany({
      where: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: true,
      },
    });

    return prismaOrders.map((order) => this.mapPrismaOrderToOrder(order));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    const prismaOrders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: true,
      },
    });

    return prismaOrders.map((order) => this.mapPrismaOrderToOrder(order));
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const prismaOrder = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: true,
      },
    });

    return prismaOrder ? this.mapPrismaOrderToOrder(prismaOrder) : null;
  }

  async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString();
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `ORD-${year}-${sequence}`;

    // Verificar que no exista
    const exists = await this.existsByOrderNumber(orderNumber);
    if (exists) {
      return this.generateOrderNumber();
    }

    return orderNumber;
  }

  async findWithItems(orderId: string): Promise<Order | null> {
    const prismaOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: true,
      },
    });

    return prismaOrder ? this.mapPrismaOrderToOrder(prismaOrder) : null;
  }

  async findWithPayment(orderId: string): Promise<Order | null> {
    const prismaOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: true,
      },
    });

    return prismaOrder ? this.mapPrismaOrderToOrder(prismaOrder) : null;
  }

  async findUserOrdersWithDetails(userId: string): Promise<Order[]> {
    return this.findByUserId(userId);
  }

  async createOrderItem(itemData: {
    orderId: string;
    productId: string;
    quantity: number;
    price: Money;
  }): Promise<OrderItem> {
    const prismaItem = await this.prisma.orderItem.create({
      data: {
        orderId: itemData.orderId,
        productId: itemData.productId,
        quantity: itemData.quantity,
        price: itemData.price.amount,
      },
      include: {
        product: true,
        order: true,
      },
    });

    return this.mapPrismaOrderItemToOrderItem(prismaItem);
  }

  async createPayment(
    paymentData: Omit<Payment, 'id'>,
  ): Promise<Payment> {
    const prismaPayment = await this.prisma.payment.create({
      data: {
        orderId: paymentData.orderId,
        amount: paymentData.amount.amount,
        currency: paymentData.currency,
        status: paymentData.status,
        provider: paymentData.provider,
        providerId: paymentData.providerId,
        providerData: paymentData.providerData,
        failureReason: paymentData.failureReason,
      },
    });

    return this.mapPrismaPaymentToPayment(prismaPayment);
  }

  async existsByOrderNumber(orderNumber: string): Promise<boolean> {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true },
    });

    return !!order;
  }

  private mapPrismaOrderToOrder(prismaOrder: any): Order {
    return {
      id: prismaOrder.id,
      orderNumber: prismaOrder.orderNumber,
      status: prismaOrder.status as OrderStatus,
      currency: prismaOrder.currency,
      subtotal: new Money(Number(prismaOrder.subtotal), prismaOrder.currency),
      tax: new Money(Number(prismaOrder.tax), prismaOrder.currency),
      shipping: new Money(Number(prismaOrder.shipping), prismaOrder.currency),
      discount: new Money(Number(prismaOrder.discount), prismaOrder.currency),
      total: new Money(Number(prismaOrder.total), prismaOrder.currency),
      notes: prismaOrder.notes,
      shippingName: prismaOrder.shippingName,
      shippingEmail: prismaOrder.shippingEmail,
      shippingPhone: prismaOrder.shippingPhone,
      shippingAddress: prismaOrder.shippingAddress,
      billingAddress: prismaOrder.billingAddress,
      userId: prismaOrder.userId,
      user: prismaOrder.user,
      items: prismaOrder.items?.map((item: any) =>
        this.mapPrismaOrderItemToOrderItem(item),
      ),
      payment: prismaOrder.payment
        ? this.mapPrismaPaymentToPayment(prismaOrder.payment)
        : undefined,
      createdAt: prismaOrder.createdAt,
      updatedAt: prismaOrder.updatedAt,
    };
  }

  private mapPrismaOrderItemToOrderItem(prismaItem: any): OrderItem {
    return {
      id: prismaItem.id,
      quantity: prismaItem.quantity,
      price: new Money(Number(prismaItem.price), 'COP'),
      orderId: prismaItem.orderId,
      order: prismaItem.order,
      productId: prismaItem.productId,
      product: prismaItem.product,
    };
  }

  private mapPrismaPaymentToPayment(prismaPayment: any): Payment {
    return {
      id: prismaPayment.id,
      orderId: prismaPayment.orderId,
      order: prismaPayment.order,
      amount: new Money(Number(prismaPayment.amount), prismaPayment.currency),
      currency: prismaPayment.currency,
      status: prismaPayment.status as PaymentStatus,
      provider: prismaPayment.provider,
      providerId: prismaPayment.providerId,
      providerData: prismaPayment.providerData,
      failureReason: prismaPayment.failureReason,
      createdAt: prismaPayment.createdAt,
      updatedAt: prismaPayment.updatedAt,
    };
  }
}
