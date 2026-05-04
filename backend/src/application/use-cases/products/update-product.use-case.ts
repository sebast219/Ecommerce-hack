// 🏗️ APPLICATION USE CASE - Update Product
// PROPÓSITO: Lógica de negocio para actualizar productos existentes

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { UpdateProductDto } from '../../dto/product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(updateData: UpdateProductDto & { id: string }) {
    const { id, ...data } = updateData;

    // Verificar que el producto existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Si se actualiza el slug, verificar que no exista otro producto con ese slug
    if (data.slug && data.slug !== existingProduct.slug) {
      const slugExists = await this.prisma.product.findFirst({
        where: {
          slug: data.slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        throw new Error('Product with this slug already exists');
      }
    }

    // Si se actualiza el SKU, verificar que no exista otro producto con ese SKU
    if (data.sku && data.sku !== existingProduct.sku) {
      const skuExists = await this.prisma.product.findFirst({
        where: {
          sku: data.sku,
          id: { not: id },
        },
      });

      if (skuExists) {
        throw new Error('Product with this SKU already exists');
      }
    }

    // Preparar datos para Prisma - convertir arrays a strings si es necesario
    const prismaUpdateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    // Convertir arrays a strings para Prisma (si el schema lo requiere como string)
    if (data.images) {
      prismaUpdateData.images = JSON.stringify(data.images);
    }

    if (data.tags) {
      prismaUpdateData.tags = data.tags.join(',');
    }

    // Actualizar el producto
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: prismaUpdateData,
      include: {
        category: true,
        _count: {
          select: {
            orderItems: true,
            reviews: true,
          },
        },
      },
    });

    return {
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully',
    };
  }
}
