'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, ShoppingBag, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ordersApi, Order } from '@/lib/orders-api';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No se encontró el ID de la orden');
        setLoading(false);
        return;
      }

      try {
        const response = await ordersApi.getOrder(orderId);
        if (response.success) {
          setOrder(response.data);
        } else {
          setError(response.message || 'Error al cargar la orden');
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar la orden');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando detalles de tu orden...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😕</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {error || 'No se encontró la orden'}
          </h1>
          <p className="text-slate-600 mb-6">
            No pudimos encontrar los detalles de tu compra. Por favor, verifica tu correo electrónico para confirmación.
          </p>
          <Link href="/products">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Continuar comprando
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            ¡Orden confirmada!
          </h1>
          <p className="text-slate-600">
            Gracias por tu compra. Te hemos enviado un correo de confirmación a{' '}
            <span className="font-medium text-slate-900">{order.shippingEmail}</span>
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          {/* Order Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Número de orden</p>
                <p className="text-lg font-semibold text-slate-900">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Fecha</p>
                <p className="text-sm font-medium text-slate-900">
                  {new Date(order.createdAt).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Productos
            </h3>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.product?.name || 'Producto'}</p>
                    <p className="text-sm text-slate-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    ${(item.price.amount * item.quantity).toLocaleString('es-CO')} COP
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">
                  ${order.subtotal.amount.toLocaleString('es-CO')} COP
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Envío</span>
                <span className={order.shipping.amount === 0 ? 'text-emerald-600 font-medium' : 'font-medium'}>
                  {order.shipping.amount === 0
                    ? 'Gratis'
                    : `$${order.shipping.amount.toLocaleString('es-CO')} COP`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">IVA (19%)</span>
                <span className="font-medium">${order.tax.amount.toLocaleString('es-CO')} COP</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>${order.total.amount.toLocaleString('es-CO')} COP</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="px-6 py-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Dirección de envío
            </h3>
            <p className="text-sm text-slate-700">
              {order.shippingName}
              <br />
              {order.shippingAddress.street}
              {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Payment Status */}
          <div className="px-6 py-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Estado del pago
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  order.payment?.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : order.payment?.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {order.payment?.status === 'COMPLETED'
                  ? 'Pago completado'
                  : order.payment?.status === 'PENDING'
                  ? 'Pago pendiente'
                  : order.payment?.status || 'Procesando'}
              </span>
              <span className="text-sm text-slate-500">
                • {order.payment?.provider === 'credit_card'
                  ? 'Tarjeta de crédito'
                  : order.payment?.provider === 'pse'
                  ? 'PSE'
                  : order.payment?.provider === 'cash'
                  ? 'Efectivo'
                  : order.payment?.provider}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-slate-300 hover:bg-slate-50"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Seguir comprando
            </Button>
          </Link>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="w-full sm:w-auto border-slate-300 hover:bg-slate-50"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir recibo
          </Button>
          <Link href="/profile">
            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
              Ver mis pedidos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Support */}
        <p className="text-center text-sm text-slate-500 mt-8">
          ¿Tienes alguna pregunta?{' '}
          <a href="mailto:soporte@hack6.com" className="text-emerald-600 hover:underline">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
