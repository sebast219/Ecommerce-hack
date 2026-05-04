'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements, PaymentElement, useStripe, useElements,
} from '@stripe/react-stripe-js';
import { apiClient } from '@/lib/api-client';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface OrderDetail {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: string;
  items: any[];
}

function CheckoutForm({ orderId, total }: { orderId: string; total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${orderId}/success`,
      },
    });

    if (error) {
      toast.error(error.message || 'Error en el pago');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {isProcessing ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Procesando...</>
        ) : (
          <><Lock className="mr-2 h-4 w-4" />Pagar ${total.toFixed(2)}</>
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        ð Lock Secure payment powered by Stripe
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // Cargar orden
        const orderResponse = await apiClient.get<OrderDetail>(`/orders/${orderId}`);
        setOrder(orderResponse.data);

        if (orderResponse.data.status !== 'PENDING') {
          toast.error(`La orden ya está ${orderResponse.data.status}`);
          router.push('/orders');
          return;
        }

        // Crear payment intent
        const intentResponse = await apiClient.post<{
          clientSecret: string;
          paymentIntentId: string;
        }>(`/payments/orders/${orderId}/intent`);

        setClientSecret(intentResponse.data.clientSecret);
      } catch (error: any) {
        toast.error(error.message || 'Error al cargar el checkout');
        router.push('/products');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!order || !clientSecret) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      <p className="mt-2 text-sm text-gray-600">Orden #{order.orderNumber}</p>

      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Payment */}
        <section className="lg:col-span-7">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-lg font-bold">Detalles de Pago</h2>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: 'stripe' },
              }}
            >
              <CheckoutForm orderId={orderId} total={order.total} />
            </Elements>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-8 rounded-lg bg-gray-50 p-6 lg:col-span-5 lg:mt-0">
          <h2 className="text-lg font-bold">Resumen de la Orden</h2>

          <ul className="mt-4 divide-y divide-gray-200">
            {order.items.map((item: any) => (
              <li key={item.id} className="flex justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-gray-200 pt-6 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>${order.subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Envío</dt>
              <dd>${order.shipping.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Impuestos</dt>
              <dd>${order.tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
              <dt>Total</dt>
              <dd>${order.total.toFixed(2)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
