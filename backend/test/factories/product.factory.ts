// backend/test/factories/product.factory.ts - NUEVO
import { PrismaService } from '../../src/infrastructure/database/prisma.service';

export class ProductFactory {
  private counter = 0;

  constructor(private readonly prisma: PrismaService) {}

  async createCategory(overrides: any = {}) {
    this.counter++;
    return this.prisma.category.create({
      data: {
        name: overrides.name || `Category ${this.counter}`,
        slug: overrides.slug || `category-${this.counter}`,
        description: overrides.description || 'Test category',
        isActive: overrides.isActive ?? true,
        ...overrides,
      },
    });
  }

  async createProduct(overrides: any = {}) {
    this.counter++;
    const categoryId = overrides.categoryId || (await this.createCategory()).id;

    return this.prisma.product.create({
      data: {
        name: overrides.name || `Product ${this.counter}`,
        slug: overrides.slug || `product-${this.counter}`,
        description: overrides.description || 'Test product description',
        price: overrides.price || 29.99,
        sku: overrides.sku || `SKU-${this.counter}-${Date.now()}`,
        isActive: overrides.isActive ?? true,
        trackInventory: overrides.trackInventory ?? true,
        images: overrides.images || '["https://example.com/image.jpg"]',
        tags: overrides.tags || '["test"]',
        difficulty: overrides.difficulty || 'BEGINNER',
        compatibility:
          overrides.compatibility || '["windows", "macos", "linux"]',
        tutorials: overrides.tutorials || '["https://example.com/tutorial"]',
        isPhysical: overrides.isPhysical ?? true,
        categoryId,
        inventory: {
          create: {
            quantity: overrides.stock ?? 100,
            lowStock: 5,
          },
        },
        ...overrides,
      },
      include: {
        category: true,
        inventory: true,
      },
    });
  }

  async createProducts(count: number, overrides: any = {}) {
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push(await this.createProduct(overrides));
    }
    return products;
  }
}
