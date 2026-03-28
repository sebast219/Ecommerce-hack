// 🏗️ PRESENTATION MODULE - Módulo raíz de presentación
// PROPÓSITO: Exportar todos los controllers, guards y decoradores

import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { AuthController } from './controllers/auth.controller';
import { ProductsController } from './controllers/products.controller';
import { CartController, WishlistController } from './controllers/cart.controller';
import { JwtAuthGuard, RolesGuard, PermissionsGuard, ThrottlingGuard } from './guards/jwt-auth.guard';

// Categories controller - verificar si está en products.controller
// import { CategoriesController } from './controllers/categories.controller';

// EJEMPLO: Exportar guards
export {
  JwtAuthGuard,
  RolesGuard,
  PermissionsGuard,
  ThrottlingGuard,
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
  Security,
} from './decorators/roles.decorator';

@Module({
  imports: [
    ApplicationModule,
  ],
  controllers: [
    AuthController,
    ProductsController,
    CartController,
    WishlistController,
    // CategoriesController,
  ],
  providers: [
    // JwtAuthGuard,
    // RolesGuard,
    // PermissionsGuard,
    // ThrottlingGuard,
  ],
  exports: [
    // JwtAuthGuard,
    // RolesGuard,
    // PermissionsGuard,
    // ThrottlingGuard,
  ],
})
export class PresentationModule {}
