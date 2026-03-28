'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir a la página principal
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // No renderizar nada mientras se verifica (evita flash de formulario)
  if (isAuthenticated) {
    return null;
  }

  return children;
}
