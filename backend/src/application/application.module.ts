// 🏗️ APPLICATION MODULE - Módulo raíz de casos de uso
// PROPÓSITO: Exportar todos los casos de uso y DTOs de la aplicación

import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { CreateUserUseCase } from './use-cases/auth/create-user.use-case';
import { LoginUseCase } from './use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from './use-cases/auth/refresh-token.use-case';
import {
  GetProductsUseCase,
  GetProductUseCase,
} from './use-cases/products/get-products.use-case';
import { CreateProductUseCase } from './use-cases/products/create-product.use-case';
import { UpdateProductUseCase } from './use-cases/products/update-product.use-case';
import { DeleteProductUseCase } from './use-cases/products/delete-product.use-case';
import { REFRESH_TOKEN_REPOSITORY } from '../domain/repositories/cart.repository.interface';
import { UserDomainService } from '../domain/services/user.domain.service';
// Cart Use Cases
import { AddToCartUseCase } from './use-cases/cart/add-to-cart.use-case';
import { GetCartUseCase } from './use-cases/cart/get-cart.use-case';
import { UpdateCartItemUseCase } from './use-cases/cart/update-cart-item.use-case';
import { RemoveFromCartUseCase } from './use-cases/cart/remove-from-cart.use-case';
import { ClearCartUseCase } from './use-cases/cart/clear-cart.use-case';

// Order Use Cases
import { CreateOrderUseCase } from './use-cases/order/create-order.use-case';
import { GetOrdersUseCase } from './use-cases/order/get-orders.use-case';
import { GetOrderByIdUseCase } from './use-cases/order/get-order-by-id.use-case';
import { CancelOrderUseCase } from './use-cases/order/cancel-order.use-case';

// Payment Use Cases
import { CreatePaymentIntentUseCase } from './use-cases/payment/create-payment-intent.use-case';
import { HandleStripeWebhookUseCase } from './use-cases/payment/handle-stripe-webhook.use-case';

// Order Services
import { OrderEmailService } from './services/order-email.service';

// Order Use Cases adicionales
import { GetOrderTrackingUseCase } from './use-cases/order/get-order-tracking.use-case';

// Dashboard Service
import { DashboardService } from './services/dashboard.service';

@Module({
  imports: [InfrastructureModule],
  providers: [
    GetProductsUseCase,
    GetProductUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    CreateUserUseCase,
    LoginUseCase,
    RefreshTokenUseCase,

    // Cart Use Cases
    AddToCartUseCase,
    GetCartUseCase,
    UpdateCartItemUseCase,
    RemoveFromCartUseCase,
    ClearCartUseCase,

    // Order Use Cases
    CreateOrderUseCase,
    GetOrdersUseCase,
    GetOrderByIdUseCase,
    CancelOrderUseCase,

    // Payment Use Cases
    CreatePaymentIntentUseCase,
    HandleStripeWebhookUseCase,

    // Order Services
    OrderEmailService,
    GetOrderTrackingUseCase,

    // Dashboard Service
    DashboardService,

    UserDomainService,
  ],
  exports: [
    GetProductsUseCase,
    GetProductUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    DashboardService,
    CreateUserUseCase,
    LoginUseCase,
    RefreshTokenUseCase,

    // Cart Use Cases
    AddToCartUseCase,
    GetCartUseCase,
    UpdateCartItemUseCase,
    RemoveFromCartUseCase,
    ClearCartUseCase,

    // Order Use Cases
    CreateOrderUseCase,
    GetOrdersUseCase,
    GetOrderByIdUseCase,
    CancelOrderUseCase,

    // Payment Use Cases
    CreatePaymentIntentUseCase,
    HandleStripeWebhookUseCase,

    // Dashboard Service
    DashboardService,
  ],
})
export class ApplicationModule {}
