// 🏗️ INFRASTRUCTURE MODULE - Módulo raíz de infraestructura
// PROPÓSITO: Exportar todas las implementaciones concretas

import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepositoryImpl } from './database/repositories/user.repository.impl';
import { ProductRepositoryImpl } from './database/repositories/product.repository.impl';
import { CartRepositoryImpl, CartItemRepositoryImpl } from './database/repositories/cart.repository.impl';
import { OrderRepositoryImpl } from './database/repositories/order.repository.impl';
import { PrismaService } from './database/prisma.service';
import { UserDomainService } from '../domain/services/user.domain.service';
import { JwtStrategy } from '../presentation/guards/jwt-auth.strategy';
import { PRODUCT_REPOSITORY, CATEGORY_REPOSITORY } from '../domain/repositories/product.repository.interface';
import { USER_REPOSITORY } from '../domain/repositories/user.repository.interface';
import { CART_REPOSITORY, CART_ITEM_REPOSITORY } from '../domain/repositories/cart.repository.interface';
import { ORDER_REPOSITORY } from '../domain/repositories/order.repository.interface';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [
    PrismaService,
    UserRepositoryImpl,
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepositoryImpl },
    { provide: CATEGORY_REPOSITORY, useClass: ProductRepositoryImpl },
    { provide: CART_REPOSITORY, useClass: CartRepositoryImpl },
    { provide: CART_ITEM_REPOSITORY, useClass: CartItemRepositoryImpl },
    { provide: ORDER_REPOSITORY, useClass: OrderRepositoryImpl },
    CartRepositoryImpl,
    CartItemRepositoryImpl,
    OrderRepositoryImpl,
    UserDomainService,
    JwtService,
    JwtStrategy,
    ConfigService,
  ],
  exports: [
    PrismaService,
    UserRepositoryImpl,
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepositoryImpl },
    { provide: CATEGORY_REPOSITORY, useClass: ProductRepositoryImpl },
    { provide: CART_REPOSITORY, useClass: CartRepositoryImpl },
    { provide: CART_ITEM_REPOSITORY, useClass: CartItemRepositoryImpl },
    { provide: ORDER_REPOSITORY, useClass: OrderRepositoryImpl },
    CartRepositoryImpl,
    CartItemRepositoryImpl,
    OrderRepositoryImpl,
    UserDomainService,
    JwtModule,
    JwtService,
    ConfigModule,
  ],
})
export class InfrastructureModule {}
