// CART STORE - EJERCICIO PRÁCTICO
// OBJETIVO: Aprender a manejar estado global con Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/cart';

// TODO: Define la interfaz de tu store
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      // TODO: Implementa addItem paso a paso
      addItem: (product: Product, quantity = 1) => {
        // PASO 1: Verificar si el producto ya existe en el carrito
        // - Usa find() para buscar el item por product.id
        // - const existingItem = state.items.find(...)
        
        // PASO 2: Si existe, actualizar cantidad
        // - Usa map() para actualizar el item existente
        // - Si no existe, agregar nuevo item al array
        
        // PASO 3: Actualizar el estado con set()
        // - Ejemplo: set((state) => ({ items: [...] }))
        
        console.log('Implementar addItem - Product:', product.name, 'Quantity:', quantity);
      },
      
      // TODO: Implementa removeItem
      removeItem: (id: string) => {
        // PASO 1: Filtrar el array para remover el item
        // - Usa filter() para excluir el item con el id especificado
        // - Ejemplo: items.filter(item => item.id !== id)
        
        console.log('Implementar removeItem - ID:', id);
      },
      
      // TODO: Implementa updateQuantity
      updateQuantity: (id: string, quantity: number) => {
        // PASO 1: Encontrar y actualizar el item
        // - Usa map() para encontrar el item y actualizar su cantidad
        // - Validar que quantity > 0
        
        console.log('Implementar updateQuantity - ID:', id, 'Quantity:', quantity);
      },
      
      // TODO: Implementa clearCart
      clearCart: () => {
        // PASO 1: Limpiar el array de items
        // - Ejemplo: set({ items: [] })
        
        console.log('Implementar clearCart');
      },
      
      // TODO: Implementa getTotal
      getTotal: () => {
        // PASO 1: Calcular el total del carrito
        // - Usa reduce() para sumar (price * quantity) de cada item
        // - Ejemplo: get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
        
        console.log('Implementar getTotal');
        return 0; // Temporal
      },
      
      // TODO: Implementa getItemCount
      getItemCount: () => {
        // PASO 1: Contar el total de items en el carrito
        // - Usa reduce() para sumar las cantidades
        // - Ejemplo: get().items.reduce((total, item) => total + item.quantity, 0)
        
        console.log('Implementar getItemCount');
        return 0; // Temporal
      },
    }),
    {
      name: 'cart-storage', // Nombre en localStorage
    }
  )
);
