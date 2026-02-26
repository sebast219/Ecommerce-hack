export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  images: string[];
  sku: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  inventory?: {
    quantity: number;
    lowStock: number;
  };
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}
