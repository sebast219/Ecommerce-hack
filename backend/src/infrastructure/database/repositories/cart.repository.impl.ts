// 🏗️ INFRASTRUCTURE REPOSITORIES IMPLEMENTATIONS - Carrito
// PROPÓSITO: Implementar interfaces de carrito usando Prisma

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  Cart,
  CartItem,
  WishlistItem,
  ProductReview,
  RefreshToken,
} from '../../../domain/entities/cart.entity';
import {
  ICartRepository,
  ICartItemRepository,
  IWishlistRepository,
  IProductReviewRepository,
  IRefreshTokenRepository,
} from '../../../domain/repositories/cart.repository.interface';

@Injectable()
export class CartRepositoryImpl implements ICartRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Cart | null> {
    const prismaCart = await this.prisma.cart.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    return prismaCart ? this.mapPrismaCartToCart(prismaCart) : null;
  }

  async findBySessionId(sessionId: string): Promise<Cart | null> {
    const prismaCart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: true,
      },
    });

    return prismaCart ? this.mapPrismaCartToCart(prismaCart) : null;
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    // Buscar cart items de este usuario para obtener el cartId
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { userId },
      select: { cartId: true },
    });

    if (!cartItem) {
      return null;
    }

    // Obtener el carrito completo con todos sus items
    const prismaCart = await this.prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return prismaCart ? this.mapPrismaCartToCart(prismaCart) : null;
  }

  async create(cartData: { sessionId?: string }): Promise<Cart> {
    const prismaCart = await this.prisma.cart.create({
      data: {
        sessionId: cartData.sessionId,
      },
      include: {
        items: true,
      },
    });

    return this.mapPrismaCartToCart(prismaCart);
  }

  async update(id: string, cartData: Partial<Cart>): Promise<Cart> {
    const prismaCart = await this.prisma.cart.update({
      where: { id },
      data: {
        sessionId: cartData.sessionId,
      },
      include: {
        items: true,
      },
    });

    return this.mapPrismaCartToCart(prismaCart);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cart.delete({
      where: { id },
    });
  }

  async findOrCreateCart(sessionId?: string, userId?: string): Promise<Cart> {
    let cart = await this.findBySessionId(sessionId || '');

    if (!cart) {
      cart = await this.create({
        sessionId,
      });
    }

    return cart;
  }

  async findCartWithItems(cartId: string): Promise<Cart | null> {
    const prismaCart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return prismaCart ? this.mapPrismaCartToCart(prismaCart) : null;
  }

  async clearCart(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async existsBySessionId(sessionId: string): Promise<boolean> {
    const cart = await this.prisma.cart.findUnique({
      where: { sessionId },
      select: { id: true },
    });

    return !!cart;
  }

  private mapPrismaCartToCart(prismaCart: any): Cart {
    return {
      id: prismaCart.id,
      sessionId: prismaCart.sessionId,
      items: prismaCart.items.map((item: any) => this.mapPrismaCartItemToCartItem(item)),
      createdAt: prismaCart.createdAt,
      updatedAt: prismaCart.updatedAt,
    };
  }

  private mapPrismaCartItemToCartItem(prismaCartItem: any): CartItem {
    return {
      id: prismaCartItem.id,
      quantity: prismaCartItem.quantity,
      cartId: prismaCartItem.cartId,
      productId: prismaCartItem.productId,
      userId: prismaCartItem.userId,
    };
  }
}

