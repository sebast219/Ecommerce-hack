/**
 * USE AUTH HOOK - EJERCICIO PRÁCTICO
 * 
 * CONCEPTOS QUE APRENDERÁS:
 * - Custom Hooks: Creación de hooks personalizados en React
 * - State Management: Manejo de estado de autenticación
 * - Side Effects: useEffect para operaciones asíncronas
 * - Error Handling: Manejo centralizado de errores
 * - Local Storage: Persistencia de sesión
 * 
 * RECURSOS DE APRENDIZAJE:
 * - React Hooks: https://reactjs.org/docs/hooks-intro.html
 * - Custom Hooks: https://reactjs.org/docs/hooks-custom.html
 * - Authentication Patterns: https://www.patterns.dev/posts/authpatterns/
 */

import { useState, useEffect, useCallback } from 'react';
import { User, LoginResponse } from '@/types/auth';
import { useAuthStore } from '@/store/auth-store';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  // TODO: Obtener estado global del store
  const { 
    user, 
    token, 
    isAuthenticated, 
    login: storeLogin, 
    logout: storeLogout,
    setUser,
    setTokens 
  } = useAuthStore();

  // TODO: Definir estados locales
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implementar función de login
  const login = useCallback(async (email: string, password: string) => {
    // PASO 1: Iniciar estado de carga
    // - setIsLoading(true)
    // - setError(null)
    // - Limpiar errores previos
    
    // PASO 2: Llamar a la API de login
    // - Usa fetch o axios para POST /auth/login
    // - Envía { email, password }
    
    // PASO 3: Manejar respuesta exitosa
    // - Extraer user, access_token, refresh_token
    // - Actualizar store con setUser() y setTokens()
    // - Guardar tokens en localStorage
    
    // PASO 4: Manejar errores
    // - Si falla, setError(message)
    // - Mostrar error amigable al usuario
    
    // PASO 5: Finalizar carga
    // - setIsLoading(false)
    
    console.log('Implementar login - Email:', email);
    
    // Código temporal para que funcione
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Reemplazar con llamada real a API
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      
      // if (!response.ok) throw new Error('Login failed');
      
      // const data: LoginResponse = await response.json();
      // storeLogin(data);
      
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  }, [storeLogin, setUser, setTokens]);

  // TODO: Implementar función de registro
  const register = useCallback(async (userData: any) => {
    // PASO 1: Iniciar carga
    // - setIsLoading(true)
    // - setError(null)
    
    // PASO 2: Llamar a API de registro
    // - POST /auth/register
    // - Enviar datos del usuario
    
    // PASO 3: Procesar respuesta
    // - Si exitoso, hacer login automático
    // - O requerir verificación por email
    
    // PASO 4: Manejar errores
    // - Email ya existe, validación fallida, etc.
    
    console.log('Implementar register - User:', userData.email);
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar llamada real
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });
      
      // if (!response.ok) throw new Error('Registration failed');
      
      // const data: LoginResponse = await response.json();
      // storeLogin(data);
      
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  }, [storeLogin]);

  // TODO: Implementar función de logout
  const logout = useCallback(() => {
    // PASO 1: Limpiar store
    // - storeLogout()
    // - Limpiar estado global
    
    // PASO 2: Limpiar localStorage
    // - Remover tokens
    // - Limpiar datos de sesión
    
    // PASO 3: Redirigir
    // - window.location.href = '/login'
    // - O usar router de Next.js
    
    console.log('Implementar logout');
    storeLogout();
    
    // TODO: Limpiar localStorage
    // localStorage.removeItem('access_token');
    // localStorage.removeItem('refresh_token');
    
    // TODO: Redirigir a login
    // router.push('/login');
  }, [storeLogout]);

  // TODO: Implementar refresh de token
  const refreshToken = useCallback(async () => {
    // PASO 1: Obtener refresh token
    // - De localStorage o store
    
    // PASO 2: Llamar a API de refresh
    // - POST /auth/refresh
    // - Enviar refresh_token
    
    // PASO 3: Actualizar tokens
    // - setTokens() con nuevos tokens
    // - Guardar en localStorage
    
    // PASO 4: Manejar errores
    // - Si refresh falla, hacer logout
    // - Token expirado permanentemente
    
    console.log('Implementar refreshToken');
    
    try {
      // TODO: Implementar llamada real
      // const response = await fetch('/api/auth/refresh', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ refreshToken })
      // });
      
      // if (!response.ok) {
      //   logout();
      //   return;
      // }
      
      // const data = await response.json();
      // setTokens(data.access_token, data.refresh_token);
      
    } catch (err) {
      logout();
    }
  }, [logout, setTokens]);

  // TODO: Implementar efecto de inicialización
  useEffect(() => {
    // PASO 1: Verificar tokens existentes
    // - Leer localStorage
    // - Validar si hay tokens guardados
    
    // PASO 2: Restaurar sesión
    // - Si hay tokens, verificar validez
    // - Llamar a /auth/profile para obtener datos
    
    // PASO 3: Manejar sesión inválida
    // - Si tokens inválidos, limpiar
    // - Redirigir a login
    
    console.log('Verificar sesión existente');
    
    // TODO: Implementar verificación real
    // const savedToken = localStorage.getItem('access_token');
    // if (savedToken) {
    //   // Verificar token y obtener datos del usuario
    // }
  }, [setUser]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    refreshToken,
  };
}
