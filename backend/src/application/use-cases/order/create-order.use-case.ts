import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

export interface CreateOrderCommand {
  userId: string;
  shippingAddressId?: string;
  notes?: string;
}

export interface OrderResult {
  orderId: string;
  orderNumber: string;
  total: number;
  itemCount: number;
  status: string;
}

@Injectable()
export class CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCase.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateOrderCommand): Promise<OrderResult> {
    // Usar transacción para consistencia
    return this.prisma.$transaction(
      async (tx) => {
        // 1. Obtener información del usuario para el snapshot
        const user = await tx.user.findUnique({
          where: { id: command.userId },
          select: { email: true, firstName: true, lastName: true },
        });

        if (!user) {
          throw new BadRequestException('User not found');
        }

        // 2. Obtener el carrito del usuario y sus items
        const cart = await tx.cart.findUnique({
          where: { userId: command.userId },
        });

        if (!cart) {
          throw new BadRequestException('Cart not found');
        }

        const cartItems = await tx.cartItem.findMany({
          where: { cartId: cart.id },
          include: {
            product: {
              include: {
                inventory: true,
              },
            },
          },
        });

        if (cartItems.length === 0) {
          throw new BadRequestException('Cart is empty');
        }

        // 2. Validar stock y calcular totales
        let subtotal = 0;
        const orderItemsData: any[] = [];
        const inventoryUpdates: any[] = [];

        for (const item of cartItems) {
          if (!item.product.isActive) {
            throw new BadRequestException(
              `Product "${item.product.name}" is no longer available`,
            );
          }

          // Obtener stock real de productInventory
          const inventory = item.product.inventory;
          const stock = inventory?.quantity || 0;
          const trackStock = inventory?.track ?? true;

          // Si no hay inventario o no se rastrea, permitir (comportamiento actual)
          if (trackStock && stock < item.quantity) {
            throw new ConflictException(
              `Insufficient stock for "${item.product.name}". Only ${stock} available`,
            );
          }

          const unitPrice = Number(item.product.price);
          const itemTotal = unitPrice * item.quantity;

          subtotal += itemTotal;

          orderItemsData.push({
            productId: item.productId,
            quantity: item.quantity,
            price: unitPrice,
          });

          // Preparar actualización de inventory (solo si se rastrea stock)
          if (trackStock && inventory) {
            inventoryUpdates.push({
              productId: item.productId,
              newQuantity: stock - item.quantity,
            });
          }
        }

        // 3. Calcular impuestos y envío
        const tax = parseFloat((subtotal * 0.08).toFixed(2)); // 8% tax
        const shipping = subtotal > 100 ? 0 : 9.99; // free shipping > $100
        const total = parseFloat((subtotal + tax + shipping).toFixed(2));

        // 4. Generar número de orden único
        const orderNumber = this.generateOrderNumber();

        // 5. Crear la orden
        const order = await tx.order.create({
          data: {
            orderNumber,
            userId: command.userId,
            status: 'PENDING',
            subtotal,
            tax,
            shipping,
            total,
            // Snapshot del cliente para emails
            customerEmail: user.email,
            customerName: `${user.firstName} ${user.lastName}`,
            notes: command.notes,
            shippingAddressId: command.shippingAddressId || null,
            items: {
              create: orderItemsData,
            },
          },
          include: {
            items: {
              include: {
                product: {
                  select: { id: true, name: true, slug: true, images: true },
                },
              },
            },
          },
        });

        // 6. RESERVAR INVENTARIO (decrementar stock)
        for (const update of inventoryUpdates) {
          await tx.productInventory.update({
            where: { productId: update.productId },
            data: { quantity: update.newQuantity },
          });
        }

        // 7. Limpiar carrito
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        this.logger.log(
          `Order created: ${orderNumber} for user ${command.userId}`,
        );

        return {
          orderId: order.id,
          orderNumber: order.orderNumber,
          total: Number(order.total),
          itemCount: orderItemsData.length,
          status: order.status,
        };
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: 'Serializable', // Evita race conditions
      },
    );
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}
