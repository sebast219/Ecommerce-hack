// 🏛️ ECOMMERCE RULES SERVICE - Reglas de negocio específicas
// PROPÓSITO: Implementar validaciones y reglas de negocio del e-commerce

import { Injectable, Logger } from '@nestjs/common';

export interface ProductValidationRule {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  specs?: any;
}

export interface OrderValidationRule {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  customerId: string;
  shippingAddress: any;
}

export interface DiscountRule {
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minAmount?: number;
  applicableCategories?: string[];
  maxUses?: number;
  expirationDate?: Date;
}

@Injectable()
export class EcommerceRulesService {
  private readonly logger = new Logger(EcommerceRulesService.name);

  // Reglas de validación de productos para ciberseguridad
  validateProduct(product: ProductValidationRule): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validaciones básicas
    if (!product.name || product.name.trim().length < 3) {
      errors.push('Product name must be at least 3 characters long');
    }

    if (!product.description || product.description.trim().length < 10) {
      errors.push('Product description must be at least 10 characters long');
    }

    if (!product.category) {
      errors.push('Product category is required');
    }

    // Validaciones de categorías especializadas
    const validCategories = [
      'wireless-attacks',
      'usb-hacking',
      'red-team-tools',
      'forense',
      'network-security',
      'encryption-tools',
      'password-recovery',
      'hardware-hacking',
    ];

    if (!validCategories.includes(product.category)) {
      errors.push(
        `Invalid category. Valid categories: ${validCategories.join(', ')}`,
      );
    }

    // Validaciones de precio
    if (product.price <= 0) {
      errors.push('Product price must be greater than 0');
    }

    if (product.price > 10000) {
      errors.push('Product price cannot exceed $10,000');
    }

    // Validaciones de stock
    if (product.stock < 0) {
      errors.push('Product stock cannot be negative');
    }

