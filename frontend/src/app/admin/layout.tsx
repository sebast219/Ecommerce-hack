'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import MobileMenu from '@/components/admin/MobileMenu';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4 text-zinc-500">
          <div className="h-8 w-8 border-4 border-gray-200 border-t-zinc-900 rounded-full animate-spin" />
          <span className="text-sm font-medium animate-pulse">Preparando entorno seguro...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Sidebar user={user} onLogout={handleLogout} activeRoute={pathname} />
      <MobileMenu user={user} onLogout={handleLogout} activeRoute={pathname} />
      <main className="lg:ml-64 lg:mt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}
