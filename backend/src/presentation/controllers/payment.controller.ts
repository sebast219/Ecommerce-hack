import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
  RawBodyRequest,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { CreatePaymentIntentUseCase } from '../../application/use-cases/payment/create-payment-intent.use-case';
import { HandleStripeWebhookUseCase } from '../../application/use-cases/payment/handle-stripe-webhook.use-case';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly createPaymentIntent: CreatePaymentIntentUseCase,
    private readonly handleWebhook: HandleStripeWebhookUseCase,
  ) {}

  @Post('orders/:orderId/intent')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe Payment Intent for order' })
  @UseGuards(AuthGuard('jwt'))
  async createIntent(@Req() req: any, @Param('orderId') orderId: string) {
    const result = await this.createPaymentIntent.execute(orderId, req.user.id);
    return { success: true, data: result };
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint (no auth)' })
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    return this.handleWebhook.execute(req.rawBody, signature);
  }
}
