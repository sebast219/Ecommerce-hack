// 🏗️ PRESENTATION INTERCEPTORS - Interceptors globales
// PROPÓSITO: Interceptar requests/responses para logging, transformación y caching

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// EJEMPLO: Interceptor para logging de requests
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly requests = new Map<string, number>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    // EJEMPLO: Agregar ID de request al objeto
    request.requestId = requestId;
    this.requests.set(requestId, startTime);

    console.log(`[${requestId}] ${request.method} ${request.url} - Started`);

    return next
      .handle()
      .pipe(
        tap({
          next: (data) => {
            const duration = Date.now() - startTime;
            console.log(`[${requestId}] ${request.method} ${request.url} - Success (${duration}ms)`);
            this.requests.delete(requestId);
          },
          error: (error) => {
            const duration = Date.now() - startTime;
            console.log(`[${requestId}] ${request.method} ${request.url} - Error (${duration}ms):`, error.message);
            this.requests.delete(requestId);
          },
        }),
      );
  }

  // EJEMPLO: Generar ID único para cada request
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// EJEMPLO: Interceptor para transformación de respuestas
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap((data) => {
        // EJEMPLO: Transformar respuesta a formato estándar
        if (data && typeof data === 'object' && !data.success) {
          // Si ya tiene formato de respuesta, no transformar
          return;
        }

        // EJEMPLO: Agregar metadata de respuesta
        const transformedResponse = {
          success: true,
          data,
          message: 'Operation successful',
          timestamp: new Date().toISOString(),
          path: request.url,
          requestId: request.requestId,
        };

        // EJEMPLO: Reemplazar la respuesta original
        // (Esto se maneja mejor con un Response Interceptor personalizado)
        console.log('Response transformed:', transformedResponse);
      }),
    );
  }
}

// EJEMPLO: Interceptor para caching
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, { data: any; expiry: number }>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(request);

    // EJEMPLO: Verificar si existe en cache
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      console.log(`Cache hit for ${cacheKey}`);
      return new Observable((observer) => {
        observer.next(cached.data);
        observer.complete();
      });
    }

    console.log(`Cache miss for ${cacheKey}`);

    return next.handle().pipe(
      tap((data) => {
        // EJEMPLO: Almacenar en cache
        const ttl = this.getCacheTTL(context);
        this.cache.set(cacheKey, {
          data,
          expiry: Date.now() + ttl * 1000,
        });
        console.log(`Cached ${cacheKey} for ${ttl}s`);
      }),
    );
  }

  // EJEMPLO: Generar clave de cache basada en request
  private generateCacheKey(request: any): string {
    const url = request.url;
    const method = request.method;
    const query = JSON.stringify(request.query || {});
    return `${method}:${url}:${query}`;
  }

  // EJEMPLO: Obtener TTL de metadatos del endpoint
  private getCacheTTL(context: ExecutionContext): number {
    const reflector = context.getHandler();
    // Aquí se leería el decorador @Cache(ttl)
    return 300; // Default 5 minutos
  }
}

// EJEMPLO: Interceptor para medición de performance
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = process.hrtime.bigint();

    return next.handle().pipe(
      tap(() => {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1000000; // Convertir a milisegundos

        // EJEMPLO: Log de performance
        console.log(`Performance: ${request.method} ${request.url} took ${duration.toFixed(2)}ms`);

        // EJEMPLO: Alerta si es muy lento
        const threshold = this.getPerformanceThreshold(context);
        if (duration > threshold) {
          console.warn(`Slow request detected: ${request.method} ${request.url} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
        }
      }),
    );
  }

  // EJEMPLO: Obtener umbral de performance de metadatos
  private getPerformanceThreshold(context: ExecutionContext): number {
    // Aquí se leería el decorador @TrackPerformance(threshold)
    return 1000; // Default 1 segundo
  }
}

// EJEMPLO: Interceptor para auditoría
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // EJEMPLO: Registrar acción antes de ejecutar
    this.logAudit({
      userId: user?.id,
      action: this.getAction(context),
      resource: this.getResource(context),
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.get('User-Agent'),
      timestamp: new Date(),
      status: 'STARTED',
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          // EJEMPLO: Registrar éxito
          this.logAudit({
            userId: user?.id,
            action: this.getAction(context),
            resource: this.getResource(context),
            method: request.method,
            url: request.url,
            ip: request.ip,
            userAgent: request.get('User-Agent'),
            timestamp: new Date(),
            status: 'SUCCESS',
            response: data,
          });
        },
        error: (error) => {
          // EJEMPLO: Registrar error
          this.logAudit({
            userId: user?.id,
            action: this.getAction(context),
            resource: this.getResource(context),
            method: request.method,
            url: request.url,
            ip: request.ip,
            userAgent: request.get('User-Agent'),
            timestamp: new Date(),
            status: 'ERROR',
            error: error.message,
          });
        },
      }),
    );
  }

  // EJEMPLO: Extraer acción del contexto
  private getAction(context: ExecutionContext): string {
    const handler = context.getHandler();
    return handler.name || 'UNKNOWN_ACTION';
  }

  // EJEMPLO: Extraer recurso del contexto
  private getResource(context: ExecutionContext): string {
    const controller = context.getClass();
    const handler = context.getHandler();
    return `${controller.name}.${handler.name}`;
  }

  // EJEMPLO: Método para registrar auditoría
  private logAudit(audit: any): void {
    console.log('AUDIT:', JSON.stringify(audit));
    // Aquí se guardaría en base de datos o servicio de auditoría
  }
}
