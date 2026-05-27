// 💳 MOCK PAYMENT SERVICE - Simulación de pagos para demo
// PROPÓSITO: Procesar pagos simulados sin Stripe para demostración

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MockPaymentDto {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvc: string;
  amount: number;
  orderId: string;
  userId: string;
}

export interface MockPaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  message: string;
}

@Injectable()
export class MockPaymentService {
  private readonly logger = new Logger(MockPaymentService.name);

  constructor(private configService: ConfigService) {}

  // Validar tarjeta de demo (acepta cualquier tarjeta con formato válido)
  private validateCard(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    // Acepta cualquier número de 13-19 dígitos para demo
    return /^\d{13,19}$/.test(cleaned);
  }

  // Validar fecha de expiración
  private validateExpiry(expiry: string): boolean {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(`20${match[2]}`, 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) return false;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  }

  // Validar CVC
  private validateCVC(cvc: string): boolean {
    return /^\d{3,4}$/.test(cvc);
  }

  // Procesar pago simulado
  async processPayment(paymentData: MockPaymentDto): Promise<MockPaymentResult> {
    this.logger.log(`Processing mock payment for order ${paymentData.orderId}`);

    // Validaciones básicas
    if (!this.validateCard(paymentData.cardNumber)) {
      return {
        success: false,
        transactionId: '',
        amount: paymentData.amount,
        currency: 'USD',
        status: 'failed',
        message: 'Invalid card number',
      };
    }

    if (!this.validateExpiry(paymentData.expiry)) {
      return {
        success: false,
        transactionId: '',
        amount: paymentData.amount,
        currency: 'USD',
        status: 'failed',
        message: 'Invalid expiry date',
      };
    }

    if (!this.validateCVC(paymentData.cvc)) {
      return {
        success: false,
        transactionId: '',
        amount: paymentData.amount,
        currency: 'USD',
        status: 'failed',
        message: 'Invalid CVC',
      };
    }

    if (!paymentData.cardHolder.trim()) {
      return {
        success: false,
        transactionId: '',
        amount: paymentData.amount,
        currency: 'USD',
        status: 'failed',
        message: 'Cardholder name is required',
      };
    }

    // Simular procesamiento con delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generar ID de transacción simulado
    const transactionId = `txn_demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.logger.log(`Mock payment successful: ${transactionId}`);

    return {
      success: true,
      transactionId,
      amount: paymentData.amount,
      currency: 'USD',
      status: 'succeeded',
      message: 'Payment processed successfully',
    };
  }
}
