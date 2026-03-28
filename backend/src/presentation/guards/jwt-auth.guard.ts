// 🏗️ PRESENTATION GUARDS - Seguridad y protección de rutas
// PROPÓSITO: Implementar middleware de seguridad para proteger endpoints

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

// EJEMPLO: Guard de autenticación JWT
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// EJEMPLO: Guard de roles
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // EJEMPLO: Obtener roles requeridos del decorador
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    // EJEMPLO: Obtener usuario del request (seteado por JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      return false;
    }

    // EJEMPLO: Verificar si el usuario tiene los roles requeridos
    return requiredRoles.some((role) => user.role === role);
  }
}

// EJEMPLO: Guard de permisos granulares
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // EJEMPLO: Obtener permisos requeridos
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    // EJEMPLO: Obtener usuario y sus permisos
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.permissions) {
      return false;
    }

    // EJEMPLO: Verificar permisos específicos
    return requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );
  }
}

// EJEMPLO: Guard de throttling (rate limiting)
@Injectable()
export class ThrottlingGuard implements CanActivate {
  private readonly requests = new Map<
    string,
    { count: number; resetTime: number }
  >();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp = request.ip || request.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minuto
    const maxRequests = 10; // Máximo 10 requests por minuto

    // EJEMPLO: Limpiar registros expirados
    this.cleanupExpiredRecords(now);

    // EJEMPLO: Obtener o crear registro del cliente
    let clientRecord = this.requests.get(clientIp);

    if (!clientRecord || now > clientRecord.resetTime) {
      clientRecord = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      clientRecord.count++;
    }

    this.requests.set(clientIp, clientRecord);

    // EJEMPLO: Verificar si excede el límite
    if (clientRecord.count > maxRequests) {
      return false;
    }

    return true;
  }

  // EJEMPLO: Método para limpiar registros expirados
  private cleanupExpiredRecords(now: number): void {
    for (const [ip, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(ip);
      }
    }
  }
}
