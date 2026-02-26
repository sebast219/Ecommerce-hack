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
import { CartItem } from '@/types/cart';
import { useCartStore } from '@/store/cart-store';
import { useAuth } from './use-auth';

interface UseCartReturn {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export function useCart(): UseCartReturn {
  // TODO: Obtener estado del store y autenticación
  const { items, addItem: storeAddItem, updateQuantity, removeItem: storeRemoveItem, clearCart: storeClearCart } = useCartStore();
  const { user, isAuthenticated } = useAuth();

  // TODO: Definir estados locales
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implementar función para agregar item
  const addItem = useCallback(async (productId: string, quantity = 1) => {
    // PASO 1: Validar autenticación
    // - Si no está autenticado, redirigir a login
    // - O manejar carrito de invitado
    
    // PASO 2: Iniciar estado de carga
    // - setIsLoading(true)
    // - setError(null)
    
    // PASO 3: Llamar a API del backend
    // - POST /cart/items
    // - Enviar { productId, quantity }
    
    // PASO 4: Actualizar store optimistamente
    // - storeAddItem() con datos locales
    // - Mejora UX con respuesta inmediata
    
    // PASO 5: Sincronizar con backend
    // - Si API falla, revertir cambios
    // - Mostrar error al usuario
    
    console.log('Implementar addItem - Product:', productId, 'Quantity:', quantity);
    
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar llamada real a API
      // const response = await fetch('/api/cart/items', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ productId, quantity })
      // });
      
      // if (!response.ok) throw new Error('Failed to add item');
      
      // const newItem: CartItem = await response.json();
      
      // Actualización optimista (temporal)
      // const mockProduct = { id: productId, name: 'Product Name', price: 99.99 };
      // storeAddItem(mockProduct as any, quantity);
      
    } catch (err: any) {
      setError(err.message || 'Error al agregar producto al carrito');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, storeAddItem]);

  // TODO: Implementar función para actualizar item
  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    // PASO 1: Validar cantidad
    // - quantity > 0
    // - Validar stock máximo
    
    // PASO 2: Llamar a API
    // - PATCH /cart/items/:id
    // - Enviar { quantity }
    
    // PASO 3: Actualizar store
    // - updateQuantity(itemId, quantity)
    // - Actualización optimista
    
    // PASO 4: Manejar errores
    // - Revertir si falla
    // - Mostrar mensaje específico
    
    console.log('Implementar updateItem - Item:', itemId, 'Quantity:', quantity);
    
    if (quantity <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar llamada real
      // const response = await fetch(`/api/cart/items/${itemId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ quantity })
      // });
      
      // if (!response.ok) throw new Error('Failed to update item');
      
      // Actualización optimista
      updateQuantity(itemId, quantity);
      
    } catch (err: any) {
      setError(err.message || 'Error al actualizar item');
    } finally {
      setIsLoading(false);
    }
  }, [updateQuantity]);

  // TODO: Implementar función para remover item
  const removeItem = useCallback(async (itemId: string) => {
    // PASO 1: Confirmar acción (opcional)
    // - Mostrar modal de confirmación
    // - Permitir cancelación
    
    // PASO 2: Llamar a API
    // - DELETE /cart/items/:id
    
    // PASO 3: Actualizar store
    // - storeRemoveItem(itemId)
    // - Remoción optimista
    
    // PASO 4: Manejar errores
    // - Revertir si falla
    // - Notificar al usuario
    
    console.log('Implementar removeItem - Item:', itemId);
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar llamada real
      // const response = await fetch(`/api/cart/items/${itemId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      // if (!response.ok) throw new Error('Failed to remove item');
      
      // Remoción optimista
      storeRemoveItem(itemId);
      
    } catch (err: any) {
      setError(err.message || 'Error al remover item');
    } finally {
      setIsLoading(false);
    }
  }, [storeRemoveItem]);

  // TODO: Implementar función para vaciar carrito
  const clearCart = useCallback(async () => {
    // PASO 1: Confirmar acción
    // - Modal: "¿Estás seguro de vaciar el carrito?"
    // - Listar items a eliminar
    
    // PASO 2: Llamar a API
    // - DELETE /cart
    
    // PASO 3: Limpiar store
    // - storeClearCart()
    // - Limpiar estado local
    
    console.log('Implementar clearCart');
    
    if (!confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar llamada real
      // const response = await fetch('/api/cart', {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      // if (!response.ok) throw new Error('Failed to clear cart');
      
      storeClearCart();
      
    } catch (err: any) {
      setError(err.message || 'Error al vaciar el carrito');
    } finally {
      setIsLoading(false);
    }
  }, [storeClearCart]);

  // TODO: Implementar función para refrescar carrito
  const refreshCart = useCallback(async () => {
    // PASO 1: Llamar a API
    // - GET /cart
    // - Obtener estado actual del servidor
    
    // PASO 2: Sincronizar store
    // - Comparar con estado local
    // - Actualizar diferencias
    
    // PASO 3: Recalcular resumen
    // - Totales, impuestos, etc.
    
    console.log('Implementar refreshCart');
    
    if (!isAuthenticated) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar llamada real
      // const response = await fetch('/api/cart', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      // if (!response.ok) throw new Error('Failed to refresh cart');
      
      // const cartData: CartSummary = await response.json();
      // setSummary(cartData);
      
      // Sincronizar items con store
      // items.forEach(item => {
      //   // Lógica de sincronización
      // });
      
    } catch (err: any) {
      setError(err.message || 'Error al sincronizar carrito');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // TODO: Implementar efecto de sincronización inicial
  useEffect(() => {
    // PASO 1: Cargar carrito al montar
    // - Si usuario autenticado
    // - refreshCart()
    
    // PASO 2: Sincronizar periódicamente
    // - Opcional: cada 5 minutos
    // - Para mantener consistencia
    
    // PASO 3: Limpiar al desmontar
    // - Cancelar requests pendientes
    
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated, refreshCart]);

  // TODO: Calcular resumen del carrito
  useEffect(() => {
    // PASO 1: Calcular subtotal
    // - items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    // PASO 2: Calcular impuestos
    // - Basado en ubicación o tasa fija
    // - Ejemplo: 16% IVA
    
    // PASO 3: Calcular total
    // - subtotal + taxes + shipping
    
    // PASO 4: Actualizar estado
    // - setSummary() con cálculos
    
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const taxes = subtotal * 0.16; // 16% IVA
    const total = subtotal + taxes;
  }, [items]);

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
