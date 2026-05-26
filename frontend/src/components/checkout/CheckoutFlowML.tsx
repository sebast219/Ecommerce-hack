'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  ChevronLeft, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  CheckCircle,
  Truck,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { useCart } from '@/hooks/use-cart';
import { apiClient } from '@/lib/api-client';

interface CheckoutStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  completed: boolean;
  current: boolean;
}

export const CheckoutFlowML = () => {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { addToCart, refetch: refetchApiCart } = useCart();
  const { user } = useAuthStore();
  const { createOrder, createPaymentIntent } = useOrderManagement();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  
  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    notes: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Saved addresses and payment methods
  const [savedAddresses, setSavedAddresses] = useState<Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    isDefault: boolean;
  }>>([]);

  const [savedPaymentMethods, setSavedPaymentMethods] = useState<Array<{
    id: string;
    last4: string;
    brand: string;
    expiryMonth: string;
    expiryYear: string;
    bank: string;
    isDefault: boolean;
  }>>([]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [useNewPaymentMethod, setUseNewPaymentMethod] = useState(false);

  // Calculate totals
  const getTotal = () => {
    return items.reduce((total: number, item: any) => {
      const price = typeof item.product.price === 'number' ? item.product.price : item.product.price.amount;
      return total + (price * item.quantity);
    }, 0) || 0;
  };

  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.21;
  const total = subtotal + shipping + tax;

  const steps: CheckoutStep[] = [
    {
      id: 'cart',
      title: 'Resumen',
      icon: <ShoppingBag className="w-5 h-5" />,
      completed: currentStep > 1,
      current: currentStep === 1
    },
    {
      id: 'shipping',
      title: 'Envío',
      icon: <MapPin className="w-5 h-5" />,
      completed: currentStep > 2,
      current: currentStep === 2
    },
    {
      id: 'payment',
      title: 'Pago',
      icon: <CreditCard className="w-5 h-5" />,
      completed: currentStep > 3,
      current: currentStep === 3
    }
  ];

  useEffect(() => {
    if (!user || !items || items.length === 0) {
      router.push('/products');
    }
  }, [user, items, router]);

  
  const loadSavedAddresses = useCallback(async () => {
    try {
      const response = await apiClient.get('/users/addresses');
      const addressesData = (response.data as any)?.data || response.data;
      
      if (Array.isArray(addressesData)) {
        setSavedAddresses(addressesData.map((addr: any) => ({
          id: addr.id,
          label: addr.label,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          zipCode: addr.zipCode,
          phone: addr.phone,
          isDefault: addr.isDefault || false,
        })));
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  }, []);

  const loadSavedPaymentMethods = useCallback(async () => {
    try {
      const response = await apiClient.get('/users/payment-methods');
      const cardsData = (response.data as any)?.data || response.data;
      
      if (Array.isArray(cardsData)) {
        setSavedPaymentMethods(cardsData.map((pm: any) => ({
          id: pm.id,
          last4: pm.last4,
          brand: pm.brand,
          expiryMonth: pm.expiryMonth,
          expiryYear: pm.expiryYear,
          bank: pm.bank || 'generic',
          isDefault: pm.isDefault || false,
        })));
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  }, []);

  const handleNextStep = async () => {
    setError(null);
    
    if (currentStep === 1) {
      // Validate cart
      if (!items || items.length === 0) {
        setError('El carrito está vacío');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate shipping
      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
        setError('Por favor completa todos los campos de envío');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Process payment and create order
      await handlePayment();
    }
  };

  // Load saved addresses and payment methods
  useEffect(() => {
    if (user) {
      loadSavedAddresses();
      loadSavedPaymentMethods();
    }
  }, [user, loadSavedAddresses, loadSavedPaymentMethods]);

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const syncCartToApi = async () => {
    // Sync local cart items to API cart
    for (const item of items) {
      await addToCart(item.product.id, item.quantity);
    }
    // Refresh API cart to ensure items are there
    await refetchApiCart();
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create order - usar dirección guardada
      if (!useNewAddress && !selectedAddressId) {
        setError('Por favor selecciona una dirección guardada');
        return;
      }

      // Sync local cart to API cart first
      await syncCartToApi();
      
      const order = await createOrder({
        shippingAddressId: selectedAddressId,
        notes: shippingAddress.notes
      });

      if (!order) {
        throw new Error('Error al crear la orden');
      }

      setOrderData(order);

      // Create payment intent for card payments
      if (paymentMethod === 'card') {
        // Handle both OrderResult (orderId) and Order (id) response types
        const orderId = (order as any).orderId || (order as any).id;
        const orderTotal = (order as any).total || total; // Use order total or calculated total
        const clientSecret = await createPaymentIntent(orderId, orderTotal);
        if (clientSecret) {
          // Process Stripe payment here
          // For now, simulate successful payment
          await handlePaymentSuccess(order);
        }
      } else {
        // Handle transfer payment
        await handlePaymentSuccess(order);
      }

    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (order: any) => {
    clearCart();
    // Handle both OrderResult (orderId) and Order (id) response types
    const orderId = (order as any).orderId || (order as any).id;
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (!user || !items || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No se puede continuar</h2>
          <p className="text-gray-600 mb-4">
            {!user ? 'Debes iniciar sesión para continuar' : 'Tu carrito está vacío'}
          </p>
          <button
            onClick={() => router.push(!user ? '/auth/login' : '/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {!user ? 'Iniciar sesión' : 'Ir a productos'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/cart')}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold">Checkout</h1>
            </div>
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step.completed
                        ? 'bg-green-600 text-white'
                        : step.current
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-2 ${
                        step.completed ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Step 1: Cart Summary */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Resumen del pedido</h2>
                  <div className="space-y-4">
                    {items?.map((item: any) => (
                      <div key={item.product.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">IMG</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity} x {formatPrice(
                              typeof item.product.price === 'number' 
                                ? item.product.price 
                                : item.product.price.amount
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(
                              (typeof item.product.price === 'number' 
                                ? item.product.price 
                                : item.product.price.amount) * item.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Información de envío</h2>
                  
                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && !useNewAddress && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4">Selecciona una dirección guardada</h3>
                      <div className="space-y-3">
                        {savedAddresses.map((address) => (
                          <label
                            key={address.id}
                            className={`flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                              selectedAddressId === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name="address"
                              value={address.id}
                              checked={selectedAddressId === address.id}
                              onChange={(e) => {
                                setSelectedAddressId(e.target.value);
                                setShippingAddress({
                                  street: address.street,
                                  city: address.city,
                                  state: address.state,
                                  zipCode: address.zipCode,
                                  country: '',
                                  notes: ''
                                });
                              }}
                              className="mt-1 mr-3"
                            />
                            <div className="flex-1">
                              <div className="font-medium">{address.label}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                {address.street}, {address.city}, {address.state}, {address.zipCode}
                              </div>
                              {address.phone && (
                                <div className="text-sm text-gray-500 mt-1">Tel: {address.phone}</div>
                              )}
                            </div>
                            {address.isDefault && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                Predeterminada
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => {
                          setUseNewAddress(true);
                          setSelectedAddressId('');
                        }}
                        className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        + Usar una nueva dirección
                      </button>
                    </div>
                  )}

                  {/* New Address Form */}
                  {(useNewAddress || savedAddresses.length === 0) && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        {savedAddresses.length > 0 ? 'Nueva dirección' : 'Información de envío'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Calle y número
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.street}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Calle 123"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ciudad
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ciudad"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado/Provincia
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Estado"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Código Postal
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.zipCode}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="00000"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notas de envío (opcional)
                          </label>
                          <textarea
                            value={shippingAddress.notes}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Instrucciones especiales de envío..."
                          />
                        </div>
                      </div>
                      
                      {savedAddresses.length > 0 && (
                        <button
                          onClick={() => {
                            setUseNewAddress(false);
                            setShippingAddress({
                              street: '',
                              city: '',
                              state: '',
                              zipCode: '',
                              country: '',
                              notes: ''
                            });
                          }}
                          className="mt-4 text-gray-600 hover:text-gray-700 text-sm font-medium"
                        >
                          Cancelar y usar dirección guardada
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Método de pago</h2>
                  
                  {/* Payment Method Selection */}
                  <div className="space-y-4 mb-6">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'transfer')}
                        className="mr-3"
                      />
                      <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                      <span>Tarjeta de crédito/débito</span>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="transfer"
                        checked={paymentMethod === 'transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'transfer')}
                        className="mr-3"
                      />
                      <Truck className="w-5 h-5 mr-2 text-green-600" />
                      <span>Transferencia bancaria</span>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div>
                      {/* Saved Payment Methods */}
                      {savedPaymentMethods.length > 0 && !useNewPaymentMethod && (
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-4">Selecciona una tarjeta guardada</h3>
                          <div className="space-y-3">
                            {savedPaymentMethods.map((card) => (
                              <label
                                key={card.id}
                                className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                                  selectedPaymentMethodId === card.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="payment-method"
                                  value={card.id}
                                  checked={selectedPaymentMethodId === card.id}
                                  onChange={(e) => {
                                    setSelectedPaymentMethodId(e.target.value);
                                    setCardData({
                                      number: `**** **** **** ${card.last4}`,
                                      name: '',
                                      expiry: `${card.expiryMonth}/${card.expiryYear}`,
                                      cvv: ''
                                    });
                                  }}
                                  className="mr-3"
                                />
                                <div className="flex-1 flex items-center">
                                  <div className="w-12 h-8 mr-3 flex items-center justify-center">
                                    {card.brand === 'visa' && <div className="text-blue-600 font-bold text-xs">VISA</div>}
                                    {card.brand === 'mastercard' && <div className="text-red-600 font-bold text-xs">MC</div>}
                                    {card.brand === 'amex' && <div className="text-green-600 font-bold text-xs">AMEX</div>}
                                    {!['visa', 'mastercard', 'amex'].includes(card.brand) && <div className="text-gray-600 font-bold text-xs">CARD</div>}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium">**** **** **** {card.last4}</div>
                                    <div className="text-sm text-gray-600">
                                      Vence: {card.expiryMonth}/{card.expiryYear}
                                    </div>
                                    {card.bank && card.bank !== 'generic' && (
                                      <div className="text-sm text-gray-500">{card.bank}</div>
                                    )}
                                  </div>
                                </div>
                                {card.isDefault && (
                                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                    Predeterminada
                                  </span>
                                )}
                              </label>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => {
                              setUseNewPaymentMethod(true);
                              setSelectedPaymentMethodId('');
                              setCardData({
                                number: '',
                                name: '',
                                expiry: '',
                                cvv: ''
                              });
                            }}
                            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            + Usar una nueva tarjeta
                          </button>
                        </div>
                      )}

                      {/* New Card Form */}
                      {(useNewPaymentMethod || savedPaymentMethods.length === 0) && (
                        <div>
                          <h3 className="text-lg font-medium mb-4">
                            {savedPaymentMethods.length > 0 ? 'Nueva tarjeta' : 'Información de la tarjeta'}
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Número de tarjeta
                              </label>
                              <input
                                type="text"
                                value={cardData.number}
                                onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre en la tarjeta
                              </label>
                              <input
                                type="text"
                                value={cardData.name}
                                onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Juan Pérez"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Vencimiento
                                </label>
                                <input
                                  type="text"
                                  value={cardData.expiry}
                                  onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="MM/AA"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  CVV
                                </label>
                                <input
                                  type="text"
                                  value={cardData.cvv}
                                  onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="123"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {savedPaymentMethods.length > 0 && (
                            <button
                              onClick={() => {
                                setUseNewPaymentMethod(false);
                                setCardData({
                                  number: '',
                                  name: '',
                                  expiry: '',
                                  cvv: ''
                                });
                              }}
                              className="mt-4 text-gray-600 hover:text-gray-700 text-sm font-medium"
                            >
                              Cancelar y usar tarjeta guardada
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {paymentMethod === 'transfer' && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Datos para transferencia</h3>
                      <div className="space-y-2">
                        <p><strong>Banco:</strong> Banco Ejemplo</p>
                        <p><strong>Titular:</strong> CyberSecurity Store</p>
                        <p><strong>CBU:</strong> 0000000000000000000000</p>
                        <p><strong>Alias:</strong> cybersecurity.store</p>
                      </div>
                      <p className="text-blue-800 text-sm mt-2">
                        Una vez realizada la transferencia, tu pedido será procesado.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    'Procesando...'
                  ) : currentStep === 3 ? (
                    'Comprar'
                  ) : (
                    <>
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Envío gratis en compras &gt; $50</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span>Garantía de devolución</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