    // Validaciones específicas por categoría
    this.validateCategorySpecificRules(product, errors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validaciones de pedido
  validateOrder(order: OrderValidationRule): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validaciones de items
    if (!order.items || order.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    if (order.items.length > 50) {
      errors.push('Order cannot contain more than 50 items');
    }

    // Validar cada item
    order.items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item ${index + 1}: Product ID is required`);
      }

      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }

      if (item.quantity > 10) {
        errors.push(`Item ${index + 1}: Maximum quantity per item is 10`);
      }

      if (item.price <= 0) {
        errors.push(`Item ${index + 1}: Price must be greater than 0`);
      }
    });

    // Validación del monto total
    const calculatedTotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    if (Math.abs(calculatedTotal - order.totalAmount) > 0.01) {
      errors.push(
        `Total amount mismatch. Expected: ${calculatedTotal}, Provided: ${order.totalAmount}`,
      );
    }

    if (order.totalAmount > 50000) {
      errors.push('Order total cannot exceed $50,000');
    }

    // Validación de cliente
    if (!order.customerId) {
      errors.push('Customer ID is required');
    }

    // Validación de dirección de envío
    if (!order.shippingAddress) {
      errors.push('Shipping address is required');
    } else {
      if (!order.shippingAddress.addressLine1) {
        errors.push('Shipping address line 1 is required');
      }
      if (!order.shippingAddress.city) {
        errors.push('Shipping city is required');
      }
      if (!order.shippingAddress.postalCode) {
        errors.push('Shipping postal code is required');
      }
      if (!order.shippingAddress.country) {
        errors.push('Shipping country is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Aplicar reglas de descuento
  applyDiscountRules(
    subtotal: number,
    items: any[],
    discountRules: DiscountRule[],
  ): { total: number; appliedDiscounts: any[] } {
    let total = subtotal;
    const appliedDiscounts: any[] = [];

    for (const rule of discountRules) {
      if (this.isDiscountApplicable(rule, subtotal, items)) {
        const discountAmount = this.calculateDiscount(rule, subtotal);
        total -= discountAmount;

        appliedDiscounts.push({
          ruleId: rule.type,
          description: this.getDiscountDescription(rule),
          amount: discountAmount,
        });

        this.logger.log(
          `Applied discount: ${rule.type}, Amount: $${discountAmount}`,
        );
      }
    }

    return {
      total: Math.max(0, total),
      appliedDiscounts,
    };
  }

  // Validar disponibilidad de stock
  validateStockAvailability(
    items: Array<{ productId: string; quantity: number }>,
    stockMap: Record<string, number> = {}, // Mapa de productId -> stock real
  ): Promise<{
    isValid: boolean;
    unavailableItems: Array<{
      productId: string;
      requested: number;
      available: number;
    }>;
  }> {
    // Esta función valida stock usando un mapa de stock proporcionado externamente
    // El mapa debe venir del repositorio de productos con los valores reales de la BD
    return new Promise((resolve) => {
      const unavailableItems: Array<{
        productId: string;
        requested: number;
        available: number;
      }> = [];

      items.forEach((item) => {
        // Usar stock real del mapa proporcionado, o 0 si no existe
        const availableStock = stockMap[item.productId] || 0;

        if (item.quantity > availableStock) {
          unavailableItems.push({
            productId: item.productId,
            requested: item.quantity,
            available: availableStock,
          });
        }
      });

      resolve({
        isValid: unavailableItems.length === 0,
        unavailableItems,
      });
    });
  }

  // Calcular costos de envío
  calculateShippingCost(
    items: any[],
    shippingAddress: any,
    shippingMethod: 'STANDARD' | 'EXPRESS' | 'OVERNIGHT',
  ): number {
    // Reglas de envío basadas en peso y ubicación
    const baseCost = {
      STANDARD: 5.99,
      EXPRESS: 12.99,
      OVERNIGHT: 24.99,
    };

    let cost = baseCost[shippingMethod];

    // Costo adicional por peso total (simulado)
    const totalWeight = items.reduce(
      (sum, item) => sum + (item.weight || 1),
      0,
    );
    if (totalWeight > 5) {
      cost += (totalWeight - 5) * 2;
    }

    // Costo adicional por ubicación internacional
    if (shippingAddress.country !== 'US') {
      cost *= 1.5;
    }

    // Envío gratis para pedidos mayores a $100
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    if (subtotal >= 100) {
      cost = 0;
    }

    return Math.round(cost * 100) / 100;
  }

  // Validar método de pago
  validatePaymentMethod(
    paymentMethod: string,
    amount: number,
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const validMethods = [
      'credit_card',
      'debit_card',
      'paypal',
      'stripe',
      'crypto',
    ];

    if (!validMethods.includes(paymentMethod)) {
      errors.push(
        `Invalid payment method. Valid methods: ${validMethods.join(', ')}`,
      );
    }

    // Límites por método de pago
    const limits = {
      credit_card: 10000,
      debit_card: 5000,
      paypal: 3000,
      stripe: 15000,
      crypto: 50000,
    };

    if (amount > limits[paymentMethod]) {
      errors.push(
        `Amount exceeds limit for ${paymentMethod}. Maximum: $${limits[paymentMethod]}`,
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Métodos privados
  private validateCategorySpecificRules(
    product: ProductValidationRule,
    errors: string[],
  ): void {
    switch (product.category) {
      case 'wireless-attacks':
        if (!product.specs || !product.specs.frequency) {
          errors.push('Wireless attack products must specify frequency range');
        }
        break;

      case 'usb-hacking':
        if (!product.specs || !product.specs.compatibility) {
          errors.push('USB hacking products must specify compatibility');
        }
        break;

      case 'red-team-tools':
        if (!product.specs || !product.specs.license) {
          errors.push('Red team tools must specify license type');
        }
        break;

      case 'forense':
        if (!product.specs || !product.specs.supportedFormats) {
          errors.push('Forensic tools must specify supported formats');
        }
        break;
    }
  }

  private isDiscountApplicable(
    rule: DiscountRule,
    subtotal: number,
    items: any[],
  ): boolean {
    // Verificar fecha de expiración
    if (rule.expirationDate && new Date() > rule.expirationDate) {
      return false;
    }

    // Verificar monto mínimo
    if (rule.minAmount && subtotal < rule.minAmount) {
      return false;
    }

    // Verificar categorías aplicables
    if (rule.applicableCategories && rule.applicableCategories.length > 0) {
      const hasApplicableCategory = items.some((item) =>
        rule.applicableCategories.includes(item.category),
      );
      if (!hasApplicableCategory) {
        return false;
      }
    }

    return true;
  }

  private calculateDiscount(rule: DiscountRule, subtotal: number): number {
    switch (rule.type) {
      case 'PERCENTAGE':
        return subtotal * (rule.value / 100);
      case 'FIXED_AMOUNT':
        return Math.min(rule.value, subtotal);
      case 'FREE_SHIPPING':
        return 10; // Valor simulado del costo de envío
      default:
        return 0;
    }
  }

  private getDiscountDescription(rule: DiscountRule): string {
    switch (rule.type) {
      case 'PERCENTAGE':
        return `${rule.value}% discount`;
      case 'FIXED_AMOUNT':
        return `$${rule.value} discount`;
      case 'FREE_SHIPPING':
        return 'Free shipping';
      default:
        return 'Discount';
    }
  }
}
