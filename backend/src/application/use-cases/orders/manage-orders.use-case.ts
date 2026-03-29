// 🏗️ APPLICATION USE CASES - Gestión de Órdenes
// PROPÓSITO: Casos de uso para creación y gestión de órdenes

import { Order, OrderStatus, PaymentStatus } from '../../../domain/entities/order.entity';
import { Money } from '../../../domain/entities/user.entity';
import { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { ICartRepository } from '../../../domain/repositories/cart.repository.interface';
import { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../../domain/repositories/order.repository.interface';
import { CART_REPOSITORY } from '../../../domain/repositories/cart.repository.interface';
import { PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository.interface';

export interface CreateOrderRequest {
  userId: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    apartment?: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    apartment?: string;
  };
  notes?: string;
  paymentMethod: string;
}

export interface CreateOrderResponse {
  order: Order;
  message: string;
}

export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const {
      userId,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      billingAddress,
      notes,
      paymentMethod,
    } = request;

    // Obtener carrito del usuario
    const cart = await this.cartRepository.findCartWithItemsByUserId(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calcular totales
    let subtotal = 0;
    const orderItems: { productId: string; quantity: number; price: number }[] = [];

    for (const cartItem of cart.items) {
      const product = await this.productRepository.findById(cartItem.productId);
      if (!product) {
        throw new Error(`Product ${cartItem.productId} not found`);
      }
      if (!product.isActive) {
        throw new Error(`Product ${product.name} is not available`);
      }

      // Verificar stock
      const hasStock = await this.productRepository.checkStock(
        cartItem.productId,
        cartItem.quantity,
      );
      if (!hasStock) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const price = typeof product.price === 'object' && 'amount' in product.price
        ? product.price.amount
        : Number(product.price);
      subtotal += price * cartItem.quantity;

      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price,
      });
    }

    // Calcular impuestos y envío
    const tax = subtotal * 0.19; // 19% IVA Colombia
    const shipping = subtotal > 500000 ? 0 : 15000; // Envío gratis > $500.000 COP
    const discount = 0;
    const total = subtotal + tax + shipping - discount;

    // Generar número de orden
    const orderNumber = await this.orderRepository.generateOrderNumber();

    // Crear la orden
    const order = await this.orderRepository.create({
      orderNumber,
      userId,
      status: OrderStatus.PENDING,
      currency: 'COP',
      subtotal: new Money(subtotal, 'COP'),
      tax: new Money(tax, 'COP'),
      shipping: new Money(shipping, 'COP'),
      discount: new Money(discount, 'COP'),
      total: new Money(total, 'COP'),
      notes,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        apartment: shippingAddress.apartment,
      },
      billingAddress: billingAddress
        ? {
            street: billingAddress.street,
            city: billingAddress.city,
            state: billingAddress.state,
            postalCode: billingAddress.postalCode,
            country: billingAddress.country,
            apartment: billingAddress.apartment,
          }
        : undefined,
      items: [],
    });

    // Crear los items de la orden
    for (const item of orderItems) {
      await this.orderRepository.createOrderItem({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: new Money(item.price, 'COP'),
      });
    }

    // Crear el pago pendiente
    await this.orderRepository.createPayment({
      orderId: order.id,
      amount: new Money(total, 'COP'),
      currency: 'COP',
      status: PaymentStatus.PENDING,
      provider: paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Limpiar el carrito
    await this.cartRepository.clearCart(cart.id);

    // Obtener la orden completa con items
    const completeOrder = await this.orderRepository.findWithItems(order.id);

    return {
      order: completeOrder!,
      message: 'Order created successfully',
    };
  }
}

export interface GetUserOrdersRequest {
  userId: string;
  page?: number;
  limit?: number;
}

export interface GetUserOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export class GetUserOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(request: GetUserOrdersRequest): Promise<GetUserOrdersResponse> {
    const { userId } = request;

    const orders = await this.orderRepository.findByUserId(userId);

    return {
      orders,
      total: orders.length,
      page: 1,
      limit: orders.length,
    };
  }
}

export interface GetOrderRequest {
  orderId: string;
  userId: string;
}

export interface GetOrderResponse {
  order: Order | null;
}

export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(request: GetOrderRequest): Promise<GetOrderResponse> {
    const { orderId, userId } = request;

    const order = await this.orderRepository.findById(orderId);

    if (!order || order.userId !== userId) {
      return { order: null };
    }

    return { order };
  }
}
