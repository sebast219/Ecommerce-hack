// 💳 STRIPE CLIENT - Integración frontend con Stripe
// PROPÓSITO: Configuración y utilidades para pagos con Stripe

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
  }
  return stripePromise;
};

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
  paymentStatus: string;
}

export interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
  customerId?: string;
  orderId?: string;
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionData {
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
}

// API client para pagos
class StripePaymentClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  }

  async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntent> {
    const response = await fetch(`${this.baseUrl}/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    const result = await response.json();
    return result.data;
  }

  async createCheckoutSession(data: CreateCheckoutSessionData): Promise<CheckoutSession> {
    const response = await fetch(`${this.baseUrl}/payments/checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const result = await response.json();
    return result.data;
  }

  async getPaymentIntent(paymentIntentId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/payments/payment-intent/${paymentIntentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get payment intent');
    }

    const result = await response.json();
    return result.data;
  }

  async confirmPayment(paymentIntentId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/payments/confirm-payment/${paymentIntentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to confirm payment');
    }

    const result = await response.json();
    return result.data;
  }
}

export const stripePaymentClient = new StripePaymentClient();

// Funciones helper para formateo de moneda
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Funciones para validar tarjeta de crédito
export const validateCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s+/g, '');
  const regex = /^[0-9]{13,19}$/;
  return regex.test(cleaned);
};

export const validateExpiry = (expiry: string): boolean => {
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!regex.test(expiry)) return false;

  const [month, year] = expiry.split('/');
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  const expYear = parseInt(year);
  const expMonth = parseInt(month);

  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;

  return true;
};

export const validateCVC = (cvc: string): boolean => {
  const regex = /^[0-9]{3,4}$/;
  return regex.test(cvc);
};

// Función para calcular comisiones
export const calculateFees = (amount: number): { stripeFee: number; total: number } => {
  const stripeFee = Math.max(0.30, amount * 0.029) + 0.30;
  return {
    stripeFee: Math.round(stripeFee * 100) / 100,
    total: Math.round((amount + stripeFee) * 100) / 100,
  };
};
