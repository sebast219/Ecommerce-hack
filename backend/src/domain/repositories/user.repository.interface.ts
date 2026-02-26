// 🏗️ DOMAIN REPOSITORIES INTERFACES - Contratos puros de acceso a datos
// PROPÓSITO: Definir cómo la capa de dominio interactúa con datos sin conocer implementación

import { User, Product, Order } from '../entities/user.entity';

// EJEMPLO: Interfaz de repositorio de usuarios
export interface IUserRepository {
  // Métodos CRUD básicos
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  
  // Métodos específicos del dominio
  findByRole(role: string): Promise<User[]>;
  existsByEmail(email: string): Promise<boolean>;
}

// EJEMPLO: Interfaz de repositorio de productos
export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: string, productData: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  
  // Métodos de consulta específicos
  findActive(): Promise<Product[]>;
  findByCategory(categoryId: string): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  existsBySku(sku: string): Promise<boolean>;
}

// EJEMPLO: Interfaz de repositorio de órdenes
export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  create(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  
  // Métodos específicos del dominio
  findByStatus(status: OrderStatus): Promise<Order[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;
  generateOrderNumber(): Promise<string>;
}
