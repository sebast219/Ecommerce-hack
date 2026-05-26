import { type ClassValue, clsx } from 'clsx';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? '';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getAvatarUrl(avatarPath: string | null | undefined): string | null {
  if (!avatarPath) return null;
  if (avatarPath.startsWith('http')) return avatarPath;
  return `${API_BASE}${avatarPath}`;
}
