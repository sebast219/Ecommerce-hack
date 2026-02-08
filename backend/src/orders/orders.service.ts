import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { ProductsRepository } from '../products/products.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Role } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private ordersRepository: OrdersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    // Validate items and calculate total
    const itemsWithPrices = [];
    let total = 0;

    for (const item of createOrderDto.items) {
      const product = await this.productsRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      const itemTotal = Number(product.price) * item.quantity;
      total += itemTotal;

      itemsWithPrices.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: Number(product.price),
      });
    }

    // Create order with transaction to update stock
    const order = await this.ordersRepository.create({
      userId,
      total,
      items: itemsWithPrices,
    });

    // Update product stock
    for (const item of createOrderDto.items) {
      await this.productsRepository.updateStock(item.productId, -item.quantity);
    }

    return order;
  }

  async findById(id: string, userId?: string, userRole?: Role) {
    const order = await this.ordersRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Users can only see their own orders, admins can see all
    if (userRole !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async findByUserId(userId: string) {
    return this.ordersRepository.findByUserId(userId);
  }

  async findAll(userRole: Role, limit = 20, offset = 0) {
    // Only admins can see all orders
    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return this.ordersRepository.findAll(limit, offset);
  }

  async updateStatus(id: string, status: OrderStatus, userRole: Role) {
    // Only admins can update order status
    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    // Check if order exists
    await this.findById(id, undefined, userRole);

    return this.ordersRepository.updateStatus(id, status);
  }

  async cancelOrder(id: string, userId: string, userRole: Role) {
    const order = await this.findById(id, userId, userRole);

    // Only pending orders can be cancelled
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    // Restore stock
    for (const item of order.items) {
      await this.productsRepository.updateStock(item.productId, item.quantity);
    }

    return this.ordersRepository.updateStatus(id, OrderStatus.CANCELLED);
  }

  async getOrderStats(userRole: Role) {
    // Only admins can get order stats
    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return this.ordersRepository.getOrderStats();
  }
}
