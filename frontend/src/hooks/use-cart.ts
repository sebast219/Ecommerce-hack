/**
 * USE CART HOOK - EJERCICIO PRÁCTICO
 * 
 * CONCEPTOS QUE APRENDERÁS:
 * - Custom Hooks: Hooks personalizados para lógica de carrito
 * - State Synchronization: Sincronización con store global
 * - API Integration: Conexión con backend del carrito
 * - Optimistic Updates: Actualizaciones optimistas
 * - Error Recovery: Recuperación de errores
 * 
 * RECURSOS DE APRENDIZAJE:
 * - React Hooks Patterns: https://usehooks.com/
 * - Optimistic UI: https://kentcdodds.com/blog/optimistic-ui-patterns
 * - State Management: https://zustand.docs.pmnd.rs/
 */

import { useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '@/types/cart';
import { useCartStore } from '@/store/cart-store';
import { useAuth } from './use-auth';
import { api } from '@/lib/api';

interface UseCartReturn {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// Helper para mapear items del backend al frontend
const mapCartItem = (backendItem: any): CartItem => ({
  id: backendItem.id,
  product: {
    id: backendItem.product?.id,
    name: backendItem.product?.name,
    description: backendItem.product?.description,
    price: backendItem.product?.price?.amount || backendItem.product?.price || 0,
    images: backendItem.product?.images || [],
    sku: backendItem.product?.sku,
    slug: backendItem.product?.slug,
    category: backendItem.product?.category,
  },
  quantity: backendItem.quantity,
  addedAt: backendItem.createdAt || new Date().toISOString(),
});

export function useCart(): UseCartReturn {
  const { 
    items, 
    addItem: storeAddItem, 
    updateQuantity: storeUpdateQuantity, 
    removeItem: storeRemoveItem, 
    clearCart: storeClearCart,
    setItems,
    userId 
  } = useCartStore();
  const { user, isAuthenticated } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar carrito desde backend
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('[CART] No autenticado, usando carrito local');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[CART] Cargando carrito desde backend...');
      const response = await api.get('/cart');
      const { data } = response.data;
      
      if (data?.items) {
        const mappedItems = data.items.map(mapCartItem);
        setItems(mappedItems);
        console.log(`[CART] ${mappedItems.length} items cargados desde DB`);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.error('[CART] Error cargando carrito:', err.message);
      setError(err.message || 'Error al cargar carrito');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, setItems]);

  // Agregar item al carrito
  const addItem = useCallback(async (product: Product, quantity = 1) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Optimistic update - agregar localmente primero
      storeAddItem(product, quantity);
      console.log(`[CART] Agregando ${product.name} (optimistic)`);

      // Llamar al backend
      const response = await api.post('/cart/items', {
        productId: product.id,
        quantity,
      });

      console.log('[CART] Item guardado en DB:', response.data);
      
      // Refrescar para obtener datos actualizados (incluyendo stock actualizado)
      await refreshCart();
      
    } catch (err: any) {
      console.error('[CART] Error agregando item:', err.message);
      setError(err.message || 'Error al agregar producto');
      // Revertir cambio optimista
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, storeAddItem, refreshCart]);

  // Actualizar cantidad
  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Optimistic update
      storeUpdateQuantity(itemId, quantity);

      // Llamar al backend
      await api.patch(`/cart/items/${itemId}`, { quantity });
      console.log('[CART] Cantidad actualizada en DB');

    } catch (err: any) {
      console.error('[CART] Error actualizando:', err.message);
      setError(err.message || 'Error al actualizar cantidad');
      await refreshCart(); // Revertir
    } finally {
      setIsLoading(false);
    }
  }, [storeUpdateQuantity, refreshCart]);

  // Remover item
  const removeItem = useCallback(async (itemId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Optimistic update
      storeRemoveItem(itemId);

      // Llamar al backend
      await api.delete(`/cart/items/${itemId}`);
      console.log('[CART] Item removido de DB');

    } catch (err: any) {
      console.error('[CART] Error removiendo:', err.message);
      setError(err.message || 'Error al remover item');
      await refreshCart(); // Revertir
    } finally {
      setIsLoading(false);
    }
  }, [storeRemoveItem, refreshCart]);

  // Vaciar carrito
  const clearCart = useCallback(async () => {
    if (!confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Optimistic update
      storeClearCart();

      // Llamar al backend
      await api.delete('/cart/clear');
      console.log('[CART] Carrito vaciado en DB');

    } catch (err: any) {
      console.error('[CART] Error vaciando:', err.message);
      setError(err.message || 'Error al vaciar carrito');
      await refreshCart(); // Revertir
    } finally {
      setIsLoading(false);
    }
  }, [storeClearCart, refreshCart]);

  // Efecto para cargar carrito al montar o cambiar usuario
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Solo cargar si el userId cambió
      if (userId !== user.id) {
        console.log(`[CART] Usuario cambió a ${user.id}, cargando carrito...`);
        refreshCart();
      }
    }
  }, [isAuthenticated, user?.id, userId, refreshCart]);

  return {
    items,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart,
  };
}
