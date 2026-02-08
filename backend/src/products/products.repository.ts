import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async create(productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
  }): Promise<Product> {
    return this.prisma.product.create({
      data: productData,
    });
  }

  async findAll(category?: string, limit?: number, offset?: number): Promise<Product[]> {
    const where = category ? { category } : {};
    
    return this.prisma.product.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    productData: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
      imageUrl: string;
    }>
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: productData,
    });
  }

  async delete(id: string): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });
    
    return categories.map(c => c.category);
  }
}
