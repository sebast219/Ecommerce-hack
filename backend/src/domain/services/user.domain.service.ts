// 🏗️ DOMAIN SERVICES - Lógica de negocio pura
// PROPÓSITO: Contener reglas de negocio complejas que no pertenecen a una sola entidad

import { Money, OrderStatus } from '../entities/user.entity';
import {
  IUserRepository,
  IProductRepository,
  IOrderRepository,
} from '../repositories/user.repository.interface';

// EJEMPLO: Servicio de dominio para gestión de usuarios
export class UserDomainService {
  constructor(private userRepository: IUserRepository) {}

  // EJEMPLO: Regla de negocio - Validar cambio de rol
  async canChangeRole(userId: string, newRole: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // EJEMPLO: Lógica de negocio específica
    if (user.role === 'ADMIN' && newRole !== 'ADMIN') {
      // Regla: No se puede degradar a un admin si es el único admin
      const adminCount = await this.userRepository.findByRole('ADMIN');
      if (adminCount.length <= 1) {
        return false;
      }
    }

    return true;
  }

  // EJEMPLO: Regla de negocio - Validar eliminación de usuario
  async canDeleteUser(userId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // EJEMPLO: Lógica de negocio - No eliminar usuarios con órdenes activas
    // Aquí se inyectarían otros repositories si es necesario
    return true;
  }
}

// EJEMPLO: Servicio de dominio para gestión de productos
export class ProductDomainService {
  constructor(private productRepository: IProductRepository) {}

  // EJEMPLO: Regla de negocio - Validar precio de producto
  validateProductPrice(price: Money): void {
    // EJEMPLO: Validación de dominio
    if (price.amount <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    // EJEMPLO: Regla de negocio específica
    if (price.amount > 10000) {
      throw new Error('Product price cannot exceed $10,000');
    }
  }

  // EJEMPLO: Regla de negocio - Validar SKU único
  async validateUniqueSku(sku: string, excludeId?: string): Promise<void> {
    const existingProduct = await this.productRepository.findBySku(sku);

    if (existingProduct && existingProduct.id !== excludeId) {
      throw new Error(`Product with SKU ${sku} already exists`);
    }
  }
}

// EJEMPLO: Servicio de dominio para gestión de órdenes
export class OrderDomainService {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
  ) {}

  // EJEMPLO: Regla de negocio - Validar cambio de estado
  canChangeStatus(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    // EJEMPLO: Máquina de estados - Flujo permitido
    const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    return statusTransitions[currentStatus]?.includes(newStatus) ?? false;
  }

  // EJEMPLO: Regla de negocio - Calcular total con impuestos
  calculateTotal(subtotal: Money, taxRate: number = 0.1): Money {
    // EJEMPLO: Cálculo de dominio
    const taxAmount = subtotal.amount * taxRate;
    return new Money(subtotal.amount + taxAmount, subtotal.currency);
  }
}
