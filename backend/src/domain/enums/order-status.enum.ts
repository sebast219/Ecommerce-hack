export enum OrderStatus {
  // Estados iniciales
  PENDING = 'PENDING', // Orden creada, esperando pago
  AWAITING_PAYMENT = 'AWAITING_PAYMENT', // PaymentIntent creado en Stripe

  // Estados de pago
  PAID = 'PAID', // Pago confirmado por webhook
  PAYMENT_FAILED = 'PAYMENT_FAILED', // Pago rechazado

  // Estados de fulfillment
  PROCESSING = 'PROCESSING', // En preparación
  SHIPPED = 'SHIPPED', // Enviado
  DELIVERED = 'DELIVERED', // Entregado

  // Estados terminales negativos
  CANCELLED = 'CANCELLED', // Cancelada por usuario/admin
  REFUNDED = 'REFUNDED', // Reembolsada
  EXPIRED = 'EXPIRED', // Sin pago en X tiempo
}

// Transiciones permitidas (state machine)
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [
    OrderStatus.AWAITING_PAYMENT,
    OrderStatus.PAID, // Allow direct PENDING -> PAID for mock payments
    OrderStatus.CANCELLED,
    OrderStatus.EXPIRED,
  ],
  [OrderStatus.AWAITING_PAYMENT]: [
    OrderStatus.PAID,
    OrderStatus.PAYMENT_FAILED,
    OrderStatus.CANCELLED,
    OrderStatus.EXPIRED,
  ],
  [OrderStatus.PAYMENT_FAILED]: [
    OrderStatus.AWAITING_PAYMENT, // Retry payment
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.REFUNDED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.REFUNDED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.REFUNDED],
  [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
  // Estados terminales
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.REFUNDED]: [],
  [OrderStatus.EXPIRED]: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
