// 🏗️ DOMAIN ENTITIES - Entidad de Carrito
// PROPÓSITO: Definir las reglas de negocio y datos centrales de carritos

import { Product } from './product.entity';
import { User } from './user.entity';

export interface Cart {
  id: string;
  sessionId?: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  quantity: number;
  cartId: string;
  cart?: Cart;
  productId: string;
  product?: Product;
  userId?: string;
  user?: User;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product?: Product;
  userId: string;
  user?: User;
  createdAt: Date;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment?: string;
  pros?: string;
  cons?: string;
  isVerified: boolean;
  productId: string;
  product?: Product;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  user?: User;
  expiresAt: Date;
  
  createdAt: Date;
}

// Value Objects
export class CartItemQuantity {
  constructor(public readonly value: number) {
    this.validate();
  }

  private validate(): void {
    if (this.value < 1) {
      throw new Error('Quantity must be at least 1');
    }
    if (this.value > 999) {
      throw new Error('Quantity cannot exceed 999');
    }
  }

  static create(quantity: number): CartItemQuantity {
    return new CartItemQuantity(quantity);
  }

  add(amount: number): CartItemQuantity {
    return new CartItemQuantity(this.value + amount);
  }

  subtract(amount: number): CartItemQuantity {
    const newQuantity = this.value - amount;
    if (newQuantity < 1) {
      throw new Error('Cannot reduce quantity below 1');
    }
    return new CartItemQuantity(newQuantity);
  }
}

export class ReviewRating {
  constructor(public readonly value: number) {
    this.validate();
  }

  private validate(): void {
    if (this.value < 1 || this.value > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
  }

  static create(rating: number): ReviewRating {
    return new ReviewRating(rating);
  }
}
