import { Injectable, Logger } from '@nestjs/common';
import * as Stripe from 'stripe';

@Injectable()
export class StripeResilientService {
  private readonly logger = new Logger(StripeResilientService.name);
  private readonly stripe: any;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

    this.stripe = new Stripe(secretKey, {
      typescript: true,
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>,
  ) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      this.logger.log(
        `Payment intent created: ${paymentIntent.id} for $${amount}`,
      );
      return paymentIntent;
    } catch (error: any) {
      this.logger.error(`Failed to create payment intent: ${error.message}`);
      throw error;
    }
  }

  async confirmPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error: any) {
      this.logger.error(
        `Failed to retrieve payment intent ${paymentIntentId}: ${error.message}`,
      );
      throw error;
    }
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
      return event;
    } catch (error: any) {
      this.logger.error(
        `Webhook signature verification failed: ${error.message}`,
      );
      throw error;
    }
  }
}
