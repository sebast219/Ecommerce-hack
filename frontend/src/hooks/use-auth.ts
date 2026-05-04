'use client';

import { create } from 'zustand';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const response = await apiClient.post<{
          user: User;
          accessToken: string;
          refreshToken: string;
        }>('/auth/login', { email, password });

        apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
        setUser(response.data.user);
        toast.success('¡Bienvenido de nuevo!');
        router.push('/');
        return { success: true };
      } catch (error: any) {
        toast.error(error.message || 'Error al iniciar sesión');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [router, setUser, setLoading],
  );

  const register = useCallback(
    async (data: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    }) => {
      setLoading(true);
      try {
        const response = await apiClient.post<{
          user: User;
          accessToken: string;
          refreshToken: string;
        }>('/auth/register', data);

        apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
        setUser(response.data.user);
        toast.success('¡Cuenta creada exitosamente!');
        router.push('/');
        return { success: true };
      } catch (error: any) {
        toast.error(error.message || 'Error al registrarse');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [router, setUser, setLoading],
  );

  const logout = useCallback(() => {
    apiClient.clearTokens();
    setUser(null);
    toast.success('Sesión cerrada');
    router.push('/auth/login');
  }, [router, setUser]);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await apiClient.get<User>('/users/me');
      setUser(response.data);
      return response.data;
    } catch {
      setUser(null);
      return null;
    }
  }, [setUser]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    fetchProfile,
  };
}
