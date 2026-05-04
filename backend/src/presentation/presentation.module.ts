// 🏗️ PRESENTATION MODULE - Módulo raíz de presentación
// PROPÓSITO: Exportar todos los controllers, guards y decoradores

import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import {
  ProductsController,
  CategoriesController,
} from './controllers/products.controller';
import { AdminProductsController } from './controllers/admin.products.controller';
import {
  CartController,
  WishlistController,
} from './controllers/cart.controller';
import { OrderController } from './controllers/order.controller';
import { PaymentController } from './controllers/payment.controller';
import { PaymentsController } from './controllers/payments.controller';
import { DashboardController } from './controllers/dashboard.controller';
import {
  JwtAuthGuard,
  RolesGuard,
  PermissionsGuard,
  ThrottlingGuard,
} from './guards/jwt-auth.guard';

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
  imports: [ApplicationModule, InfrastructureModule],
  controllers: [
    AuthController,
    UsersController,
    ProductsController,
    CategoriesController,
    AdminProductsController,
    CartController,
    WishlistController,
    OrderController,
    PaymentController,
    PaymentsController,
    DashboardController,
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
