import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EmailService } from '../../infrastructure/email/email.service';
import { renderOrderConfirmationEmail } from '../../infrastructure/email/templates/order-confirmation.template';

@Injectable()
export class OrderEmailService {
  private readonly logger = new Logger(OrderEmailService.name);
  private readonly frontendUrl: string;
  private readonly supportEmail: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:3000');
    this.supportEmail = configService.get('SUPPORT_EMAIL', 'support@cybershield.com');
  }

  /**
   * Envía email de confirmación de orden pagada.
   * Idempotente: solo se envía UNA vez por orden.
   */
  async sendOrderConfirmation(orderId: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    });

    if (!order) {
      this.logger.error(`Order ${orderId} not found for email`);
      return;
    }

    // Construir datos del template
    const emailData = {
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: Number(item.price),
        total: Number(item.price) * item.quantity,
      })),
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      shipping: Number(order.shipping),
      total: Number(order.total),
      trackingUrl: `${this.frontendUrl}/orders/${order.id}`,
      supportEmail: this.supportEmail,
    };

    const { subject, html } = renderOrderConfirmationEmail(emailData);

    // IDEMPOTENCY KEY: solo se envía UNA vez
    const idempotencyKey = `order_confirmation_${orderId}`;

    await this.emailService.send({
      to: order.customerEmail,
      subject,
      html,
      template: 'order_confirmation',
      idempotencyKey,
      orderId: order.id,
      userId: order.userId,
      metadata: { orderNumber: order.orderNumber, total: emailData.total },
    });

    // Crear evento de tracking
    await this.prisma.orderEvent.create({
      data: {
        orderId: order.id,
        type: 'EMAIL_SENT',
        description: `Order confirmation email sent to ${this.maskEmail(order.customerEmail)}`,
        triggeredBy: 'system',
        metadata: JSON.stringify({ template: 'order_confirmation' }),
      },
    });
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    return `${local[0]}***@${domain}`;
  }
}
