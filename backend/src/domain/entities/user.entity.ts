// 🏗️ DOMAIN ENTITIES - Entidades puras del negocio
// PROPÓSITO: Definir las reglas de negocio y datos centrales sin dependencias externas

export class OrderItem {
  id: string;
  quantity: number;
  price: number;

  // Relations
  orderId: string;
  productId: string;

  constructor(data: Partial<OrderItem>) {
    Object.assign(this, data);
  }
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  experienceLevel: string;
  certifications: string; // JSON string para compatibilidad con SQLite
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: Money;
  sku: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  total: Money;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Enums del dominio
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// Value Objects - Objetos de valor inmutables
export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'USD',
  ) {
    this.validateAmount();
  }

  private validateAmount(): void {
    // EJEMPLO: Regla de negocio - Monto no puede ser negativo
    if (this.amount < 0 || isNaN(this.amount) || !isFinite(this.amount)) {
      throw new Error('Amount must be a valid positive number');
    }
  }

  // EJEMPLO: Método de dominio - Sumar dinero
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  // Método de dominio - Multiplicar dinero
  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  // Método de dominio - Comparar igualdad
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
