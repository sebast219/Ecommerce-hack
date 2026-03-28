// 🏗️ DOMAIN REPOSITORIES INTERFACES - Contratos de productos
// PROPÓSITO: Definir cómo la capa de dominio interactúa con productos

import { Product, Category, ProductInventory, ProductDifficulty } from '../entities/product.entity';

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
export const CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY';

export interface IProductRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  create(
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product>;
  update(id: string, productData: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;

  // Métodos de consulta específicos
  findActive(): Promise<Product[]>;
  findByCategory(categoryId: string): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  findByDifficulty(difficulty: ProductDifficulty): Promise<Product[]>;
  findByTags(tags: string[]): Promise<Product[]>;
  findWithInventory(): Promise<Product[]>;
  
  // Métodos de existencia
  existsBySku(sku: string): Promise<boolean>;
  existsBySlug(slug: string): Promise<boolean>;
  
  // Métodos de inventario
  updateInventory(productId: string, quantity: number): Promise<void>;
  checkStock(productId: string, quantity: number): Promise<boolean>;
  getLowStockProducts(): Promise<Product[]>;
}

export interface ICategoryRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  create(
    categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Category>;
  update(id: string, categoryData: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;

  // Métodos jerárquicos
  findRootCategories(): Promise<Category[]>;
  findChildCategories(parentId: string): Promise<Category[]>;
  findCategoryTree(): Promise<Category[]>;
  
  // Métodos de consulta
  findActive(): Promise<Category[]>;
  findByName(name: string): Promise<Category | null>;
  
  // Métodos de existencia
  existsByName(name: string): Promise<boolean>;
  existsBySlug(slug: string): Promise<boolean>;
}

export interface IProductInventoryRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<ProductInventory | null>;
  findByProductId(productId: string): Promise<ProductInventory | null>;
  create(
    inventoryData: Omit<ProductInventory, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ProductInventory>;
  update(id: string, inventoryData: Partial<ProductInventory>): Promise<ProductInventory>;
  delete(id: string): Promise<void>;

  // Métodos específicos de inventario
  updateQuantity(productId: string, quantity: number): Promise<ProductInventory>;
  adjustStock(productId: string, adjustment: number): Promise<ProductInventory>;
  getLowStockItems(): Promise<ProductInventory[]>;
  getOutOfStockItems(): Promise<ProductInventory[]>;
}
