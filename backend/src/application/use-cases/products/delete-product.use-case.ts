// 🏗️ APPLICATION USE CASE - Delete Product
// PROPÓSITO: Lógica de negocio para eliminar productos

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: { id: string }) {
    // Verificar que el producto existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
            reviews: true,
          },
        },
      },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Verificar si el producto tiene pedidos asociados
    if (existingProduct._count.orderItems > 0) {
      throw new Error('Cannot delete product with existing orders. Consider deactivating it instead.');
    }

    // Eliminar el producto (Prisma manejará las relaciones en cascada)
    await this.prisma.product.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}
