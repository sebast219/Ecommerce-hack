import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class RemoveFromCartUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, cartItemId: string): Promise<void> {
    // Primero obtener el carrito del usuario
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // IDOR prevention - verificar que el item pertenece al carrito del usuario
    if (cartItem.cartId !== cart.id) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }
}
