export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  barcode?: string;
  trackInventory: boolean;
  isActive: boolean;
  images: string | string[];
  tags: string | string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  licenseType?: string;
  compatibility: string | string[];
  requirements?: string;
  tutorials: string | string[];
  isPhysical: boolean;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  inventory?: {
    quantity: number;
    lowStock: number;
    track: boolean;
  };
  reviews?: ProductReview[];
}

export interface ProductReview {
  id: string;
  rating: number;
  comment?: string;
  pros?: string;
  cons?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  productId: string;
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  difficulty?: string;
  tags?: string[];
  inStock?: boolean;
  isPhysical?: boolean;
}

export interface ProductSearch {
  query?: string;
  filters?: ProductFilter;
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'name' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
