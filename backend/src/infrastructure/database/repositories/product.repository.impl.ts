// 🏗️ INFRASTRUCTURE REPOSITORIES IMPLEMENTATIONS - Productos
// PROPÓSITO: Implementar interfaces de productos usando Prisma

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  User,
  Product,
  Money,
} from '../../../domain/entities/user.entity';
import {
  IUserRepository,
  IProductRepository,
  UserWithPassword,
} from '../../../domain/repositories/user.repository.interface';
import { ProductDifficulty, Category, ProductInventory } from '../../../domain/entities/product.entity';

@Injectable()
export class ProductRepositoryImpl
  implements IProductRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const prismaProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProduct ? this.mapPrismaProductToProduct(prismaProduct) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const prismaProduct = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProduct ? this.mapPrismaProductToProduct(prismaProduct) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const prismaProduct = await this.prisma.product.findUnique({
      where: { sku },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProduct ? this.mapPrismaProductToProduct(prismaProduct) : null;
  }

  async create(
    productData: any, // Temporarily use any to fix TypeScript issues
  ): Promise<Product> {
    const prismaProduct = await this.prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price.amount,
        comparePrice: productData.comparePrice?.amount,
        sku: productData.sku,
        barcode: productData.barcode,
        trackInventory: productData.trackInventory,
        isActive: productData.isActive,
        images: JSON.stringify(productData.images || []),
        tags: JSON.stringify(productData.tags || []),
        weight: productData.weight,
        dimensions: productData.dimensions as any, // Cast a any para compatibilidad con Prisma JsonValue
        seoTitle: productData.seoTitle,
        seoDescription: productData.seoDescription,
        difficulty: productData.difficulty || 'INTERMEDIATE',
        licenseType: productData.licenseType,
        compatibility: JSON.stringify(productData.compatibility || []),
        requirements: productData.requirements,
        tutorials: JSON.stringify(productData.tutorials || []),
        isPhysical: productData.isPhysical ?? true,
        downloadUrl: productData.downloadUrl,
        categoryId: productData.categoryId,
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return this.mapPrismaProductToProduct(prismaProduct);
  }

  async update(id: string, productData: any): Promise<Product> {
    const { categoryId, price, comparePrice, dimensions, ...rest } =
      productData;

    const prismaProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        price: price?.amount,
        comparePrice: comparePrice?.amount,
        categoryId,
        dimensions: dimensions as any,
      } as any, // Cast completo del data object
      include: {
        category: true,
        inventory: true,
      },
    });

    return this.mapPrismaProductToProduct(prismaProduct);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async findActive(): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map((product) =>
      this.mapPrismaProductToProduct(product),
    );
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map((product) =>
      this.mapPrismaProductToProduct(product),
    );
  }

  async search(query: string): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map((product) =>
      this.mapPrismaProductToProduct(product),
    );
  }

  async findByDifficulty(difficulty: ProductDifficulty): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: { difficulty },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map((product) =>
      this.mapPrismaProductToProduct(product),
    );
  }

  async findByTags(tags: string[]): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: {
        tags: { contains: tags.join('|') },
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map((product) =>
      this.mapPrismaProductToProduct(product),
    );
  }

  async findWithInventory(): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map((product) =>
      this.mapPrismaProductToProduct(product),
    );
  }

  async existsBySku(sku: string): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
      select: { id: true },
    });

    return !!product;
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    return !!product;
  }

  async updateInventory(productId: string, quantity: number): Promise<void> {
    await this.prisma.productInventory.update({
      where: { productId },
      data: { quantity },
    });
  }

  async checkStock(productId: string, quantity: number): Promise<boolean> {
    const inventory = await this.prisma.productInventory.findUnique({
      where: { productId },
    });

    if (!inventory || !inventory.track) {
      return true; // Si no hay seguimiento de inventario, permitir
    }

    return inventory.quantity >= quantity;
  }

  async getLowStockProducts(): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: {
        inventory: {
          quantity: {
            lte: 5, // lowStock threshold
          },
        },
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map((product) =>
      this.mapPrismaProductToProduct(product),
    );
  }

  private mapPrismaProductToProduct(prismaProduct: any): Product {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      slug: prismaProduct.slug,
      description: prismaProduct.description || '',
      price: new Money(Number(prismaProduct.price), 'USD'),
      comparePrice: prismaProduct.comparePrice ? new Money(Number(prismaProduct.comparePrice), 'USD') : undefined,
      sku: prismaProduct.sku,
      barcode: prismaProduct.barcode,
      trackInventory: prismaProduct.trackInventory,
      isActive: prismaProduct.isActive,
      images: prismaProduct.images ? JSON.parse(prismaProduct.images) : [],
      tags: prismaProduct.tags ? JSON.parse(prismaProduct.tags) : [],
      weight: prismaProduct.weight,
      dimensions: prismaProduct.dimensions,
      seoTitle: prismaProduct.seoTitle,
      seoDescription: prismaProduct.seoDescription,
      difficulty: prismaProduct.difficulty,
      licenseType: prismaProduct.licenseType,
      compatibility: prismaProduct.compatibility ? JSON.parse(prismaProduct.compatibility) : [],
      requirements: prismaProduct.requirements,
      tutorials: prismaProduct.tutorials ? JSON.parse(prismaProduct.tutorials) : [],
      isPhysical: prismaProduct.isPhysical,
      downloadUrl: prismaProduct.downloadUrl,
      categoryId: prismaProduct.categoryId,
      category: prismaProduct.category ? this.mapPrismaCategoryToCategory(prismaProduct.category) : undefined,
      inventory: prismaProduct.inventory ? this.mapPrismaInventoryToInventory(prismaProduct.inventory) : undefined,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
    } as Product;
  }

  private mapPrismaCategoryToCategory(prismaCategory: any): Category {
    return {
      id: prismaCategory.id,
      name: prismaCategory.name,
      slug: prismaCategory.slug,
      description: prismaCategory.description,
      image: prismaCategory.image,
      isActive: prismaCategory.isActive,
      parentId: prismaCategory.parentId,
      createdAt: prismaCategory.createdAt,
      updatedAt: prismaCategory.updatedAt,
    };
  }

  private mapPrismaInventoryToInventory(
    prismaInventory: any,
  ): ProductInventory {
    return {
      id: prismaInventory.id,
      quantity: prismaInventory.quantity,
      lowStock: prismaInventory.lowStock,
      track: prismaInventory.track,
      productId: prismaInventory.productId,
      createdAt: prismaInventory.createdAt,
      updatedAt: prismaInventory.updatedAt,
    };
  }

  // Additional CategoryRepository methods
  async findAllCategories(): Promise<Category[]> {
    const prismaCategories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return prismaCategories.map(this.mapPrismaCategoryToCategory);
  }

  async findRootCategories(): Promise<Category[]> {
    const prismaCategories = await this.prisma.category.findMany({
      where: { parentId: null },
    });
    return prismaCategories.map(this.mapPrismaCategoryToCategory);
  }

  async findChildCategories(parentId: string): Promise<Category[]> {
    const prismaCategories = await this.prisma.category.findMany({
      where: { parentId },
    });
    return prismaCategories.map(this.mapPrismaCategoryToCategory);
  }

  async findCategoryTree(): Promise<Category[]> {
    const prismaCategories = await this.prisma.category.findMany({
      include: { children: true },
    });
    return prismaCategories.map(this.mapPrismaCategoryToCategory);
  }

  async findByName(name: string): Promise<Category | null> {
    const prismaCategory = await this.prisma.category.findFirst({
      where: { name: { contains: name } },
    });
    return prismaCategory
      ? this.mapPrismaCategoryToCategory(prismaCategory)
      : null;
  }

  async existsByName(name: string): Promise<boolean> {
    const category = await this.prisma.category.findFirst({
      where: { name: { contains: name } },
    });
    return !!category;
  }
}
