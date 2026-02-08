import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        ...data,
        inventory: {
          create: {
            quantity: data.inventory?.quantity || 0,
            lowStock: data.inventory?.lowStock || 5,
            track: data.inventory?.track ?? true,
          },
        },
      },
      include: {
        category: true,
        inventory: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventory: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        inventory: true,
      },
    });
  }

  async findBySku(sku: string) {
    return await this.prisma.product.findUnique({
      where: { sku },
    });
  }

  async findAll(where: any, skip: number, take: number) {
    return await this.prisma.product.findMany({
      where,
      include: {
        category: true,
        inventory: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async count(where: any): Promise<number> {
    return await this.prisma.product.count({ where });
  }

  async update(id: string, data: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        inventory: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async findInventory(productId: string) {
    return await this.prisma.productInventory.findUnique({
      where: { productId },
    });
  }

  async updateInventory(productId: string, quantity: number) {
    return await this.prisma.productInventory.update({
      where: { productId },
      data: { quantity },
    });
  }

  async decreaseInventoryWithTransaction(productId: string, quantity: number) {
    return await this.executeWithTransaction(async (tx) => {
      const inventory = await tx.productInventory.findUnique({
        where: { productId },
      });

      if (!inventory) {
        throw new Error('Product inventory not found');
      }

      if (inventory.quantity < quantity) {
        throw new Error('Insufficient inventory');
      }

      return await tx.productInventory.update({
        where: { productId },
        data: {
          quantity: inventory.quantity - quantity,
        },
      });
    });
  }

  async increaseInventoryWithTransaction(productId: string, quantity: number) {
    return await this.executeWithTransaction(async (tx) => {
      const inventory = await tx.productInventory.findUnique({
        where: { productId },
      });

      if (!inventory) {
        throw new Error('Product inventory not found');
      }

      return await tx.productInventory.update({
        where: { productId },
        data: {
          quantity: inventory.quantity + quantity,
        },
      });
    });
  }
}
