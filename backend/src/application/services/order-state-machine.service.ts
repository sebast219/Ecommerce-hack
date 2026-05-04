import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { OrderStatus, canTransition } from '../../domain/enums/order-status.enum';

export interface TransitionParams {
  orderId: string;
  toStatus: OrderStatus;
  triggeredBy?: string;
  description?: string;
  metadata?: any;
}

@Injectable()
export class OrderStateMachineService {
  private readonly logger = new Logger(OrderStateMachineService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Transiciona una orden a un nuevo estado de forma SEGURA.
   * - Valida la transición según el state machine
   * - Crea un OrderEvent para tracking
   * - Actualiza timestamps importantes (paidAt, shippedAt, etc.)
   * - Todo en una transacción
   */
  async transition(params: TransitionParams) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: params.orderId },
      });

      if (!order) {
        throw new BadRequestException('Order not found');
      }

      const fromStatus = order.status as OrderStatus;
      const toStatus = params.toStatus;

      // Validar transición
      if (!canTransition(fromStatus, toStatus)) {
        throw new BadRequestException(
          `Invalid transition: ${fromStatus} -> ${toStatus}`,
        );
      }

      // Preparar campos a actualizar según estado
      const updateData: any = {
        status: toStatus,
      };

      // Actualizar timestamps según estado
      switch (toStatus) {
        case OrderStatus.PAID:
          updateData.paidAt = new Date();
          break;
        case OrderStatus.SHIPPED:
          updateData.shippedAt = new Date();
          break;
        case OrderStatus.DELIVERED:
          updateData.deliveredAt = new Date();
          break;
        case OrderStatus.CANCELLED:
          updateData.cancelledAt = new Date();
          break;
      }

      // Actualizar la orden
      const updated = await tx.order.update({
        where: { id: params.orderId },
        data: updateData,
      });

      // Crear evento de tracking
      await tx.orderEvent.create({
        data: {
          orderId: params.orderId,
          type: this.getEventType(fromStatus, toStatus),
          fromStatus,
          toStatus,
          description: params.description || this.getDefaultDescription(toStatus),
          triggeredBy: params.triggeredBy || 'system',
          metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        },
      });

      this.logger.log(
        `Order ${order.orderNumber}: ${fromStatus} -> ${toStatus} (by ${params.triggeredBy || 'system'})`,
      );

      return updated;
    });
  }

  private getEventType(from: OrderStatus, to: OrderStatus): string {
    const transitionMap: Record<string, string> = {
      [`${OrderStatus.PENDING}->${OrderStatus.AWAITING_PAYMENT}`]: 'PAYMENT_INITIATED',
      [`${OrderStatus.AWAITING_PAYMENT}->${OrderStatus.PAID}`]: 'PAYMENT_RECEIVED',
      [`${OrderStatus.AWAITING_PAYMENT}->${OrderStatus.PAYMENT_FAILED}`]: 'PAYMENT_FAILED',
      [`${OrderStatus.PAID}->${OrderStatus.PROCESSING}`]: 'ORDER_PROCESSING',
      [`${OrderStatus.PROCESSING}->${OrderStatus.SHIPPED}`]: 'ORDER_SHIPPED',
      [`${OrderStatus.SHIPPED}->${OrderStatus.DELIVERED}`]: 'ORDER_DELIVERED',
    };

    return transitionMap[`${from}->${to}`] || `STATUS_CHANGED_TO_${to}`;
  }

  private getDefaultDescription(status: OrderStatus): string {
    const descriptions: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Order created, waiting for payment',
      [OrderStatus.AWAITING_PAYMENT]: 'Payment process initiated',
      [OrderStatus.PAID]: 'Payment received successfully',
      [OrderStatus.PAYMENT_FAILED]: 'Payment failed',
      [OrderStatus.PROCESSING]: 'Order is being prepared',
      [OrderStatus.SHIPPED]: 'Order has been shipped',
      [OrderStatus.DELIVERED]: 'Order delivered',
      [OrderStatus.CANCELLED]: 'Order cancelled',
      [OrderStatus.REFUNDED]: 'Order refunded',
      [OrderStatus.EXPIRED]: 'Order expired without payment',
    };

    return descriptions[status] || `Status changed to ${status}`;
  }
}
