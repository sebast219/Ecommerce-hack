// 🏗️ PRESENTATION MODULE - Módulo raíz de presentación
// PROPÓSITO: Exportar todos los controllers, guards y decoradores

import { Module } from '@nestjs/common';

// EJEMPLO: Exportar controllers
export { 
  AuthController, 
  ProductsController, 
  AdminController 
} from './controllers/auth.controller';

// EJEMPLO: Exportar guards
export { 
  JwtAuthGuard, 
  RolesGuard, 
  PermissionsGuard, 
  ThrottlingGuard 
} from './guards/jwt-auth.guard';

// EJEMPLO: Exportar decoradores
export { 
  Public, 
  Roles, 
  Permissions, 
  Throttle,
  Cache,
  Audit,
  Validate,
  ApiDocumentation,
  TrackPerformance,
  ErrorHandler,
  Transform,
  Log,
  UserRateLimit,
  BusinessRule,
  FeatureFlag,
  ApiVersion,
  Deprecated,
  Paginate,
  Sort,
  Filter,
  Search,
  Include,
  Select,
  Aggregate,
  Transaction,
  Rollback,
  Retry,
  CircuitBreaker,
  Bulkhead,
  Timeout,
  Compress,
  Cors,
  Security
} from './decorators/roles.decorator';

@Module({
  controllers: [
    // EJEMPLO: Controllers HTTP
    // AuthController,
    // ProductsController,
    // AdminController,
  ],
  providers: [
    // EJEMPLO: Guards y middleware
    // JwtAuthGuard,
    // RolesGuard,
    // PermissionsGuard,
    // ThrottlingGuard,
  ],
  exports: [
    // EJEMPLO: Exportar guards para otros módulos
    // JwtAuthGuard,
    // RolesGuard,
    // PermissionsGuard,
    // ThrottlingGuard,
  ],
})
export class PresentationModule {}
