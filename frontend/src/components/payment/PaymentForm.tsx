// 💳 PAYMENT FORM - Componente de formulario de pago
// PROPÓSITO: Formulario completo para procesar pagos con Stripe

'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { getStripe } from '@/lib/stripe';
import { validateCard, validateExpiry, validateCVC, formatCurrency } from '@/lib/stripe';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: Error) => void;
  orderId?: string;
  customerId?: string;
}

interface CardForm {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

export default function PaymentForm({ 
  amount, 
  onSuccess, 
  onError, 
  orderId, 
  customerId 
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [cardForm, setCardForm] = useState<CardForm>({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [errors, setErrors] = useState<Partial<CardForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CardForm> = {};

    if (!validateCard(cardForm.number)) {
      newErrors.number = 'Invalid card number';
    }

    if (!validateExpiry(cardForm.expiry)) {
      newErrors.expiry = 'Invalid expiry date';
    }

    if (!validateCVC(cardForm.cvc)) {
      newErrors.cvc = 'Invalid CVC';
    }

    if (!cardForm.name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CardForm, value: string) => {
    let formattedValue = value;

    if (field === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    } else if (field === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardForm(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Crear Checkout Session directamente
      const sessionData = await apiClient.post('/payments/checkout-session', {
        items: [{
          name: 'Order Payment',
          amount: amount,
          quantity: 1,
          description: orderId ? `Order #${orderId}` : 'Purchase from Ecommerce Hak 6'
        }],
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        orderId,
        customerId,
      });
      
      // Redirigir a Stripe Checkout
      window.location.href = (sessionData.data as any).url;
    } catch (error) {
      onError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Amount:</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(amount)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            id="name"
            value={cardForm.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            id="number"
            value={cardForm.number}
            onChange={(e) => handleInputChange('number', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            disabled={loading}
          />
          {errors.number && (
            <p className="mt-1 text-sm text-red-600">{errors.number}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiry"
              value={cardForm.expiry}
              onChange={(e) => handleInputChange('expiry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="MM/YY"
              maxLength={5}
              disabled={loading}
            />
            {errors.expiry && (
              <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>
            )}
          </div>

          <div>
            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              id="cvc"
              value={cardForm.cvc}
              onChange={(e) => handleInputChange('cvc', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123"
              maxLength={4}
              disabled={loading}
            />
            {errors.cvc && (
              <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ${formatCurrency(amount)}`
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-600">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
}
