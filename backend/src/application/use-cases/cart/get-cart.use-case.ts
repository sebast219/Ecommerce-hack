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
        product: {
          include: {
            inventory: true,
          },
        },
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

      // Validar stock real de productInventory
      const inventory = item.product.inventory;
      const stock = inventory?.quantity || 0;
      const trackStock = inventory?.track ?? true;

      if (trackStock && stock < item.quantity) {
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
