/**
 * CART TYPES - EJERCICIO PRÁCTICO
 * 
 * CONCEPTOS QUE APRENDERÁS:
 * - Type Definitions: Definición de tipos TypeScript
 * - Interface Design: Diseño de interfaces robustas
 * - Data Structures: Estructuras de datos complejas
 * - Type Safety: Seguridad de tipos en tiempo de compilación
 * 
 * RECURSOS DE APRENDIZAJE:
 * - TypeScript Interfaces: https://www.typescriptlang.org/docs/handbook/interfaces.html
 * - Advanced Types: https://www.typescriptlang.org/docs/handbook/advanced-types.html
 */

import { Product } from '@prisma/client';

// TODO: Definir interfaz CartItem
export interface CartItem {
  id: string;
  quantity: number;
  price: number;
  // CONCEPTO: Price snapshot
  // - Guardar precio al momento de agregar
  // - Evita cambios si el producto varía
  // - Útil para análisis histórico
  
  product: Product;
  // CONCEPTO: Relación con producto
  // - Include completo del producto
  // - Datos para mostrar en UI
  // - Información de inventario
  
  addedAt: Date;
  // CONCEPTO: Timestamp de agregado
  // - Para ordenamiento y análisis
  // - Útil para carritos abandonados
}

// TODO: Definir interfaz CartSummary
export interface CartSummary {
  id: string;
  items: CartItem[];
  subtotal: number;
  taxes: number;
  total: number;
  itemCount: number;
  
  // CONCEPTO: Cálculos del carrito
  // - subtotal: Suma de (price * quantity)
  // - taxes: Calculado basado en ubicación
  // - total: subtotal + taxes + shipping
  // - itemCount: Total de unidades
  
  // TODO: (Opcional) Agregar campos adicionales
  // discount?: number;
  // shipping?: number;
  // couponCode?: string;
  // estimatedDelivery?: Date;
  
  // CONCEPTO: Campos extendidos
  // - Descuentos aplicados
  // - Costos de envío
  // - Códigos de cupón
  // - Estimación de entrega
}

// TODO: Definir interfaz CartAnalytics
export interface CartAnalytics {
  totalCarts: number;
  abandonedCarts: number;
  conversionRate: number;
  averageCartValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    timesAdded: number;
  }>;
  
  // CONCEPTO: Métricas de negocio
  // - totalCarts: Carritos creados
  // - abandonedCarts: Carritos no convertidos
  // - conversionRate: Porcentaje de conversión
  // - averageCartValue: Valor promedio del carrito
  // - topProducts: Productos más agregados
}

// TODO: Definir interfaz DiscountApplication
export interface DiscountApplication {
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  appliedAmount: number;
  
  // CONCEPTO: Aplicación de descuentos
  // - code: Código del cupón
  // - type: Tipo de descuento
  // - value: Valor del descuento
  // - appliedAmount: Monto aplicado
}

// TODO: Definir tipo CartStatus
export type CartStatus = 'ACTIVE' | 'ABANDONED' | 'CONVERTED' | 'EXPIRED';

// CONCEPTO: Estados del carrito
// - ACTIVE: Carrito en uso
// - ABANDONED: Sin actividad por tiempo
// - CONVERTED: Convertido en orden
// - EXPIRED: Vencido por tiempo

// TODO: Definir interfaz Cart con estado
export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  status: CartStatus;
  items: CartItem[];
  summary: CartSummary;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  
  // CONCEPTO: Carrito completo
  // - userId: Carrito de usuario autenticado
  // - sessionId: Carrito de invitado
  // - status: Estado actual
  // - expiresAt: Fecha de expiración
}
