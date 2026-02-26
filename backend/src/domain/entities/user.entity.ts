// 🏗️ DOMAIN ENTITIES - Entidades puras del negocio
// PROPÓSITO: Definir las reglas de negocio y datos centrales sin dependencias externas

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
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
    public readonly currency: string = 'USD'
  ) {
    this.validateAmount();
  }

  private validateAmount(): void {
    // EJEMPLO: Regla de negocio - Monto no puede ser negativo
    if (this.amount < 0) {
      throw new Error('Amount cannot be negative');
    }
  }

  // EJEMPLO: Método de dominio - Sumar dinero
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }
}
