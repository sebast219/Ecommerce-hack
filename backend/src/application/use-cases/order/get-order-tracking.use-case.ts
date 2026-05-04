import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class GetOrderTrackingUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(orderId: string, userId: string, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        events: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            type: true,
            description: true,
            fromStatus: true,
            toStatus: true,
            createdAt: true,
            triggeredBy: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // IDOR prevention
    if (order.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    return {
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: Number(order.total),
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        trackingNumber: order.trackingNumber,
        trackingCarrier: order.trackingCarrier,
        estimatedDelivery: order.estimatedDelivery,
      },
      timeline: order.events.map((e) => ({
        id: e.id,
        type: e.type,
        description: e.description,
        timestamp: e.createdAt,
        actor: e.triggeredBy,
      })),
      currentStep: this.getCurrentStep(order.status),
    };
  }

  private getCurrentStep(status: string): {
    step: number;
    totalSteps: number;
    label: string;
  } {
    const steps: Record<string, { step: number; label: string }> = {
      PENDING: { step: 1, label: 'Order Created' },
      AWAITING_PAYMENT: { step: 2, label: 'Awaiting Payment' },
      PAID: { step: 3, label: 'Payment Received' },
      PROCESSING: { step: 4, label: 'Preparing Order' },
      SHIPPED: { step: 5, label: 'Shipped' },
      DELIVERED: { step: 6, label: 'Delivered' },
      CANCELLED: { step: 0, label: 'Cancelled' },
      REFUNDED: { step: 0, label: 'Refunded' },
      EXPIRED: { step: 0, label: 'Expired' },
      PAYMENT_FAILED: { step: 0, label: 'Payment Failed' },
    };

    const current = steps[status] || { step: 0, label: status };

    return {
      step: current.step,
      totalSteps: 6,
      label: current.label,
    };
  }
}
