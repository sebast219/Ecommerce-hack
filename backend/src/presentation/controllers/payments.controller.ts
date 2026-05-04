// 💳 PAYMENTS CONTROLLER - Endpoints de procesamiento de pagos
// PROPÓSITO: Exponer API REST para integración con Stripe

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { StripeService } from '../../infrastructure/services/stripe.service';
import {
  CreatePaymentIntentDto,
  CreateCustomerDto,
} from '../../infrastructure/services/stripe.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  @ApiOperation({ summary: 'Crear intención de pago' })
  @ApiResponse({
    status: 200,
    description: 'Intención de pago creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createPaymentIntent(@Body() paymentData: CreatePaymentIntentDto) {
    try {
      const paymentIntent =
        await this.stripeService.createPaymentIntent(paymentData);

      return {
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
        },
        message: 'Payment intent created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating payment intent:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('create-customer')
  @ApiOperation({ summary: 'Crear cliente en Stripe' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  async createCustomer(@Body() customerData: CreateCustomerDto) {
    try {
      const customer = await this.stripeService.createCustomer(customerData);

      return {
        success: true,
        data: {
          customerId: customer.id,
          email: customer.email,
          name: customer.name,
        },
        message: 'Customer created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating customer:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('checkout-session')
  @ApiOperation({ summary: 'Crear sesión de checkout' })
  @ApiResponse({ status: 200, description: 'Sesión de checkout creada' })
  async createCheckoutSession(
    @Body()
    checkoutData: {
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
    },
  ) {
    try {
      const session =
        await this.stripeService.createCheckoutSession(checkoutData);

      return {
        success: true,
        data: {
          sessionId: session.id,
          url: session.url,
          paymentStatus: session.payment_status,
        },
        message: 'Checkout session created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating checkout session:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('payment-intent/:id')
  @ApiOperation({ summary: 'Obtener intención de pago por ID' })
  @ApiResponse({ status: 200, description: 'Intención de pago encontrada' })
  async getPaymentIntent(@Param('id') paymentIntentId: string) {
    try {
      const paymentIntent =
        await this.stripeService.getPaymentIntent(paymentIntentId);

      return {
        success: true,
        data: paymentIntent,
        message: 'Payment intent retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Error retrieving payment intent:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('confirm-payment/:id')
  @ApiOperation({ summary: 'Confirmar pago' })
  @ApiResponse({ status: 200, description: 'Pago confirmado' })
  async confirmPayment(@Param('id') paymentIntentId: string) {
    try {
      const paymentIntent =
        await this.stripeService.confirmPayment(paymentIntentId);

      return {
        success: true,
        data: paymentIntent,
        message: 'Payment confirmed successfully',
      };
    } catch (error) {
      this.logger.error('Error confirming payment:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('refund')
  @ApiOperation({ summary: 'Procesar reembolso' })
  @ApiResponse({ status: 200, description: 'Reembolso procesado' })
  async createRefund(
    @Body() refundData: { paymentIntentId: string; amount?: number },
  ) {
    try {
      const refund = await this.stripeService.createRefund(
        refundData.paymentIntentId,
        refundData.amount,
      );

      return {
        success: true,
        data: refund,
        message: 'Refund processed successfully',
      };
    } catch (error) {
      this.logger.error('Error creating refund:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('customer/:id')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  async getCustomer(@Param('id') customerId: string) {
    try {
      const customer = await this.stripeService.getCustomer(customerId);

      return {
        success: true,
        data: customer,
        message: 'Customer retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Error retrieving customer:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de Stripe' })
  @ApiHeader({ name: 'stripe-signature', description: 'Firma del webhook' })
  @ApiResponse({ status: 200, description: 'Webhook procesado' })
  async handleWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
    @Body() body: any,
  ) {
    try {
      const event = await this.stripeService.handleWebhook(
        Buffer.from(JSON.stringify(body)),
        signature,
      );

      // Procesar diferentes tipos de eventos
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error('Webhook error:', error);
      throw new BadRequestException('Webhook signature verification failed');
    }
  }

  private async handlePaymentSucceeded(paymentIntent: any) {
    this.logger.log(`Payment succeeded: ${paymentIntent.id}`);
    // Aquí puedes actualizar el estado del pedido en tu base de datos
    // Ejemplo: await this.ordersService.updateStatus(paymentIntent.metadata.orderId, 'PAID');
  }

  private async handlePaymentFailed(paymentIntent: any) {
    this.logger.log(`Payment failed: ${paymentIntent.id}`);
    // Aquí puedes manejar el fallo del pago
    // Ejemplo: await this.ordersService.updateStatus(paymentIntent.metadata.orderId, 'PAYMENT_FAILED');
  }

  private async handleCheckoutCompleted(checkoutSession: any) {
    this.logger.log(`Checkout completed: ${checkoutSession.id}`);
    // Aquí puedes procesar la compra completada
    // Ejemplo: await this.ordersService.createOrderFromCheckout(checkoutSession);
  }
}
