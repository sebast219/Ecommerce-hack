import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { StripeResilientService } from '../../../infrastructure/payments/stripe-resilient.service';

@Injectable()
export class CreatePaymentIntentUseCase {
  private readonly logger = new Logger(CreatePaymentIntentUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeResilientService,
  ) {}

  async execute(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot create payment for order in status: ${order.status}`,
      );
    }

    // Si ya tiene paymentIntent, devolver el existente
    if (order.stripePaymentId) {
      const existing = await this.stripe.confirmPaymentIntent(
        order.stripePaymentId,
      );
      if (existing.status !== 'succeeded' && existing.status !== 'canceled') {
        return {
          clientSecret: existing.client_secret,
          paymentIntentId: existing.id,
          amount: Number(order.total),
        };
      }
    }

    // Crear nuevo Payment Intent
    const paymentIntent = await this.stripe.createPaymentIntent(
      Number(order.total),
      'usd',
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId,
      },
    );

    // Guardar el ID en la orden
    await this.prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentId: paymentIntent.id },
    });

    this.logger.log(`Payment intent created for order ${order.orderNumber}`);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: Number(order.total),
    };
  }
}
