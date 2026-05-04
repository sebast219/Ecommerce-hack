import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class CancelOrderUseCase {
  private readonly logger = new Logger(CancelOrderUseCase.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(orderId: string, userId: string, userRole: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Solo dueño o admin
      if (order.userId !== userId && userRole !== 'ADMIN') {
        throw new ForbiddenException('Access denied');
      }

      // Solo se pueden cancelar pendientes o pagadas (antes de envío)
      if (!['PENDING', 'PAID'].includes(order.status)) {
        throw new BadRequestException(
          `Cannot cancel order in status: ${order.status}`,
        );
      }

      // RESTAURAR INVENTARIO
      for (const item of order.items) {
        await tx.productInventory.update({
          where: { productId: item.productId },
          data: { quantity: { increment: item.quantity } },
        });
      }

      // Actualizar estado
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });

      this.logger.log(`Order ${order.orderNumber} cancelled by user ${userId}`);

      return { ...updated, total: Number(updated.total) };
    });
  }
}
