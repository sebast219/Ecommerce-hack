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

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {

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

          // Save to localStorage for apiClient
          if (typeof window !== 'undefined' && accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
          }

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
        console.log('=== FRONTEND REGISTER DEBUG ===');
        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
        console.log('User data being sent:', userData);
        
        try {
          const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`;
          console.log('Full URL:', fullUrl);
          
          const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
          
          console.log('Response status:', response.status);
          console.log('Response ok:', response.ok);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Register failed');
          }

          const data = await response.json();
          
          // Auto-login after successful registration
          const accessToken = data.access_token || data.data?.accessToken;
          const refreshToken = data.refresh_token || data.data?.refreshToken;
          
          // Save to localStorage for apiClient
          if (typeof window !== 'undefined' && accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
          }
          
          set({
            user: data.data || data.user,
            token: accessToken,
            refreshToken: refreshToken,
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

        // Clear tokens from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }

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

        // Save to localStorage for apiClient
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }

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

