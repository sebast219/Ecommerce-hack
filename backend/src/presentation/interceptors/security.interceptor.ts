// 🛡️ SECURITY INTERCEPTOR - Headers de seguridad enterprise
// PROPÓSITO: Implementar headers de seguridad HTTP para protección avanzada

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    
    // Headers de seguridad OWASP recomendados
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('X-XSS-Protection', '1; mode=block');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Permissions-Policy', 
      'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
    );
    
    // Content Security Policy (CSP) estricto
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://js.stripe.com",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    response.setHeader('Content-Security-Policy', csp);
    
    // Headers adicionales para e-commerce
    response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.setHeader('Expect-CT', 'max-age=86400, enforce');
    
    return next.handle().pipe(
      map(data => {
        // Remover información sensible en respuestas
        if (data && typeof data === 'object') {
          return this.sanitizeResponse(data);
        }
        return data;
      })
    );
  }

  private sanitizeResponse(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeResponse(item));
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized = { ...obj };
      
      // Campos sensibles a remover en todas las respuestas
      const sensitiveFields = ['password', 'hashedPassword', 'salt', 'secret', 'token', 'apiKey'];
      
      sensitiveFields.forEach(field => {
        if (field in sanitized) {
          delete sanitized[field];
        }
      });
      
      // Sanitizar objetos anidados
      Object.keys(sanitized).forEach(key => {
        if (typeof sanitized[key] === 'object') {
          sanitized[key] = this.sanitizeResponse(sanitized[key]);
        }
      });
      
      return sanitized;
    }
    
    return obj;
  }
}
