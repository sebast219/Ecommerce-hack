import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { StripeResilientService } from '../../../infrastructure/payments/stripe-resilient.service';
import { OrderStateMachineService } from '../../services/order-state-machine.service';
import { OrderEmailService } from '../../services/order-email.service';
import { OrderStatus } from '../../../domain/enums/order-status.enum';

@Injectable()
export class HandleStripeWebhookUseCase {
  private readonly logger = new Logger(HandleStripeWebhookUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeResilientService,
    private readonly stateMachine: OrderStateMachineService,
    private readonly orderEmail: OrderEmailService,
  ) {}

  async execute(
    rawBody: Buffer,
    signature: string,
  ): Promise<{ received: boolean }> {
    // 1. VERIFICAR FIRMA
    let event;
    try {
      event = await this.stripe.handleWebhook(rawBody, signature);
    } catch (error: any) {
      this.logger.error(
        `Webhook signature verification failed: ${error.message}`,
      );
      throw new BadRequestException(`Webhook Error: ${error.message}`);
    }

    // 2. IDEMPOTENCY: ¿ya procesamos este evento?
    // En SQLite, metadata es un string JSON, buscamos por contenido
    const existing = await this.prisma.orderEvent.findFirst({
      where: {
        metadata: {
          contains: `"stripeEventId":"${event.id}"`,
        },
      },
    });

    if (existing) {
      this.logger.log(
        `Stripe event ${event.id} already processed (idempotent)`,
      );
      return { received: true };
    }

    this.logger.log(`Processing Stripe event: ${event.type} (${event.id})`);

    // 3. ROUTING POR TIPO DE EVENTO
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event);
        break;

      case 'charge.refunded':
        await this.handleRefund(event);
        break;

      default:
        this.logger.debug(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private async handlePaymentSucceeded(event: any) {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      this.logger.warn(
        `Payment succeeded but no orderId in metadata: ${paymentIntent.id}`,
      );
      return;
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      this.logger.error(
        `Order ${orderId} not found for payment ${paymentIntent.id}`,
      );
      return;
    }

    // IDEMPOTENCY: Si ya está PAID, no reprocesar
    if (order.status === OrderStatus.PAID) {
      this.logger.log(`Order ${order.orderNumber} already PAID - skipping`);
      return;
    }

    // 1. Transicionar a PAID
    await this.stateMachine.transition({
      orderId,
      toStatus: OrderStatus.PAID,
      triggeredBy: 'stripe',
      description: 'Payment confirmed by Stripe',
      metadata: {
        stripeEventId: event.id,
        stripePaymentIntentId: paymentIntent.id,
        amountPaid: paymentIntent.amount / 100,
        chargeId: paymentIntent.latest_charge,
      },
    });

    // 2. Guardar charge ID
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        stripeChargeId: paymentIntent.latest_charge,
      },
    });

    this.logger.log(`Order ${order.orderNumber} marked as PAID`);

    // 3. Trigger email de confirmación (no bloqueante)
    this.orderEmail.sendOrderConfirmation(orderId).catch((error) => {
      this.logger.error(
        `Failed to send confirmation email for order ${orderId}: ${error.message}`,
      );
    });
  }

  private async handlePaymentFailed(event: any) {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) return;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.status !== OrderStatus.AWAITING_PAYMENT) return;

    // Restaurar inventario
    await this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.productInventory.update({
          where: { productId: item.productId },
          data: { quantity: { increment: item.quantity } },
        });
      }
    });

    // Transicionar
    await this.stateMachine.transition({
      orderId,
      toStatus: OrderStatus.PAYMENT_FAILED,
      triggeredBy: 'stripe',
      description: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown reason'}`,
      metadata: {
        stripeEventId: event.id,
        errorCode: paymentIntent.last_payment_error?.code,
        errorMessage: paymentIntent.last_payment_error?.message,
      },
    });

    this.logger.warn(`Payment failed for order ${order.orderNumber}`);
  }

  private async handleRefund(event: any) {
    const charge = event.data.object;
    const order = await this.prisma.order.findFirst({
      where: { stripeChargeId: charge.id },
    });

    if (!order) return;

    await this.stateMachine.transition({
      orderId: order.id,
      toStatus: OrderStatus.REFUNDED,
      triggeredBy: 'stripe',
      description: 'Order refunded',
      metadata: {
        stripeEventId: event.id,
        refundAmount: charge.amount_refunded / 100,
      },
    });

    this.logger.log(`Order ${order.orderNumber} REFUNDED`);
  }
}
