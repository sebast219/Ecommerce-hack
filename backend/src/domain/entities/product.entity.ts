// 🏗️ DOMAIN ENTITIES - Entidad de Producto
// PROPÓSITO: Definir las reglas de negocio y datos centrales de productos

import { Money } from './user.entity';

export { Money };

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: Money;
  comparePrice?: Money;
  sku: string;
  barcode?: string;
  trackInventory: boolean;
  isActive: boolean;
  images: string[];
  tags: string[];
  weight?: number;
  dimensions?: ProductDimensions;
  seoTitle?: string;
  seoDescription?: string;
  
  // Cybersecurity specific fields
  difficulty: ProductDifficulty;
  licenseType?: string;
  compatibility: string[];
  requirements?: any;
  tutorials: string[];
  isPhysical: boolean;
  downloadUrl?: string;
  
  categoryId: string;
  category?: Category;
  inventory?: ProductInventory;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  products?: Product[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInventory {
  id: string;
  quantity: number;
  lowStock: number;
  track: boolean;
  productId: string;
  product?: Product;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export enum ProductDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

// Value Objects
export class ProductSlug {
  constructor(public readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.value || this.value.length < 3) {
      throw new Error('Product slug must be at least 3 characters');
    }
    if (!/^[a-z0-9-]+$/.test(this.value)) {
      throw new Error('Product slug can only contain lowercase letters, numbers, and hyphens');
    }
  }

  static create(name: string): ProductSlug {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^[---]+|[---]+$/g, '');
    
    return new ProductSlug(slug);
  }
}

export class ProductSku {
  constructor(public readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.value || this.value.length < 3) {
      throw new Error('Product SKU must be at least 3 characters');
    }
  }

  static generate(categoryCode: string, sequence: number): ProductSku {
    const sku = `${categoryCode.toUpperCase()}-${String(sequence).padStart(4, '0')}`;
    return new ProductSku(sku);
  }
}
