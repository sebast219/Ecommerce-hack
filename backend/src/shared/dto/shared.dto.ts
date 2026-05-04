// 🏗️ SHARED DTOs - DTOs Compartidos entre Servidores (CORREGIDO)
// PROPÓSITO: DTOs exportados para consumo en Railway-server.js

// Auth DTOs
export interface RegisterDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
  accessToken: string;
  refreshToken: string;
}

// Product DTOs
export interface GetProductsQueryDto {
  page?: number;
  limit?: number;
  categoryId?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  search?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku: string;
  barcode?: string;
  trackInventory: boolean;
  isActive: boolean;
  images: string[];
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  seoTitle?: string;
  seoDescription?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  licenseType?: string;
  compatibility: string[];
  isPhysical: boolean;
  downloadUrl?: string;
  categoryId: string;
}

export interface UpdateProductDto {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  images?: string[];
  tags?: string[];
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: {
    amount: number;
    currency: string;
  };
  comparePrice?: {
    amount: number;
    currency: string;
  };
  sku: string;
  barcode?: string;
  trackInventory: boolean;
  isActive: boolean;
  images: string[];
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  seoTitle?: string;
  seoDescription?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  licenseType?: string;
  compatibility: string[];
  isPhysical: boolean;
  downloadUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  inventory?: {
    id: string;
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  };
}

// Cart DTOs
export interface AddToCartDto {
  productId: string;
  quantity: number;
  sessionId?: string;
  userId?: string;
}

export interface UpdateCartItemDto {
  cartItemId: string;
  quantity: number;
}

export interface GetCartDto {
  sessionId?: string;
  userId?: string;
}

export interface CartResponse {
  id: string;
  sessionId?: string;
  items: CartItemResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemResponse {
  id: string;
  quantity: number;
  cartId: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    price: {
      amount: number;
      currency: string;
    };
    images: string[];
  };
}

// Category DTOs
export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    products: number;
  };
}

// Response DTOs estándar
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

// Error DTOs
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: any;
  stack?: string; // Solo en desarrollo
}

// Validation DTOs
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResponse {
  success: false;
  message: 'Validation failed';
  errors: ValidationError[];
}

// Exportar para Railway-server.js como objeto de tipos
export const SharedDTOs = {
  // Auth
  RegisterDto: {} as RegisterDto,
  LoginDto: {} as LoginDto,
  RefreshTokenDto: {} as RefreshTokenDto,
  AuthResponse: {} as AuthResponse,

  // Products
  GetProductsQueryDto: {} as GetProductsQueryDto,
  CreateProductDto: {} as CreateProductDto,
  UpdateProductDto: {} as UpdateProductDto,
  ProductResponse: {} as ProductResponse,

  // Cart
  AddToCartDto: {} as AddToCartDto,
  UpdateCartItemDto: {} as UpdateCartItemDto,
  GetCartDto: {} as GetCartDto,
  CartResponse: {} as CartResponse,
  CartItemResponse: {} as CartItemResponse,

  // Categories
  CategoryResponse: {} as CategoryResponse,

  // Responses
  ApiResponse: {} as ApiResponse,
  PaginatedResponse: {} as PaginatedResponse,
  ErrorResponse: {} as ErrorResponse,
  ValidationResponse: {} as ValidationResponse,
  ValidationError: {} as ValidationError,
};
