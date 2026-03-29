'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { ordersApi } from '@/lib/orders-api';
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
} from 'lucide-react';

interface AddressForm {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  apartment?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
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

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  const subtotal = getTotal();
  const shipping = subtotal > 500000 ? 0 : 15000; // $500,000 COP for free shipping
  const tax = subtotal * 0.19; // 19% IVA
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
    setError(null);

    try {
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
        router.push(`/checkout/success?orderId=${response.data.id}`);
      } else {
        setError(response.message || 'Error al crear la orden');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al carrito
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium text-slate-700">Checkout seguro</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {/* Contact Information */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Información de contacto
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre completo
                  </label>
                  <Input
                    value={contactInfo.name}
                    onChange={(e) =>
                      setContactInfo((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Tu nombre completo"
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) =>
                        setContactInfo((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="tu@email.com"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Teléfono
                    </label>
                    <Input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) =>
                        setContactInfo((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="+57 300 000 0000"
                      className="h-12"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Dirección de envío
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Dirección
                  </label>
                  <Input
                    value={shippingAddress.street}
                    onChange={(e) => handleShippingChange('street', e.target.value)}
                    placeholder="Calle 123 # 45-67"
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Apartamento, suite, etc. (opcional)
                  </label>
                  <Input
                    value={shippingAddress.apartment}
                    onChange={(e) => handleShippingChange('apartment', e.target.value)}
                    placeholder="Apto 301, Torre B"
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Ciudad
                    </label>
                    <Input
                      value={shippingAddress.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      placeholder="Bogotá"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Estado/Departamento
                    </label>
                    <Input
                      value={shippingAddress.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      placeholder="Cundinamarca"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Código postal
                    </label>
                    <Input
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                      placeholder="110111"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      País
                    </label>
                    <Input
                      value={shippingAddress.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                      placeholder="Colombia"
                      className="h-12"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Billing Address Toggle */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="same-as-shipping"
                  checked={sameAsShipping}
                  onChange={(e) => {
                    setSameAsShipping(e.target.checked);
                    if (e.target.checked) {
                      setBillingAddress(shippingAddress);
                    }
                  }}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="same-as-shipping" className="text-sm text-slate-700">
                  La dirección de facturación es igual a la de envío
                </label>
              </div>

              {!sameAsShipping && (
                <div className="space-y-4 mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-medium text-slate-900">Dirección de facturación</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Dirección
                    </label>
                    <Input
                      value={billingAddress.street}
                      onChange={(e) => handleBillingChange('street', e.target.value)}
                      placeholder="Calle 123 # 45-67"
                      className="h-12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Ciudad
                      </label>
                      <Input
                        value={billingAddress.city}
                        onChange={(e) => handleBillingChange('city', e.target.value)}
                        placeholder="Bogotá"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Estado/Departamento
                      </label>
                      <Input
                        value={billingAddress.state}
                        onChange={(e) => handleBillingChange('state', e.target.value)}
                        placeholder="Cundinamarca"
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Método de pago
              </h2>

              <div className="space-y-3">
                {[
                  { id: 'credit_card', label: 'Tarjeta de crédito/débito', icon: CreditCard },
                  { id: 'pse', label: 'PSE - Transferencia bancaria', icon: Truck },
                  { id: 'cash', label: 'Efectivo contra entrega', icon: Check },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === method.id
                          ? 'border-emerald-500'
                          : 'border-slate-300'
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <method.icon className="w-5 h-5 text-slate-500" />
                    <span className="font-medium text-slate-700">{method.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button (Mobile) */}
            <div className="lg:hidden">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg font-semibold"
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

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Resumen del pedido
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">IMG</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-slate-500">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-medium text-slate-900">
                        ${(
                          (typeof item.product.price === 'number'
                            ? item.product.price
                            : item.product.price?.amount || 0) * item.quantity
                        ).toLocaleString('es-CO')}{' '}
                        COP
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">
                    ${subtotal.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Envío</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'font-medium'}>
                    {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CO')} COP`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">IVA (19%)</span>
                  <span className="font-medium">${tax.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-slate-200">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              {/* Free shipping notice */}
              {subtotal < 500000 && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 text-sm">
                  <p className="text-emerald-700">
                    Te faltan{' '}
                    <span className="font-semibold">
                      ${(500000 - subtotal).toLocaleString('es-CO')} COP
                    </span>{' '}
                    para obtener envío gratis
                  </p>
                </div>
              )}

              {/* Security badges */}
              <div className="mt-6 pt-6 border-t border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Pago seguro con encriptación SSL</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Garantía de devolución de 30 días</span>
                </div>
              </div>
            </div>

            {/* Submit Button (Desktop) */}
            <div className="hidden lg:block">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  `Completar pedido - $${total.toLocaleString('es-CO')} COP`
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
