'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { ordersApi } from '@/lib/orders-api';
import { stripePaymentClient, formatCurrency } from '@/lib/stripe';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Truck,
  Shield,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  MapPin,
  User,
  Phone,
  Mail,
  Package,
  Lock,
  ShoppingCart,
} from 'lucide-react';

interface AddressForm {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  apartment?: string;
}

const PAYMENT_METHODS = [
  {
    id: 'credit_card',
    label: 'Tarjeta de crédito o débito',
    icon: CreditCard,
  },
  {
    id: 'pse',
    label: 'PSE - Transferencia bancaria',
    icon: Truck,
  },
  {
    id: 'cash',
    label: 'Contra entrega',
    icon: Check,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const [shippingAddress, setShippingAddress] = useState<AddressForm>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Colombia',
    apartment: '',
  });

  const [billingAddress, setBillingAddress] = useState<AddressForm>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Colombia',
    apartment: '',
  });

  const [contactInfo, setContactInfo] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '',
    email: user?.email || '',
    phone: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  const subtotal = getTotal();
  const shipping = subtotal > 500000 ? 0 : 15000;
  const tax = subtotal * 0.19;
  const total = subtotal + shipping + tax;

  const handleShippingChange = (field: keyof AddressForm, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    if (sameAsShipping) {
      setBillingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleBillingChange = (field: keyof AddressForm, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsProcessing(true);
    setError(null);

    try {
      // Validar reglas de negocio antes de procesar
      if (paymentMethod === 'credit_card') {
        // Crear checkout session con Stripe para pagos con tarjeta
        const checkoutSession = await stripePaymentClient.createCheckoutSession({
          customerId: user?.id,
          items: items.map(item => ({
            name: item.product.name,
            amount: typeof item.product.price === 'number' ? item.product.price : item.product.price?.amount || 0,
            quantity: item.quantity,
            description: item.product.description,
            images: item.product.image ? [item.product.image] : undefined
          })),
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
          orderId: `order-${Date.now()}`
        });

        // Redirigir a Stripe Checkout
        window.location.href = checkoutSession.url;
      } else {
        // Procesar otros métodos de pago (PSE, contra entrega)
        const orderData = {
          shippingName: contactInfo.name,
          shippingEmail: contactInfo.email,
          shippingPhone: contactInfo.phone,
          shippingAddress,
          billingAddress: sameAsShipping ? undefined : billingAddress,
          notes: '',
          paymentMethod,
        };

        const response = await ordersApi.createOrder(orderData);

        if (response.success) {
          clearCart();
          setTimeout(() => {
            router.push(`/checkout/success?orderId=${response.data.id}`);
          }, 100);
        } else {
          setError(response.message || 'Error al crear la orden');
          setIsProcessing(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
      setIsProcessing(false);
    } finally {
      if (paymentMethod !== 'credit_card') {
        setIsLoading(false);
      }
    }
  };

  if ((items.length === 0 || !isAuthenticated) && !isProcessing) {
    return null;
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </Link>

          <Link href="/" className="text-lg font-semibold text-gray-900">
            Hack 6
          </Link>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Seguro</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
          {/* Form Column */}
          <div className="space-y-10">
            {/* Contact */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Información de contacto
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="Correo electrónico"
                    className="h-12 pl-12 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={contactInfo.name}
                      onChange={(e) =>
                        setContactInfo((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Nombre completo"
                      className="h-12 pl-12 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) =>
                        setContactInfo((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="Teléfono"
                      className="h-12 pl-12 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Dirección de envío
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={shippingAddress.street}
                    onChange={(e) => handleShippingChange('street', e.target.value)}
                    placeholder="Dirección"
                    className="h-12 pl-12 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0"
                  />
                </div>
                <Input
                  value={shippingAddress.apartment}
                  onChange={(e) => handleShippingChange('apartment', e.target.value)}
                  placeholder="Apartamento, suite, unidad, etc. (opcional)"
                  className="h-12 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={shippingAddress.city}
                    onChange={(e) => handleShippingChange('city', e.target.value)}
                    placeholder="Ciudad"
                    className="h-12 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0"
                  />
                  <Input
                    value={shippingAddress.state}
                    onChange={(e) => handleShippingChange('state', e.target.value)}
                    placeholder="Departamento"
                    className="h-12 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={shippingAddress.postalCode}
                    onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                    placeholder="Código postal"
                    className="h-12 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-0"
                  />
                  <Input
                    value={shippingAddress.country}
                    disabled
                    className="h-12 rounded-lg border-gray-200 bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </section>

            {/* Billing Toggle */}
            <section className="pt-4 border-t border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors ${
                    sameAsShipping
                      ? 'bg-gray-900 border-gray-900'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {sameAsShipping && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => {
                    setSameAsShipping(e.target.checked);
                    if (e.target.checked) {
                      setBillingAddress(shippingAddress);
                    }
                  }}
                  className="hidden"
                />
                <span className="text-sm text-gray-600">
                  Usar la misma dirección para facturación
                </span>
              </label>

              {!sameAsShipping && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    Dirección de facturación
                  </h3>
                  <Input
                    value={billingAddress.street}
                    onChange={(e) => handleBillingChange('street', e.target.value)}
                    placeholder="Dirección"
                    className="h-12 rounded-lg border-gray-200"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={billingAddress.city}
                      onChange={(e) => handleBillingChange('city', e.target.value)}
                      placeholder="Ciudad"
                      className="h-12 rounded-lg border-gray-200"
                    />
                    <Input
                      value={billingAddress.state}
                      onChange={(e) => handleBillingChange('state', e.target.value)}
                      placeholder="Departamento"
                      className="h-12 rounded-lg border-gray-200"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Payment */}
            <section className="pt-4 border-t border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Método de pago
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      paymentMethod === method.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        paymentMethod === method.id
                          ? 'border-gray-900 bg-gray-900'
                          : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="flex-1 text-left text-sm font-medium text-gray-900">
                      {method.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Mobile Submit */}
            <div className="lg:hidden pt-6 border-t border-gray-100">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-base font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  `Pagar $${total.toLocaleString('es-CO')} COP`
                )}
              </Button>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-gray-50 rounded-xl p-6">
              {/* Header */}
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-200">
                <Package className="w-5 h-5 text-gray-400" />
                <h2 className="text-base font-medium text-gray-900">
                  Resumen del pedido
                </h2>
                <span className="ml-auto text-sm text-gray-500">
                  {items.length} items
                </span>
              </div>

              {/* Expandir carrito */}
              <Link
                href="/cart"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Expandir carrito</span>
              </Link>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        ${(
                          (typeof item.product.price === 'number'
                            ? item.product.price
                            : item.product.price?.amount || 0) * item.quantity
                        ).toLocaleString('es-CO')}{' '}
                        <span className="text-xs text-gray-500">COP</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${subtotal.toLocaleString('es-CO')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span
                    className={
                      shipping === 0
                        ? 'font-medium text-emerald-600'
                        : 'font-medium text-gray-900'
                    }
                  >
                    {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CO')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (19%)</span>
                  <span className="font-medium text-gray-900">
                    ${tax.toLocaleString('es-CO')}
                  </span>
                </div>

                {/* Free shipping */}
                {subtotal < 500000 && (
                  <div className="py-3">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-500">
                        Faltan ${(500000 - subtotal).toLocaleString('es-CO')} para envío gratis
                      </span>
                      <span className="text-gray-400">
                        {Math.round((subtotal / 500000) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min((subtotal / 500000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-baseline pt-4 border-t border-gray-200">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-2xl font-semibold text-gray-900">
                    ${total.toLocaleString('es-CO')}{' '}
                    <span className="text-sm font-normal text-gray-500">COP</span>
                  </span>
                </div>
              </div>

              {/* Desktop Submit */}
              <div className="hidden lg:block mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-base font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    `Completar pedido · $${total.toLocaleString('es-CO')} COP`
                  )}
                </Button>
              </div>

              {/* Security */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>SSL Seguro</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="w-4 h-4" />
                  <span>Encriptado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
