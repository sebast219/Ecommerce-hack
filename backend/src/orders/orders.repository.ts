import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async create(orderData: {
    userId: string;
    total: number;
    items: Array<{
      productId: string;
      quantity: number;
      priceAtPurchase: number;
    }>;
  }): Promise<Order> {
    return this.prisma.order.create({
      data: {
        userId: orderData.userId,
        total: orderData.total,
        items: {
          create: orderData.items,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                category: true,
                imageUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
          },
        },
        payment: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                category: true,
                imageUrl: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAll(limit = 20, offset = 0): Promise<Order[]> {
    return this.prisma.order.findMany({
      take: limit,
      skip: offset,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
          },
        },
        payment: true,
      },
    });
  }

  async getOrderStats() {
    const [total, pending, paid, shipped] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.PAID } }),
      this.prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
    ]);

    return {
      total,
      pending,
      paid,
      shipped,
    };
  }
}
