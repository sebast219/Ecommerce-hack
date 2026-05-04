import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

export interface AddToCartCommand {
  userId: string;
  productId: string;
  quantity: number;
}

@Injectable()
export class AddToCartUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: AddToCartCommand) {
    if (command.quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }
    if (command.quantity > 99) {
      throw new BadRequestException('Quantity cannot exceed 99');
    }

    // Verificar que el producto existe y está activo
    const product = await this.prisma.product.findUnique({
      where: { id: command.productId },
      include: { inventory: true },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or unavailable');
    }

    // Validar stock
    const availableStock = product.inventory?.quantity ?? 0;
    if (availableStock < command.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Only ${availableStock} units available`,
      );
    }

    // Primero buscar o crear un carrito para el usuario
    let cart = await this.prisma.cart.findUnique({
      where: { userId: command.userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId: command.userId },
      });
    }

    // Upsert: si ya existe, sumar cantidad; si no, crear
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: command.productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + command.quantity;

      if (newQuantity > availableStock) {
        throw new BadRequestException(
          `Cannot add ${command.quantity} more. Only ${availableStock - existingItem.quantity} units available`,
        );
      }

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              images: true,
            },
          },
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: command.productId,
        quantity: command.quantity,
        userId: command.userId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          },
        },
      },
    });
  }
}