@Injectable()
export class CartItemRepositoryImpl implements ICartItemRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CartItem | null> {
    const prismaItem = await this.prisma.cartItem.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    return prismaItem ? this.mapPrismaCartItemToCartItem(prismaItem) : null;
  }

  async create(itemData: Omit<CartItem, 'id'>): Promise<CartItem> {
    const prismaItem = await this.prisma.cartItem.create({
      data: {
        cartId: itemData.cartId,
        productId: itemData.productId,
        quantity: itemData.quantity,
        userId: itemData.userId,
      },
      include: {
        product: true,
      },
    });

    return this.mapPrismaCartItemToCartItem(prismaItem);
  }

  async update(id: string, itemData: Partial<CartItem>): Promise<CartItem> {
    const prismaItem = await this.prisma.cartItem.update({
      where: { id },
      data: {
        quantity: itemData.quantity,
      },
      include: {
        product: true,
      },
    });

    return this.mapPrismaCartItemToCartItem(prismaItem);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cartItem.delete({
      where: { id },
    });
  }

  async findByCartId(cartId: string): Promise<CartItem[]> {
    const prismaItems = await this.prisma.cartItem.findMany({
      where: { cartId },
      include: {
        product: true,
      },
    });

    return prismaItems.map((item) => this.mapPrismaCartItemToCartItem(item));
  }

  async findByProductId(productId: string): Promise<CartItem[]> {
    const prismaItems = await this.prisma.cartItem.findMany({
      where: { productId },
      include: {
        product: true,
      },
    });

    return prismaItems.map((item) => this.mapPrismaCartItemToCartItem(item));
  }

  async findByCartAndProduct(cartId: string, productId: string): Promise<CartItem | null> {
    const prismaItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      include: {
        product: true,
      },
    });

    return prismaItem ? this.mapPrismaCartItemToCartItem(prismaItem) : null;
  }

  async updateQuantity(itemId: string, quantity: number): Promise<CartItem> {
    const prismaItem = await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true,
      },
    });

    return this.mapPrismaCartItemToCartItem(prismaItem);
  }

  async deleteByCartId(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async getCartTotal(cartId: string): Promise<number> {
    const items = await this.prisma.cartItem.findMany({
      where: { cartId },
      include: {
        product: true,
      },
    });

    return items.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);
  }

  async getCartItemCount(cartId: string): Promise<number> {
    const result = await this.prisma.cartItem.aggregate({
      where: { cartId },
      _sum: {
        quantity: true,
      },
    });

    return result._sum.quantity || 0;
  }

  private mapPrismaCartItemToCartItem(prismaCartItem: any): CartItem {
    return {
      id: prismaCartItem.id,
      quantity: prismaCartItem.quantity,
      cartId: prismaCartItem.cartId,
      productId: prismaCartItem.productId,
      userId: prismaCartItem.userId,
    };
  }
}

@Injectable()
export class RefreshTokenRepositoryImpl implements IRefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<RefreshToken | null> {
    const prismaToken = await this.prisma.refreshToken.findUnique({
      where: { id },
    });

    return prismaToken ? this.mapPrismaRefreshTokenToRefreshToken(prismaToken) : null;
  }

  async create(tokenData: Omit<RefreshToken, 'id' | 'createdAt'>): Promise<RefreshToken> {
    const prismaToken = await this.prisma.refreshToken.create({
      data: {
        token: tokenData.token,
        userId: tokenData.userId,
        expiresAt: tokenData.expiresAt,
      },
    });

    return this.mapPrismaRefreshTokenToRefreshToken(prismaToken);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { id },
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const prismaToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    return prismaToken ? this.mapPrismaRefreshTokenToRefreshToken(prismaToken) : null;
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const prismaTokens = await this.prisma.refreshToken.findMany({
      where: { userId },
    });

    return prismaTokens.map((token) => this.mapPrismaRefreshTokenToRefreshToken(token));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  async isValidToken(token: string): Promise<boolean> {
    const prismaToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!prismaToken) {
      return false;
    }

    return prismaToken.expiresAt > new Date();
  }

  async isTokenExpired(token: string): Promise<boolean> {
    const prismaToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!prismaToken) {
      return true;
    }

    return prismaToken.expiresAt < new Date();
  }

  private mapPrismaRefreshTokenToRefreshToken(prismaToken: any): RefreshToken {
    return {
      id: prismaToken.id,
      token: prismaToken.token,
      userId: prismaToken.userId,
      expiresAt: prismaToken.expiresAt,
      createdAt: prismaToken.createdAt,
    };
  }
}
