import { Injectable, Logger } from '@nestjs/common';
import * as Stripe from 'stripe';

@Injectable()
export class StripeResilientService {
  private readonly logger = new Logger(StripeResilientService.name);
  private readonly stripe: any;
  private readonly isDemoMode: boolean;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    this.isDemoMode = !secretKey || secretKey === 'sk_test_placeholder';

    if (this.isDemoMode) {
      this.logger.warn('⚠️ Stripe no configurado - usando modo demo');
      this.stripe = null;
    } else {
      this.stripe = new Stripe(secretKey, {
        typescript: true,
      });
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>,
  ) {
    if (this.isDemoMode) {
      // Modo demo - respuesta simulada
      const demoId = `pi_demo_${Date.now()}`;
      this.logger.log(`Demo payment intent created: ${demoId} for $${amount}`);
      return {
        id: demoId,
        client_secret: `${demoId}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(amount * 100),
        currency,
        status: 'requires_payment_method',
      };
    }

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
    if (this.isDemoMode) {
      // Modo demo - respuesta simulada
      this.logger.log(`Demo payment intent confirmed: ${paymentIntentId}`);
      return {
        id: paymentIntentId,
        status: 'succeeded',
        client_secret: `${paymentIntentId}_secret_demo`,
      };
    }

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
