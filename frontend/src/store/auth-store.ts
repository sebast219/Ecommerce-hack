import { create } from 'zustand';

import { persist } from 'zustand/middleware';

import { User, UserRole } from '@/types/auth';
import { tokenManager } from '@/lib/token-manager';
import { apiClient } from '@/lib/api-client';

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  fetchProfile: () => Promise<User | null>;
}



export const useAuthStore = create<AuthStore>()(

  persist(

    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,
      isLoading: false,
      isAdmin: false,
      login: async (email: string, password: string) => {

        try {

          const response = await apiClient.post<any>('/auth/login', { email, password });

          // Handle deeply nested backend response
          const innerData = response.data?.data || response.data;
          const userData = innerData?.user || innerData;
          const accessToken = innerData?.accessToken || response.data?.accessToken;
          const refreshToken = innerData?.refreshToken || response.data?.refreshToken;

          // Save to localStorage for apiClient via TokenManager
          if (typeof window !== 'undefined' && accessToken && refreshToken) {
            tokenManager.setTokens(accessToken, refreshToken);
          }

          set({
            user: userData,
            token: accessToken,
            refreshToken: refreshToken,
            isAuthenticated: true,
            isAdmin: userData?.role === UserRole.ADMIN,
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
          const response = await apiClient.post<any>('/auth/register', userData);

          // Auto-login after successful registration
          const accessToken = response.data?.access_token || response.data?.accessToken;
          const refreshToken = response.data?.refresh_token || response.data?.refreshToken;
          
          // Save to localStorage for apiClient via TokenManager
          if (typeof window !== 'undefined' && accessToken && refreshToken) {
            tokenManager.setTokens(accessToken, refreshToken);
          }
          
          const registeredUser = response.data?.data?.user || response.data?.data || response.data?.user;
          set({
            user: registeredUser,
            token: accessToken,
            refreshToken: refreshToken,
            isAuthenticated: true,
            isAdmin: registeredUser?.role === UserRole.ADMIN,
          });
          
          // Sincronizar carrito con el nuevo usuario
          setTimeout(() => {
            const userId = (response.data?.data || response.data?.user)?.id;
            const { syncWithUser } = require('./cart-store').useCartStore.getState();
            syncWithUser(userId || null);
          }, 0);
        } catch (error: any) {
          throw new Error(error.message || 'Error al registrarse');
        }
      },

      

      logout: () => {

        // Clear tokens from localStorage via TokenManager
        if (typeof window !== 'undefined') {
          tokenManager.clearTokens();
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

      

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user, isAdmin: user?.role === UserRole.ADMIN });
      },

      fetchProfile: async () => {
        try {
          const response = await apiClient.get<User>('/users/me');
          const user = response.data;
          set({ user, isAuthenticated: true, isAdmin: user?.role === UserRole.ADMIN });
          return user;
        } catch {
          set({ user: null, isAuthenticated: false, isAdmin: false });
          return null;
        }
      },

      

      setTokens: (accessToken: string, refreshToken: string) => {

        // Save to localStorage for apiClient via TokenManager
        if (typeof window !== 'undefined') {
          tokenManager.setTokens(accessToken, refreshToken);
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
          // Sync persisted tokens to tokenManager for apiClient
          if (state.token && state.refreshToken) {
            tokenManager.setTokens(state.token, state.refreshToken);
          }
        }
      },
    }

  )

);

