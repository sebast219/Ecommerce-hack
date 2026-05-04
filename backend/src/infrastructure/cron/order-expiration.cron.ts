import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma.service';
import { OrderStateMachineService } from '../../application/services/order-state-machine.service';
import { OrderStatus } from '../../domain/enums/order-status.enum';

@Injectable()
export class OrderExpirationCron {
  private readonly logger = new Logger(OrderExpirationCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stateMachine: OrderStateMachineService,
  ) {}

  /**
   * Cada 15 minutos: marcar órdenes PENDING/AWAITING_PAYMENT viejas como EXPIRED
   * y restaurar el inventario.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleExpiredOrders() {
    const expiredThreshold = new Date(Date.now() - 30 * 60 * 1000); // 30 min ago

    const expiredOrders = await this.prisma.order.findMany({
      where: {
        status: { in: [OrderStatus.PENDING, OrderStatus.AWAITING_PAYMENT] },
        createdAt: { lt: expiredThreshold },
      },
      include: { items: true },
    });

    if (expiredOrders.length === 0) return;

    this.logger.log(`Expiring ${expiredOrders.length} stale orders`);

    for (const order of expiredOrders) {
      try {
        // Restaurar inventario
        await this.prisma.$transaction(async (tx) => {
          for (const item of order.items) {
            await tx.productInventory.update({
              where: { productId: item.productId },
              data: { quantity: { increment: item.quantity } },
            });
          }
        });

        // Transicionar a EXPIRED
        await this.stateMachine.transition({
          orderId: order.id,
          toStatus: OrderStatus.EXPIRED,
          triggeredBy: 'system_cron',
          description: 'Order expired without payment',
        });
      } catch (error: any) {
        this.logger.error(`Failed to expire order ${order.orderNumber}: ${error.message}`);
      }
    }
  }
}
