import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types/cart';

interface CartStore {
  items: CartItem[];
  userId: string | null;
  setUserId: (userId: string | null) => void;
  setItems: (items: CartItem[]) => void;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  syncWithUser: (userId: string | null) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Storage key generator based on userId
const getStorageKey = (userId: string | null) => {
  return userId ? `cart-storage-${userId}` : 'cart-storage-guest';
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,

      setUserId: (userId: string | null) => {
        set({ userId });
      },

      setItems: (items: CartItem[]) => {
        set({ items });
      },

      // Sync cart when user changes (login/logout)
      syncWithUser: (newUserId: string | null) => {
        const { userId: currentUserId, items } = get();
        
        // If user changed
        if (newUserId !== currentUserId) {
          console.log(`[CART] User changed from ${currentUserId || 'guest'} to ${newUserId || 'guest'}`);
          
          // Save current cart to old user key before switching
          if (currentUserId) {
            localStorage.setItem(getStorageKey(currentUserId), JSON.stringify({ state: { items, userId: currentUserId } }));
          }
          
          // Try to load cart for new user
          const newUserCart = localStorage.getItem(getStorageKey(newUserId));
          if (newUserCart) {
            const parsed = JSON.parse(newUserCart);
            set({ items: parsed.state?.items || [], userId: newUserId });
          } else {
            // No cart for this user, start fresh
            set({ items: [], userId: newUserId });
          }
        }
      },

      addItem: (product: Product, quantity = 1) => {
        const { items, userId } = get();
        
        console.log(`[CART] Adding item for user ${userId || 'guest'}:`, product.name);
        
        const existingItem = items.find((item) => item.product.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: generateId(),
            product,
            quantity,
            addedAt: new Date().toISOString(),
          };
          set({ items: [...items, newItem] });
        }
      },

      updateQuantity: (itemId: string, quantity: number) => {
        const { items } = get();
        if (quantity <= 0) {
          set({ items: items.filter((item) => item.id !== itemId) });
        } else {
          set({
            items: items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          });
        }
      },

      removeItem: (itemId: string) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== itemId) });
      },

      clearCart: () => {
        const { userId } = get();
        console.log(`[CART] Clearing cart for user ${userId || 'guest'}`);
        set({ items: [] });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = typeof item.product.price === 'number' 
            ? item.product.price 
            : item.product.price?.amount || 0;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
