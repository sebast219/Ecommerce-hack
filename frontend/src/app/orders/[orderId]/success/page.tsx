'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await apiClient.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle className="mx-auto h-20 w-20 text-emerald-500" />
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Payment Successful!</h1>
      <p className="mt-3 text-gray-600">
        Thank you for your purchase. Your order has been confirmed.
      </p>

      {order && (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-left">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Order Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Order Number</dt>
              <dd className="font-mono">{order.orderNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Total</dt>
              <dd className="font-bold">${order.total.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Status</dt>
              <dd className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                {order.status}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/orders"
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          View My Orders
        </Link>
        <Link
          href="/products"
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
