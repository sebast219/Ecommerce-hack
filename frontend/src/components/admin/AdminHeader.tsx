'use client';

import { ReactNode } from 'react';
import { Menu } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  badge?: string;
  count?: number;
}

export default function AdminHeader({ 
  title, 
  subtitle, 
  actions, 
  badge = 'Panel de Administración',
  count 
}: AdminHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Menu className="h-6 w-6 lg:hidden text-zinc-900" />
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {badge}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mt-2">{title}</h1>
        {subtitle && (
          <p className="text-gray-500 mt-1">
            {subtitle}
            {count !== undefined && ` (${count})`}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}
