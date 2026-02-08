'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { CartItem as CartItemType } from '@/types/cart';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">
            Parece que no has agregado productos a tu carrito todavía.
          </p>
          <Button onClick={() => window.history.back()} className="btn btn-primary">
            Seguir Comprando
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold mb-6">Tu Carrito</h1>
          
          {items.map((item: CartItemType) => (
            <div key={item.id} className="bg-card p-4 rounded-lg shadow-sm">
              <div className="flex gap-4">
                {/* Product Image */}
                <img
                  src={item.product.images[0] || '/images/placeholder-product.jpg'}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                
                {/* Product Details */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.product.description?.substring(0, 100)}
                      {item.product.description && item.product.description.length > 100 && '...'}
                    </p>
                  </div>
                  
                  {/* Price and Quantity */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">
                      ${item.product.price.toFixed(2)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-accent rounded"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-accent rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="text-sm text-muted-foreground">
                    Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Clear Cart Button */}
          {items.length > 0 && (
            <div className="mt-6 text-center">
              <Button
                onClick={handleClearCart}
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Vaciar Carrito
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg shadow-sm sticky top-4">
            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Envío</span>
                <span>Calculado en checkout</span>
              </div>
              
              <div className="flex justify-between">
                <span>Impuestos</span>
                <span>Calculado en checkout</span>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
            
            {/* Checkout Button */}
            <Button className="w-full btn btn-primary">
              Proceder al Checkout
            </Button>
            
            {/* Security Badge */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span>Pago Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
