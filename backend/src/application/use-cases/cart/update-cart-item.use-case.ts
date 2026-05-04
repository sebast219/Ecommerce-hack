import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class UpdateCartItemUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, cartItemId: string, quantity: number) {
    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }
    if (quantity > 99) {
      throw new BadRequestException('Quantity cannot exceed 99');
    }

    // Primero obtener el carrito del usuario
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // IDOR prevention - verificar que el item pertenece al carrito del usuario
    if (cartItem.cartId !== cart.id) {
      throw new ForbiddenException('Access denied');
    }

    // TODO: Obtener stock de productInventory cuando la relación funcione
    const stock = 999; // Stock temporal infinito para pruebas
    if (quantity > stock) {
      throw new BadRequestException(`Only ${stock} units available`);
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true, name: true, slug: true, price: true, images: true,
          },
        },
      },
    });
  }
}
