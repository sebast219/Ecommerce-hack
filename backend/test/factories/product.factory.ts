// backend/test/factories/product.factory.ts - NUEVO
import { PrismaService } from '../../src/infrastructure/database/prisma.service';

export class ProductFactory {
  private sharedCategory: any = null;

  constructor(private readonly prisma: PrismaService) {}

  async createCategory(overrides: any = {}) {
    const timestamp = Date.now() + Math.random();
    return this.prisma.category.create({
      data: {
        name: overrides.name || `Category ${timestamp}`,
        slug: overrides.slug || `category-${timestamp}`,
        description: overrides.description || 'Test category',
        isActive: overrides.isActive ?? true,
        ...overrides,
      },
    });
  }

  async getOrCreateSharedCategory() {
    if (!this.sharedCategory) {
      this.sharedCategory = await this.createCategory({
        name: 'Shared Test Category',
        slug: 'shared-test-category',
      });
    }
    return this.sharedCategory;
  }

  resetSharedCategory() {
    this.sharedCategory = null;
  }

  async createProduct(overrides: any = {}) {
    const timestamp = Date.now() + Math.random();
    // Extraer categoryId de overrides para no duplicarlo en data
    const { categoryId: _, ...dataOverrides } = overrides;

    // Usar siempre transacción para verificar categoría y crear producto
    return this.prisma.$transaction(async (tx) => {
      let categoryId = overrides.categoryId;
      
      if (!categoryId) {
        const category = await tx.category.create({
          data: {
            name: `Category ${timestamp}`,
            slug: `category-${timestamp}`,
            description: 'Test category',
            isActive: true,
          },
        });
        categoryId = category.id;
      } else {
        // Verificar que la categoría existe
        const category = await tx.category.findUnique({
          where: { id: categoryId },
          select: { id: true },
        });
        if (!category) {
          throw new Error(`Category with id ${categoryId} not found`);
        }
      }

      return tx.product.create({
        data: {
          name: dataOverrides.name || `Product ${timestamp}`,
          slug: dataOverrides.slug || `product-${timestamp}`,
          description: dataOverrides.description || 'Test product description',
          price: dataOverrides.price || 29.99,
          sku: dataOverrides.sku || `SKU-${timestamp}`,
          isActive: dataOverrides.isActive !== undefined ? dataOverrides.isActive : true,
          trackInventory: dataOverrides.trackInventory !== undefined ? dataOverrides.trackInventory : true,
          images: dataOverrides.images || '["https://example.com/image.jpg"]',
          tags: dataOverrides.tags || '["test"]',
          difficulty: dataOverrides.difficulty || 'BEGINNER',
          compatibility: dataOverrides.compatibility || '["windows", "macos", "linux"]',
          tutorials: dataOverrides.tutorials || '["https://example.com/tutorial"]',
          isPhysical: dataOverrides.isPhysical !== undefined ? dataOverrides.isPhysical : true,
          categoryId,
          inventory: {
            create: {
              quantity: dataOverrides.stock || 100,
              lowStock: 5,
            },
          },
        },
        include: {
          category: true,
          inventory: true,
        },
      });
    });
  }

  async createProducts(count: number, overrides: any = {}) {
    const products = [];
    // Si no se proporciona categoryId, crear una sola categoría para todos los productos
    let categoryId = overrides.categoryId;
    if (!categoryId) {
      const category = await this.createCategory();
      categoryId = category.id;
    }
    // Extraer categoryId de overrides para no duplicarlo
    const { categoryId: _, ...dataOverrides } = overrides;
    
    for (let i = 0; i < count; i++) {
      products.push(await this.createProduct({ ...dataOverrides, categoryId }));
    }
    return products;
  }
}
