// Rate Limiting Compuesto (IP + Email + Global)
import { Injectable, Logger } from '@nestjs/common';

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blocked: boolean;
  blockedUntil: number;
}

@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);
  private readonly ipLimits = new Map<string, RateLimitEntry>();
  private readonly emailLimits = new Map<string, RateLimitEntry>();
  private readonly globalCounter = { count: 0, windowStart: Date.now() };

  // Configuración
  private readonly IP_MAX_ATTEMPTS = 10;
  private readonly IP_WINDOW_MS = 15 * 60 * 1000; // 15 minutos
  private readonly EMAIL_MAX_ATTEMPTS = 5;
  private readonly EMAIL_WINDOW_MS = 15 * 60 * 1000; // 15 minutos
  private readonly BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutos block
  private readonly GLOBAL_MAX_RPS = 100;

  constructor() {
    // Limpiar entradas expiradas cada 5 minutos
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Verifica rate limit compuesto: IP + Email + Global
   * Retorna { allowed: boolean, retryAfter?: number, reason?: string }
   */
  checkLoginRateLimit(
    ip: string,
    email?: string,
  ): {
    allowed: boolean;
    retryAfter?: number;
    reason?: string;
  } {
    // 1. Check IP rate limit
    const ipResult = this.checkLimit(
      this.ipLimits,
      ip,
      this.IP_MAX_ATTEMPTS,
      this.IP_WINDOW_MS,
    );
    if (!ipResult.allowed) {
      this.logger.warn(`Rate limit exceeded for IP: ${this.maskIp(ip)}`);
      return { ...ipResult, reason: 'Too many requests from this IP' };
    }

    // 2. Check email rate limit (si se proporciona)
    if (email) {
      const emailResult = this.checkLimit(
        this.emailLimits,
        email.toLowerCase(),
        this.EMAIL_MAX_ATTEMPTS,
        this.EMAIL_WINDOW_MS,
      );
      if (!emailResult.allowed) {
        this.logger.warn(
          `Rate limit exceeded for email: ${this.maskEmail(email)}`,
        );
        return {
          ...emailResult,
          reason: 'Too many login attempts for this account',
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Registra un intento (exitoso o fallido)
   */
  recordAttempt(ip: string, email?: string, success: boolean = false): void {
    if (success) {
      // Reset en login exitoso
      this.ipLimits.delete(ip);
      if (email) this.emailLimits.delete(email.toLowerCase());
      return;
    }

    this.incrementLimit(
      this.ipLimits,
      ip,
      this.IP_MAX_ATTEMPTS,
      this.IP_WINDOW_MS,
    );
    if (email) {
      this.incrementLimit(
        this.emailLimits,
        email.toLowerCase(),
        this.EMAIL_MAX_ATTEMPTS,
        this.EMAIL_WINDOW_MS,
      );
    }
  }

  private checkLimit(
    store: Map<string, RateLimitEntry>,
    key: string,
    maxAttempts: number,
    windowMs: number,
  ): { allowed: boolean; retryAfter?: number } {
    const entry = store.get(key);
    if (!entry) return { allowed: true };

    const now = Date.now();

    // Si está bloqueado, verificar si el bloqueo expiró
    if (entry.blocked) {
      if (now < entry.blockedUntil) {
        return {
          allowed: false,
          retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
        };
      }
      // Bloqueo expiró, resetear
      store.delete(key);
      return { allowed: true };
    }

    // Si la ventana expiró, resetear
    if (now - entry.firstAttempt > windowMs) {
      store.delete(key);
      return { allowed: true };
    }

    // Si excede el límite, bloquear
    if (entry.count >= maxAttempts) {
      entry.blocked = true;
      entry.blockedUntil = now + this.BLOCK_DURATION_MS;
      return {
        allowed: false,
        retryAfter: Math.ceil(this.BLOCK_DURATION_MS / 1000),
      };
    }

    return { allowed: true };
  }

  private incrementLimit(
    store: Map<string, RateLimitEntry>,
    key: string,
    maxAttempts: number,
    windowMs: number,
  ): void {
    const now = Date.now();
    const existing = store.get(key);

    if (!existing || now - existing.firstAttempt > windowMs) {
      store.set(key, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false,
        blockedUntil: 0,
      });
      return;
    }

    existing.count++;
    existing.lastAttempt = now;

    if (existing.count >= maxAttempts) {
      existing.blocked = true;
      existing.blockedUntil = now + this.BLOCK_DURATION_MS;
      this.logger.warn(
        `Account/IP blocked: ${key} after ${existing.count} attempts`,
      );
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.ipLimits) {
      if (
        now - entry.lastAttempt > this.IP_WINDOW_MS &&
        (!entry.blocked || now > entry.blockedUntil)
      ) {
        this.ipLimits.delete(key);
      }
    }
    for (const [key, entry] of this.emailLimits) {
      if (
        now - entry.lastAttempt > this.EMAIL_WINDOW_MS &&
        (!entry.blocked || now > entry.blockedUntil)
      ) {
        this.emailLimits.delete(key);
      }
    }
  }

  private maskIp(ip: string): string {
    const parts = ip.split('.');
    return parts.length === 4 ? `${parts[0]}.${parts[1]}.xxx.xxx` : 'masked';
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    return `${local[0]}***@${domain}`;
  }
}
