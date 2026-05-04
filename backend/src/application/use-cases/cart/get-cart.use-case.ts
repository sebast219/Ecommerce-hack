import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class GetCartUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    // Primero obtener el carrito del usuario
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return {
        items: [],
        invalidItems: [],
        summary: {
          subtotal: 0,
          totalItems: 0,
          itemCount: 0,
        },
      };
    }

    const items = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: true,
      },
      orderBy: { id: 'desc' },
    });

    // Calcular totales
    let subtotal = 0;
    let totalItems = 0;
    const validItems: any[] = [];
    const invalidItems: any[] = [];

    for (const item of items) {
      // Detectar productos inactivos o sin stock
      if (!item.product.isActive) {
        invalidItems.push({ ...item, reason: 'Product no longer available' });
        continue;
      }

      // TODO: Obtener stock de productInventory cuando la relación funcione
      const stock = 999; // Stock temporal infinito para pruebas
      if (stock < item.quantity) {
        invalidItems.push({
          ...item,
          reason: `Only ${stock} units available`,
          maxAvailable: stock,
        });
        continue;
      }

      validItems.push(item);
      subtotal += Number(item.product.price) * item.quantity;
      totalItems += item.quantity;
    }

    return {
      items: validItems,
      invalidItems,
      summary: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        totalItems,
        itemCount: validItems.length,
      },
    };
  }
}
