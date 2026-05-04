'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string | null;
    isActive?: boolean;
    inventory?: { quantity: number };
  };
}

interface CartData {
  items: CartItem[];
  invalidItems: any[];
  summary: {
    subtotal: number;
    totalItems: number;
    itemCount: number;
  };
}

export function useCart() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<CartData>('/cart');
      setCart(response.data);
    } catch (error: any) {
      if (error.status !== 401) {
        toast.error('Error al cargar el carrito');
      }
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      try {
        await apiClient.post('/cart/items', { productId, quantity });
        toast.success('Compra exitosa');
        await fetchCart();
        return true;
      } catch (error: any) {
        toast.error(error.message || 'Error al agregar al carrito');
        return false;
      }
    },
    [fetchCart],
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      try {
        await apiClient.patch(`/cart/items/${cartItemId}`, { quantity });
        await fetchCart();
        return true;
      } catch (error: any) {
        toast.error(error.message || 'Error al actualizar');
        return false;
      }
    },
    [fetchCart],
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      try {
        await apiClient.delete(`/cart/items/${cartItemId}`);
        toast.success('Eliminado del carrito');
        await fetchCart();
      } catch (error: any) {
        toast.error(error.message || 'Error al eliminar');
      }
    },
    [fetchCart],
  );

  const clearCart = useCallback(async () => {
    try {
      await apiClient.delete('/cart');
      toast.success('Carrito vaciado');
      await fetchCart();
    } catch (error: any) {
      toast.error(error.message || 'Error al vaciar el carrito');
    }
  }, [fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    itemCount: cart?.summary?.totalItems || 0,
    subtotal: cart?.summary?.subtotal || 0,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refetch: fetchCart,
  };
}
