// 🏗️ PRESENTATION DECORATORS - Decoradores para metadatos
// PROPÓSITO: Añadir metadatos a controllers y métodos para seguridad y documentación

import { SetMetadata } from '@nestjs/common';

// EJEMPLO: Constantes para metadatos
export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';
export const IS_PUBLIC_KEY = 'isPublic';

// EJEMPLO: Decorador para marcar rutas como públicas
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// EJEMPLO: Decorador para especificar roles requeridos
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// EJEMPLO: Decorador para especificar permisos requeridos
export const Permissions = (...permissions: string[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);

// EJEMPLO: Decorador para throttle personalizado
export const Throttle = (limit: number, ttl: number) => 
  SetMetadata('throttle', { limit, ttl });

// EJEMPLO: Decorador para cache
export const Cache = (ttl: number = 300) => 
  SetMetadata('cache', { ttl });

// EJEMPLO: Decorador para auditoría
export const Audit = (action: string) => 
  SetMetadata('audit', { action });

// EJEMPLO: Decorador para validación personalizada
export const Validate = (validator: string) => 
  SetMetadata('validate', { validator });

// EJEMPLO: Decorador para documentación personalizada
export const ApiDocumentation = (summary: string, description?: string) => 
  SetMetadata('apiDocs', { summary, description });

// EJEMPLO: Decorador para medición de performance
export const TrackPerformance = (threshold?: number) => 
  SetMetadata('performance', { threshold });

// EJEMPLO: Decorador para manejo de errores específicos
export const ErrorHandler = (errorType: string, handler: string) => 
  SetMetadata('errorHandler', { errorType, handler });

// EJEMPLO: Decorador para transformación de respuesta
export const Transform = (transformer: string) => 
  SetMetadata('transform', { transformer });

// EJEMPLO: Decorador para logging personalizado
export const Log = (level: 'debug' | 'info' | 'warn' | 'error' = 'info', message?: string) => 
  SetMetadata('log', { level, message });

// EJEMPLO: Decorador para rate limiting por usuario
export const UserRateLimit = (maxRequests: number, windowMs: number) => 
  SetMetadata('userRateLimit', { maxRequests, windowMs });

// EJEMPLO: Decorador para validación de negocio
export const BusinessRule = (rule: string, params?: any) => 
  SetMetadata('businessRule', { rule, params });

// EJEMPLO: Decorador para feature flags
export const FeatureFlag = (flag: string, defaultValue: boolean = false) => 
  SetMetadata('featureFlag', { flag, defaultValue });

// EJEMPLO: Decorador para versionado de API
export const ApiVersion = (version: string) => 
  SetMetadata('apiVersion', { version });

// EJEMPLO: Decorador para deprecated endpoints
export const Deprecated = (message?: string, removalVersion?: string) => 
  SetMetadata('deprecated', { message, removalVersion });

// EJEMPLO: Decorador para paginación automática
export const Paginate = (defaultLimit: number = 10, maxLimit: number = 100) => 
  SetMetadata('paginate', { defaultLimit, maxLimit });

// EJEMPLO: Decorador para ordenamiento automático
export const Sort = (defaultField: string = 'createdAt', defaultDirection: 'asc' | 'desc' = 'desc') => 
  SetMetadata('sort', { defaultField, defaultDirection });

// EJEMPLO: Decorador para filtrado automático
export const Filter = (allowedFields: string[]) => 
  SetMetadata('filter', { allowedFields });

// EJEMPLO: Decorador para búsqueda automática
export const Search = (searchableFields: string[]) => 
  SetMetadata('search', { searchableFields });

// EJEMPLO: Decorador para inclusión de relaciones
export const Include = (relations: string[]) => 
  SetMetadata('include', { relations });

// EJEMPLO: Decorador para selección de campos
export const Select = (fields: string[]) => 
  SetMetadata('select', { fields });

// EJEMPLO: Decorador para agregación automática
export const Aggregate = (groupBy: string[], aggregations: any[]) => 
  SetMetadata('aggregate', { groupBy, aggregations });

// EJEMPLO: Decorador para transacciones automáticas
export const Transaction = (isolation?: string) => 
  SetMetadata('transaction', { isolation });

// EJEMPLO: Decorador para rollback automático
export const Rollback = (condition?: string) => 
  SetMetadata('rollback', { condition });

// EJEMPLO: Decorador para retry automático
export const Retry = (maxAttempts: number = 3, delay: number = 1000) => 
  SetMetadata('retry', { maxAttempts, delay });

// EJEMPO: Decorador para circuit breaker
export const CircuitBreaker = (failureThreshold: number = 5, timeout: number = 60000) => 
  SetMetadata('circuitBreaker', { failureThreshold, timeout });

// EJEMPLO: Decorador para bulkhead pattern
export const Bulkhead = (maxConcurrent: number = 10, maxQueue: number = 100) => 
  SetMetadata('bulkhead', { maxConcurrent, maxQueue });

// EJEMPLO: Decorador para timeout
export const Timeout = (timeoutMs: number) => 
  SetMetadata('timeout', { timeoutMs });

// EJEMPLO: Decorador para compresión de respuesta
export const Compress = (algorithm: 'gzip' | 'deflate' | 'br' = 'gzip') => 
  SetMetadata('compress', { algorithm });

// EJEMPLO: Decorador para CORS personalizado
export const Cors = (origins: string[], methods: string[] = ['GET'], headers: string[] = []) => 
  SetMetadata('cors', { origins, methods, headers });

// EJEMPLO: Decorador para seguridad adicional
export const Security = (options: {
  noSniff?: boolean;
  frameGuard?: boolean;
  xssProtection?: boolean;
  hsts?: boolean;
}) => SetMetadata('security', options);
