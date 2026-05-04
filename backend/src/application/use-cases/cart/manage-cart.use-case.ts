// 🏗️ APPLICATION USE CASES - Gestión de Carrito
// PROPÓSITO: Casos de uso para gestión de carrito de compras

import { Cart, CartItem } from '../../../domain/entities/cart.entity';
import { Product } from '../../../domain/entities/product.entity';
import { ICartRepository } from '../../../domain/repositories/cart.repository.interface';
import { ICartItemRepository } from '../../../domain/repositories/cart.repository.interface';
import { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { Inject } from '@nestjs/common';
import {
  CART_REPOSITORY,
  CART_ITEM_REPOSITORY,
} from '../../../domain/repositories/cart.repository.interface';
import { PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository.interface';

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  sessionId?: string;
  userId?: string;
}

export interface AddToCartResponse {
  cart: Cart;
  message: string;
}

export class AddToCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
    @Inject(CART_ITEM_REPOSITORY)
    private readonly cartItemRepository: ICartItemRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(request: AddToCartRequest): Promise<AddToCartResponse> {
    const { productId, quantity, sessionId, userId } = request;

    // Validar cantidad
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    if (quantity > 999) {
      throw new Error('Quantity cannot exceed 999');
    }

    // Verificar producto
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    if (!product.isActive) {
      throw new Error('Product is not active');
    }

    // Verificar stock
    const hasStock = await this.productRepository.checkStock(
      productId,
      quantity,
    );
    if (!hasStock) {
      throw new Error('Insufficient stock');
    }

    // Obtener o crear carrito
    const cart = await this.cartRepository.findOrCreateCart(sessionId, userId);

    // Verificar si el item ya existe en el carrito
    const existingItem = await this.cartItemRepository.findByCartAndProduct(
      cart.id,
      productId,
    );

    if (existingItem) {
      // Actualizar cantidad
      const newQuantity = existingItem.quantity + quantity;
      const hasStockForUpdate = await this.productRepository.checkStock(
        productId,
        newQuantity,
      );
      if (!hasStockForUpdate) {
        throw new Error('Insufficient stock for requested quantity');
      }

      await this.cartItemRepository.updateQuantity(
        existingItem.id,
        newQuantity,
      );
    } else {
      // Crear nuevo item
      await this.cartItemRepository.create({
        cartId: cart.id,
        productId,
        quantity,
        userId,
      });
    }

    // Obtener carrito actualizado
    const updatedCart = await this.cartRepository.findCartWithItems(cart.id);

    return {
      cart: updatedCart!,
      message: 'Product added to cart successfully',
    };
  }
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}

export interface UpdateCartItemResponse {
  cart: Cart;
  message: string;
}

export class UpdateCartItemUseCase {
  constructor(
    @Inject(CART_ITEM_REPOSITORY)
    private readonly cartItemRepository: ICartItemRepository,
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    request: UpdateCartItemRequest,
  ): Promise<UpdateCartItemResponse> {
    const { cartItemId, quantity } = request;

    // Validar cantidad
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    if (quantity > 999) {
      throw new Error('Quantity cannot exceed 999');
    }

    // Obtener item del carrito
    const cartItem = await this.cartItemRepository.findById(cartItemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Verificar stock
    const hasStock = await this.productRepository.checkStock(
      cartItem.productId,
      quantity,
    );
    if (!hasStock) {
      throw new Error('Insufficient stock');
    }

    // Actualizar cantidad
    await this.cartItemRepository.updateQuantity(cartItemId, quantity);

    // Obtener carrito actualizado
    const cart = await this.cartRepository.findCartWithItems(cartItem.cartId);

    return {
      cart: cart!,
      message: 'Cart item updated successfully',
    };
  }
}

export interface RemoveFromCartRequest {
  cartItemId: string;
}

export interface RemoveFromCartResponse {
  cart: Cart;
  message: string;
}

export class RemoveFromCartUseCase {
  constructor(
    @Inject(CART_ITEM_REPOSITORY)
    private readonly cartItemRepository: ICartItemRepository,
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(
    request: RemoveFromCartRequest,
  ): Promise<RemoveFromCartResponse> {
    const { cartItemId } = request;

    // Obtener item del carrito
    const cartItem = await this.cartItemRepository.findById(cartItemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    const cartId = cartItem.cartId;

    // Eliminar item
    await this.cartItemRepository.delete(cartItemId);

    // Obtener carrito actualizado
    const cart = await this.cartRepository.findCartWithItems(cartId);

    return {
      cart: cart!,
      message: 'Item removed from cart successfully',
    };
  }
}

export interface GetCartRequest {
  sessionId?: string;
  userId?: string;
}

export interface GetCartResponse {
  cart: Cart | null;
}

export class GetCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(request: GetCartRequest): Promise<GetCartResponse> {
    const { sessionId, userId } = request;

    let cart: Cart | null = null;

    if (userId) {
      // Buscar carrito por usuario
      cart = await this.cartRepository.findByUserId(userId);
    } else if (sessionId) {
      cart = await this.cartRepository.findBySessionId(sessionId);
    }

    if (cart) {
      cart = await this.cartRepository.findCartWithItems(cart.id);
    }

    return { cart };
  }
}
