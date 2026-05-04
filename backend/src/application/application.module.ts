// 🏗️ APPLICATION MODULE - Módulo raíz de casos de uso
// PROPÓSITO: Exportar todos los casos de uso y DTOs de la aplicación

import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { CreateUserUseCase, LoginUseCase } from './use-cases/auth/create-user.use-case';
import { RefreshTokenUseCase } from './use-cases/auth/refresh-token.use-case';
import { GetProductsUseCase, GetProductUseCase } from './use-cases/products/get-products.use-case';
import {
  GetCartUseCase,
  AddToCartUseCase,
  UpdateCartItemUseCase,
  RemoveFromCartUseCase,
} from './use-cases/cart/manage-cart.use-case';
import {
  CreateOrderUseCase,
  GetUserOrdersUseCase,
  GetOrderUseCase,
} from './use-cases/orders/manage-orders.use-case';

@Module({
  imports: [
    InfrastructureModule,
  ],
  providers: [
    GetProductsUseCase,
    GetProductUseCase,
    CreateUserUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    GetCartUseCase,
    AddToCartUseCase,
    UpdateCartItemUseCase,
    RemoveFromCartUseCase,
    CreateOrderUseCase,
    GetUserOrdersUseCase,
    GetOrderUseCase,
  ],
  exports: [
    GetProductsUseCase,
    GetProductUseCase,
    CreateUserUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    GetCartUseCase,
    AddToCartUseCase,
    UpdateCartItemUseCase,
    RemoveFromCartUseCase,
    CreateOrderUseCase,
    GetUserOrdersUseCase,
    GetOrderUseCase,
  ],
})
export class ApplicationModule {}
