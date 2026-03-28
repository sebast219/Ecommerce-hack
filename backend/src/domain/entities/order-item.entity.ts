// 🏗️ DOMAIN ENTITY - OrderItem
// PROPÓSITO: Entidad de dominio que representa un ítem de pedido

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
