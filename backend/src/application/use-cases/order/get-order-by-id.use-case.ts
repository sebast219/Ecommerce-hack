import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(orderId: string, userId: string, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, images: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // IDOR prevention: solo el dueño o admin pueden ver
    if (order.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    return {
      ...order,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      shipping: Number(order.shipping),
      items: order.items.map((i) => ({
        ...i,
        price: Number(i.price),
      })),
    };
  }
}
