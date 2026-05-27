'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ShoppingCart, Plus, Minus, Trash2, ChevronRight, Package, CreditCard, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';

interface CartSidebarMLProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebarML = ({ isOpen, onClose }: CartSidebarMLProps) => {
  const { items, updateQuantity, removeItem, clearCart, getTotal, getItemCount } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = getTotal();
  const itemCount = getItemCount();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!user) {
      // Redirect to login
      router.push('/login');
      onClose();
      return;
    }

    if (items.length === 0) return;

    setIsCheckingOut(true);
    // Navigate to checkout
    router.push('/checkout');
    onClose();
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Mi carrito ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-600 mb-4">
                  Agrega productos para comenzar tu compra
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Cart Items */}
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.images[0] || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          SKU: {item.product.sku}
                        </p>
                        
                        {/* Price */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">
                            {formatPrice(typeof item.product.price === 'number' ? item.product.price : item.product.price.amount)}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Cantidad:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="mt-2 text-sm text-gray-600">
                          Subtotal: {formatPrice(
                            (typeof item.product.price === 'number' ? item.product.price : item.product.price.amount) * item.quantity
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                <button
                  onClick={handleClearCart}
                  className="w-full py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-white">
              {/* Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impuestos</span>
                  <span className="font-medium">{formatPrice(total * 0.21)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(total * 1.21)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Continuar compra
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Benefits */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span>Envío gratis en compras superiores a $50</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>Empaquetado seguro</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
