// Product Repository Interface con Paginación y Filtros
import { PaginatedResult, PaginationParams, ProductFilters } from './pagination.interface';

// Product DTOs sin dependencias de Prisma
export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  imageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  category: { id: string; name: string; slug: string } | null;
  inventory: { quantity: number; lowStock: number } | null;
}

export interface ProductDetail extends ProductSummary {
  description: string | null;
  shortDesc: string | null;
  sku: string;
  images: string[];
  tags: string[];
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductRepository {
  findPaginated(
    params: PaginationParams,
    filters?: ProductFilters
  ): Promise<PaginatedResult<ProductSummary>>;
  
  findBySlug(slug: string): Promise<ProductDetail | null>;
  findById(id: string): Promise<ProductDetail | null>;
  create(data: CreateProductData): Promise<ProductDetail>;
  update(id: string, data: UpdateProductData): Promise<ProductDetail>;
  delete(id: string): Promise<void>;
  findFeatured(limit?: number): Promise<ProductSummary[]>;
  search(query: string, limit?: number): Promise<ProductSummary[]>;
  findByCategory(categoryId: string, params: PaginationParams): Promise<PaginatedResult<ProductSummary>>;
  getLowStockProducts(): Promise<ProductSummary[]>;
  updateInventory(productId: string, quantity: number): Promise<void>;
}

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  price: number;
  comparePrice?: number;
  sku: string;
  categoryId?: string;
  imageUrl?: string;
  images?: string[];
  tags?: string[];
  metadata?: any;
  isFeatured?: boolean;
  initialStock?: number;
}

export interface UpdateProductData {
  name?: string;
  slug?: string;
  description?: string;
  shortDesc?: string;
  price?: number;
  comparePrice?: number;
  categoryId?: string;
  imageUrl?: string;
  images?: string[];
  tags?: string[];
  metadata?: any;
  isActive?: boolean;
  isFeatured?: boolean;
}
