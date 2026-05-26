export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export function isAdmin(user: User | null | undefined): boolean {
  return user?.role === UserRole.ADMIN;
}

export function isVendor(user: User | null | undefined): boolean {
  return user?.role === UserRole.VENDOR;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}
