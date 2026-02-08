import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsRepository } from './payments.repository';
import { OrdersRepository } from '../orders/orders.repository';
import { PaymentStatus, OrderStatus, Role } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private paymentsRepository: PaymentsRepository,
    private ordersRepository: OrdersRepository,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    });
  }

  async createCheckoutSession(orderId: string, userId: string, userRole: Role) {
    // Get order
    const order = await this.ordersRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user owns the order or is admin
    if (userRole !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Check if order is pending
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not pending');
    }

    // Check if payment already exists
    const existingPayment = await this.paymentsRepository.findByOrderId(orderId);
    if (existingPayment && existingPayment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Order already paid');
    }

    // Create Stripe checkout session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: item.product.category,
          },
          unit_amount: Math.round(Number(item.priceAtPurchase) * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${this.configService.get<string>('FRONTEND_URL')}/orders/${orderId}/success`,
      cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/orders/${orderId}/cancel`,
      metadata: {
        orderId,
      },
    });

    // Create or update payment record
    const payment = existingPayment
      ? await this.paymentsRepository.updateStatus(existingPayment.id, PaymentStatus.PENDING)
      : await this.paymentsRepository.create({
          orderId,
          stripeSessionId: session.id,
          amount: Number(order.total),
        });

    return {
      sessionId: session.id,
      url: session.url,
      paymentId: payment.id,
    };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
      );
    } catch (error) {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleSuccessfulPayment(session);
        break;
      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        await this.handleExpiredPayment(expiredSession);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  private async handleSuccessfulPayment(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;
    if (!orderId) return;

    const payment = await this.paymentsRepository.findByStripeSessionId(session.id);
    if (!payment) return;

    // Update payment status
    await this.paymentsRepository.updateStatus(payment.id, PaymentStatus.SUCCESS);

    // Update order status
    await this.ordersRepository.updateStatus(orderId, OrderStatus.PAID);
  }

  private async handleExpiredPayment(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;
    if (!orderId) return;

    const payment = await this.paymentsRepository.findByStripeSessionId(session.id);
    if (!payment) return;

    // Update payment status
    await this.paymentsRepository.updateStatus(payment.id, PaymentStatus.FAILED);
  }

  async getPaymentStats(userRole: Role) {
    // Only admins can get payment stats
    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return this.paymentsRepository.getPaymentStats();
  }
}
