import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { PrismaService } from '../database/prisma.service';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  template: string;
  idempotencyKey: string;
  orderId?: string;
  userId?: string;
  metadata?: any;
}

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private fromEmail: string;
  private isEnabled: boolean = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>(
      'EMAIL_FROM',
      'CyberShield <noreply@cybershield.com>',
    );

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured - emails disabled');
      return;
    }

    this.resend = new Resend(apiKey);
    this.isEnabled = true;
    this.logger.log('Email service initialized (Resend)');
  }

  /**
   * Envía un email con:
   * - Idempotencia (no envía duplicados)
   * - Logging completo
   */
  async send(params: SendEmailParams): Promise<{ success: boolean; emailId?: string }> {
    // IDEMPOTENCY CHECK
    const existing = await this.prisma.emailLog.findUnique({
      where: { idempotencyKey: params.idempotencyKey },
    });

    if (existing) {
      if (existing.status === 'SENT') {
        this.logger.log(
          `Email already sent (idempotent): ${params.idempotencyKey}`,
        );
        return { success: true, emailId: existing.providerId || undefined };
      }

      // Si está PENDING o FAILED, intentar reenviar
      this.logger.log(
        `Retrying email ${params.idempotencyKey} (previous status: ${existing.status})`,
      );
    }

    // Crear o actualizar registro
    const emailLog = await this.prisma.emailLog.upsert({
      where: { idempotencyKey: params.idempotencyKey },
      create: {
        idempotencyKey: params.idempotencyKey,
        to: params.to,
        subject: params.subject,
        template: params.template,
        orderId: params.orderId,
        userId: params.userId,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        status: 'PENDING',
        attempts: 1,
        lastAttemptAt: new Date(),
      },
      update: {
        attempts: { increment: 1 },
        lastAttemptAt: new Date(),
        status: 'PENDING',
        errorMessage: null,
      },
    });

    if (!this.isEnabled) {
      this.logger.warn(`Email disabled, skipping: ${params.subject} to ${params.to}`);
      // En desarrollo, marcar como enviado para no bloquear el flujo
      await this.prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          metadata: JSON.stringify({ ...(params.metadata || {}), simulated: true }),
        },
      });
      return { success: true };
    }

    try {
      // Envío con retry simple
      const result = await this.resend!.emails.send({
        from: this.fromEmail,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      // Marcar como enviado
      await this.prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          providerId: result.data?.id,
        },
      });

      this.logger.log(`Email sent: ${params.subject} -> ${this.maskEmail(params.to)}`);
      return { success: true, emailId: result.data?.id };
    } catch (error: any) {
      this.logger.error(
        `Email failed: ${params.subject} -> ${this.maskEmail(params.to)}: ${error.message}`,
      );

      await this.prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      // No lanzar excepción - el flujo principal no debe fallar por email
      return { success: false };
    }
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    return `${local[0]}***@${domain}`;
  }
}
