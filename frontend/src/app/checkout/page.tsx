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
  MapPin,
  User,
  Phone,
  Mail,
  Package,
  Lock,
  Sparkles,
  ChevronRight,
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
    label: 'Tarjeta de crédito/débito',
    description: 'Pago seguro con encriptación SSL',
    icon: CreditCard,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'pse',
    label: 'PSE - Transferencia bancaria',
    description: 'Transferencia directa desde tu banco',
    icon: Truck,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'cash',
    label: 'Efectivo contra entrega',
    description: 'Paga cuando recibas tu pedido',
    icon: Check,
    color: 'from-amber-500 to-orange-600',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [currentStep, setCurrentStep] = useState(1);

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

  // Redirect if not authenticated (wait for hydration first)
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [isAuthenticated, isHydrated, router]);

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
    setIsProcessing(true);
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
        // Pequeño delay para asegurar que la navegación ocurra antes de que el componente desmonte
        setTimeout(() => {
          router.push(`/checkout/success?orderId=${response.data.id}`);
        }, 100);
      } else {
        setError(response.message || 'Error al crear la orden');
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
      setIsProcessing(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while hydrating or if not authenticated
  if (!isHydrated || (items.length === 0 || !isAuthenticated) && !isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="h-8 w-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-sm font-medium">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Back Link */}
            <Link
              href="/cart"
              className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">Volver al carrito</span>
            </Link>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-zinc-900">Hack 6</span>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="hidden sm:inline font-medium">Pago seguro</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 h-1">
          <div
            className="h-full bg-gradient-to-r from-zinc-900 to-zinc-700 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-4">
            {/* Step 1: Contact Information */}
            <section
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                currentStep >= 1
                  ? 'border-gray-200 shadow-sm'
                  : 'border-gray-100 opacity-60'
              }`}
              onClick={() => setCurrentStep(1)}
            >
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      currentStep >= 1
                        ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-zinc-900">
                      Información de contacto
                    </h2>
                    <p className="text-sm text-gray-500">
                      Datos para confirmar tu pedido
                    </p>
                  </div>
                  {currentStep > 1 && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        value={contactInfo.name}
                        onChange={(e) =>
                          setContactInfo((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Tu nombre completo"
                        className="h-14 pl-12 rounded-xl border-gray-200 focus:border-zinc-900 focus:ring-zinc-900/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) =>
                            setContactInfo((prev) => ({ ...prev, email: e.target.value }))
                          }
                          placeholder="tu@email.com"
                          className="h-14 pl-12 rounded-xl border-gray-200 focus:border-zinc-900 focus:ring-zinc-900/20 transition-all"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) =>
                            setContactInfo((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          placeholder="+57 300 000 0000"
                          className="h-14 pl-12 rounded-xl border-gray-200 focus:border-zinc-900 focus:ring-zinc-900/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    className="h-12 px-6 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-medium"
                  >
                    Continuar
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Step 2: Shipping Address */}
            <section
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                currentStep >= 2
                  ? 'border-gray-200 shadow-sm'
                  : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      currentStep >= 2
                        ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-zinc-900">
                      Dirección de envío
                    </h2>
                    <p className="text-sm text-gray-500">
                      ¿Dónde enviamos tu pedido?
                    </p>
                  </div>
                  {currentStep > 2 && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        value={shippingAddress.street}
                        onChange={(e) => handleShippingChange('street', e.target.value)}
                        placeholder="Calle 123 # 45-67"
                        className="h-14 pl-12 rounded-xl border-gray-200 focus:border-zinc-900 focus:ring-zinc-900/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apartamento, suite, etc. (opcional)
                    </label>
                    <Input
                      value={shippingAddress.apartment}
                      onChange={(e) => handleShippingChange('apartment', e.target.value)}
                      placeholder="Apto 301, Torre B"
                      className="h-14 rounded-xl border-gray-200 focus:border-zinc-900 focus:ring-zinc-900/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad
                      </label>
                      <Input
                        value={shippingAddress.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        placeholder="Bogotá"
                        className="h-14 rounded-xl border-gray-200 focus:border-zinc-900 focus:ring-zinc-900/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Departamento
                      </label>
                      <Input
                        value={shippingAddress.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        placeholder="Cundinamarca"
                        className="h-14 rounded-xl border-gray-200 focus:border-zinc-900 focus:ring-zinc-900/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código postal
                      </label>
                      <Input
                        value={shippingAddress.postalCode}
                        onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                        placeholder="110111"
                        className="h-14 rounded-xl border-gray-200 focus:border-zinc-900 focus:ring-zinc-900/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País
                      </label>
                      <Input
                        value={shippingAddress.country}
                        disabled
                        className="h-14 rounded-xl border-gray-200 bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address Toggle */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        sameAsShipping
                          ? 'bg-zinc-900 border-zinc-900'
                          : 'border-gray-300 group-hover:border-gray-400'
                      }`}
                    >
                      {sameAsShipping && <Check className="w-4 h-4 text-white" />}
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
                    <span className="text-sm font-medium text-gray-700">
                      La dirección de facturación es igual a la de envío
                    </span>
                  </label>

                  {!sameAsShipping && (
                    <div className="mt-4 space-y-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2">
                      <h3 className="font-semibold text-zinc-900">Dirección de facturación</h3>
                      <Input
                        value={billingAddress.street}
                        onChange={(e) => handleBillingChange('street', e.target.value)}
                        placeholder="Dirección de facturación"
                        className="h-14 rounded-xl border-gray-200"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          value={billingAddress.city}
                          onChange={(e) => handleBillingChange('city', e.target.value)}
                          placeholder="Ciudad"
                          className="h-14 rounded-xl border-gray-200"
                        />
                        <Input
                          value={billingAddress.state}
                          onChange={(e) => handleBillingChange('state', e.target.value)}
                          placeholder="Departamento"
                          className="h-14 rounded-xl border-gray-200"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="h-12 px-6 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-medium"
                  >
                    Continuar
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
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
          <div className="lg:sticky lg:top-20 space-y-4">
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