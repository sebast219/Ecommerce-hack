// 🏗️ DOMAIN REPOSITORIES INTERFACES - Contratos de carrito
// PROPÓSITO: Definir cómo la capa de dominio interactúa con carritos

import {
  Cart,
  CartItem,
  WishlistItem,
  ProductReview,
  RefreshToken,
} from '../entities/cart.entity';

export interface ICartRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<Cart | null>;
  findBySessionId(sessionId: string): Promise<Cart | null>;
  create(cartData: Omit<Cart, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cart>;
  update(id: string, cartData: Partial<Cart>): Promise<Cart>;
  delete(id: string): Promise<void>;

  // Métodos específicos
  findOrCreateCart(sessionId?: string, userId?: string): Promise<Cart>;
  findCartWithItems(cartId: string): Promise<Cart | null>;
  clearCart(cartId: string): Promise<void>;
  
  // Métodos de existencia
  existsBySessionId(sessionId: string): Promise<boolean>;
}

export interface ICartItemRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<CartItem | null>;
  create(itemData: Omit<CartItem, 'id'>): Promise<CartItem>;
  update(id: string, itemData: Partial<CartItem>): Promise<CartItem>;
  delete(id: string): Promise<void>;

  // Métodos específicos
  findByCartId(cartId: string): Promise<CartItem[]>;
  findByProductId(productId: string): Promise<CartItem[]>;
  findByCartAndProduct(cartId: string, productId: string): Promise<CartItem | null>;
  updateQuantity(itemId: string, quantity: number): Promise<CartItem>;
  deleteByCartId(cartId: string): Promise<void>;
  
  // Métodos de consulta
  getCartTotal(cartId: string): Promise<number>;
  getCartItemCount(cartId: string): Promise<number>;
}

export interface IWishlistRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<WishlistItem | null>;
  create(itemData: Omit<WishlistItem, 'id'>): Promise<WishlistItem>;
  delete(id: string): Promise<void>;

  // Métodos específicos
  findByUserId(userId: string): Promise<WishlistItem[]>;
  findByProductId(productId: string): Promise<WishlistItem[]>;
  findByUserAndProduct(userId: string, productId: string): Promise<WishlistItem | null>;
  deleteByUserId(userId: string): Promise<void>;
}

export interface IProductReviewRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<ProductReview | null>;
  create(reviewData: Omit<ProductReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductReview>;
  update(id: string, reviewData: Partial<ProductReview>): Promise<ProductReview>;
  delete(id: string): Promise<void>;

  // Métodos específicos
  findByProductId(productId: string): Promise<ProductReview[]>;
  findByUserId(userId: string): Promise<ProductReview[]>;
  findByUserAndProduct(userId: string, productId: string): Promise<ProductReview | null>;
  findVerifiedReviews(): Promise<ProductReview[]>;
  
  // Métodos de consulta
  getProductAverageRating(productId: string): Promise<number>;
  getProductReviewCount(productId: string): Promise<number>;
}

export interface IRefreshTokenRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<RefreshToken | null>;
  create(tokenData: Omit<RefreshToken, 'id' | 'createdAt'>): Promise<RefreshToken>;
  delete(id: string): Promise<void>;

  // Métodos específicos
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpiredTokens(): Promise<void>;
  
  // Métodos de validación
  isValidToken(token: string): Promise<boolean>;
  isTokenExpired(token: string): Promise<boolean>;
}
