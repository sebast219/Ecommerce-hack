import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payment, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(paymentData: {
    orderId: string;
    stripeSessionId?: string;
    amount: number;
  }): Promise<Payment> {
    return this.prisma.payment.create({
      data: paymentData,
      include: {
        order: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByStripeSessionId(stripeSessionId: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { stripeSessionId },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getPaymentStats() {
    const [total, pending, success, failed] = await Promise.all([
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.SUCCESS } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
    ]);

    return {
      total,
      pending,
      success,
      failed,
    };
  }
}
