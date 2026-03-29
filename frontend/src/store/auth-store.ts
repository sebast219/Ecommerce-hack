import { create } from 'zustand';

import { persist } from 'zustand/middleware';

import { User } from '@/types/auth';



interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}



export const useAuthStore = create<AuthStore>()(

  persist(

    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,
      login: async (email: string, password: string) => {

        try {

          const response = await fetch('/api/auth/login', {

            method: 'POST',

            headers: {

              'Content-Type': 'application/json',

            },

            body: JSON.stringify({ email, password }),

          });

          if (!response.ok) {

            throw new Error('Login failed');

          }

          const data = await response.json();
          
          // Handle deeply nested backend response
          // Response structure: { success: true, data: { success: true, data: { user, accessToken, refreshToken }, message }, message }
          const innerData = data.data?.data || data.data;
          const userData = innerData?.user || innerData;
          const accessToken = innerData?.accessToken || data.data?.accessToken;
          const refreshToken = innerData?.refreshToken || data.data?.refreshToken;

          set({

            user: userData,

            token: accessToken,

            refreshToken: refreshToken,

            isAuthenticated: true,

          });

          // Sincronizar carrito con el nuevo usuario
          setTimeout(() => {
            const { syncWithUser } = require('./cart-store').useCartStore.getState();
            syncWithUser(userData?.id || null);
          }, 0);

        } catch (error) {

          throw error;

        }

      },

      

      register: async (userData: { firstName: string; lastName: string; email: string; password: string }) => {

        try {

          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Register failed');
          }

          const data = await response.json();
          
          // Auto-login after successful registration
          set({
            user: data.data || data.user,
            token: data.access_token || data.data?.accessToken,
            refreshToken: data.refresh_token || data.data?.refreshToken,
            isAuthenticated: true,
          });
          
          // Sincronizar carrito con el nuevo usuario
          setTimeout(() => {
            const userId = (data.data || data.user)?.id;
            const { syncWithUser } = require('./cart-store').useCartStore.getState();
            syncWithUser(userId || null);
          }, 0);
        } catch (error: any) {
          throw new Error(error.message || 'Error al registrarse');
        }
      },

      

      logout: () => {
        // Sincronizar carrito antes de cerrar sesión (cambiar a guest)
        const { syncWithUser } = require('./cart-store').useCartStore.getState();
        syncWithUser(null);
        
        set({

          user: null,

          token: null,

          refreshToken: null,

          isAuthenticated: false,

        });

      },

      

      setUser: (user: User) => {

        set({ user });

      },

      

      setTokens: (accessToken: string, refreshToken: string) => {

        set({

          token: accessToken,

          refreshToken,

        });

      },

    }),

    {
      name: 'auth-storage',
      // Persist user session data
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }

  )

);

