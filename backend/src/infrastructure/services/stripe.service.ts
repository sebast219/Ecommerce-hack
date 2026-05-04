// 💳 STRIPE SERVICE - Integración con API externa de pagos
// PROPÓSITO: Implementar procesamiento de pagos con Stripe enterprise-ready

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Stripe from 'stripe';

export interface CreatePaymentIntentDto {
  amount: number;
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
  orderId?: string;
}

export interface CreateCustomerDto {
  email: string;
  name: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

@Injectable()
export class StripeService {
  private readonly stripe: any;
  private readonly logger = new Logger(StripeService.name);

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    // Temporalmente deshabilitado para demostración
    if (!stripeSecretKey) {
      console.log('⚠️ Stripe no configurado - usando modo demo');
      this.stripe = null;
      return;
    }

    this.stripe = new Stripe(stripeSecretKey);
  }

  // Crear intención de pago
  async createPaymentIntent(paymentData: CreatePaymentIntentDto): Promise<any> {
    if (!this.stripe) {
      // Modo demo - respuesta simulada
      return {
        id: `pi_demo_${Date.now()}`,
        client_secret: `pi_demo_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(paymentData.amount * 100),
        currency: paymentData.currency || 'usd',
        status: 'requires_payment_method',
      };
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(paymentData.amount * 100), // Convertir a centavos
        currency: paymentData.currency || 'usd',
        customer: paymentData.customerId,
        metadata: {
          ...paymentData.metadata,
          orderId: paymentData.orderId,
          source: 'ecommerce-hak6',
        },
        automatic_payment_methods: {
          enabled: true,
        },
        payment_method_types: ['card'],
        setup_future_usage: 'off_session',
      });

      this.logger.log(`Payment intent created: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error('Error creating payment intent:', error);
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  // Crear cliente
  async createCustomer(customerData: CreateCustomerDto): Promise<any> {
    try {
      const customer = await this.stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        metadata: {
          source: 'ecommerce-hak6',
          createdAt: new Date().toISOString(),
        },
      });

      this.logger.log(`Customer created: ${customer.id}`);
      return customer;
    } catch (error) {
      this.logger.error('Error creating customer:', error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  // Confirmar pago
  async confirmPayment(paymentIntentId: string): Promise<any> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.confirm(paymentIntentId);

      this.logger.log(`Payment confirmed: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error('Error confirming payment:', error);
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }

  // Obtener intención de pago
  async getPaymentIntent(paymentIntentId: string): Promise<any> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      this.logger.error('Error retrieving payment intent:', error);
      throw new Error(`Failed to retrieve payment intent: ${error.message}`);
    }
  }

  // Crear sesión de checkout para pago único
  async createCheckoutSession(params: {
    customerId?: string;
    items: Array<{
      name: string;
      amount: number;
      quantity: number;
      description?: string;
      images?: string[];
    }>;
    successUrl: string;
    cancelUrl: string;
    orderId?: string;
  }): Promise<any> {
    if (!this.stripe) {
      // Modo demo - respuesta simulada
      return {
        id: `cs_demo_${Date.now()}`,
        url: `${params.successUrl}?session_id=demo_${Date.now()}`,
        payment_status: 'unpaid',
      };
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        customer: params.customerId,
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: params.items.map((item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              description: item.description,
              images: item.images,
            },
            unit_amount: Math.round(item.amount * 100),
          },
          quantity: item.quantity,
        })),
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: {
          orderId: params.orderId,
          source: 'ecommerce-hak6',
        },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'MX', 'ES', 'CO', 'PE', 'AR', 'CL'],
        },
        billing_address_collection: 'required',
      });

      this.logger.log(`Checkout session created: ${session.id}`);
      return session;
    } catch (error) {
      this.logger.error('Error creating checkout session:', error);
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }

  // Procesar reembolso
  async createRefund(paymentIntentId: string, amount?: number): Promise<any> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: 'requested_by_customer',
      });

      this.logger.log(`Refund created: ${refund.id}`);
      return refund;
    } catch (error) {
      this.logger.error('Error creating refund:', error);
      throw new Error(`Failed to create refund: ${error.message}`);
    }
  }

  // Webhook handler para eventos de Stripe
  async handleWebhook(rawBody: Buffer, signature: string): Promise<any> {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is required');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );

      this.logger.log(`Webhook event received: ${event.type}`);
      return event;
    } catch (error) {
      this.logger.error('Webhook signature verification failed:', error);
      throw new Error(`Invalid webhook signature: ${error.message}`);
    }
  }

  // Obtener cliente por ID
  async getCustomer(customerId: string): Promise<any> {
    try {
      return await this.stripe.customers.retrieve(customerId);
    } catch (error) {
      this.logger.error('Error retrieving customer:', error);
      throw new Error(`Failed to retrieve customer: ${error.message}`);
    }
  }

  // Actualizar cliente
  async updateCustomer(
    customerId: string,
    updateData: Partial<CreateCustomerDto>,
  ): Promise<any> {
    try {
      return await this.stripe.customers.update(customerId, updateData);
    } catch (error) {
      this.logger.error('Error updating customer:', error);
      throw new Error(`Failed to update customer: ${error.message}`);
    }
  }
}
