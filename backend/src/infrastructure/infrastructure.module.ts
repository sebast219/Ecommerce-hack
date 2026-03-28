// 🏗️ INFRASTRUCTURE MODULE - Módulo raíz de infraestructura
// PROPÓSITO: Exportar todas las implementaciones concretas

import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepositoryImpl } from './database/repositories/user.repository.impl';
import { ProductRepositoryImpl } from './database/repositories/product.repository.impl';
import { PrismaService } from './database/prisma.service';
import { UserDomainService } from '../domain/services/user.domain.service';
import { PRODUCT_REPOSITORY, CATEGORY_REPOSITORY } from '../domain/repositories/product.repository.interface';
import { USER_REPOSITORY } from '../domain/repositories/user.repository.interface';

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
  ],
  providers: [
    PrismaService,
    UserRepositoryImpl,
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepositoryImpl },
    { provide: CATEGORY_REPOSITORY, useClass: ProductRepositoryImpl },
    UserDomainService,
    JwtService,
  ],
  exports: [
    PrismaService,
    UserRepositoryImpl,
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepositoryImpl },
    { provide: CATEGORY_REPOSITORY, useClass: ProductRepositoryImpl },
    UserDomainService,
    JwtModule,
    JwtService,
  ],
})
export class InfrastructureModule {}
