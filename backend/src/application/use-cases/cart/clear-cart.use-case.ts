import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class ClearCartUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<{ deletedCount: number }> {
    // Primero obtener el carrito del usuario
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return { deletedCount: 0 };
    }

    const result = await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    return { deletedCount: result.count };
  }
}
