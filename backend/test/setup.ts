// backend/test/setup.ts - NUEVO
// Configurar variables de entorno para tests ANTES de cualquier importación
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-super-secret-jwt-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-super-secret-refresh-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '24h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.DATABASE_URL = 'file:./test.db';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

export class TestSetup {
  public static app: INestApplication;
  private static moduleRef: TestingModule;
  public static prisma: PrismaService;

  static async initialize(): Promise<INestApplication> {

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    // Replicar EXACTA configuración de producción
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }));

    app.setGlobalPrefix('api/v1');

    await app.init();

    this.app = app;
    this.prisma = moduleFixture.get<PrismaService>(PrismaService);
    this.moduleRef = moduleFixture;

    return app;
  }

  static async cleanup(): Promise<void> {
    try {
      // Orden de limpieza respetando foreign keys
      // Solo eliminar modelos que existen en Prisma
      if ('orderItem' in this.prisma) {
        await this.prisma.orderItem.deleteMany();
      }
      if ('order' in this.prisma) {
        await this.prisma.order.deleteMany();
      }
      if ('cartItem' in this.prisma) {
        await this.prisma.cartItem.deleteMany();
      }
      if ('productInventory' in this.prisma) {
        await this.prisma.productInventory.deleteMany();
      }
      if ('product' in this.prisma) {
        await this.prisma.product.deleteMany();
      }
      if ('category' in this.prisma) {
        await this.prisma.category.deleteMany();
      }
      if ('refreshToken' in this.prisma) {
        await this.prisma.refreshToken.deleteMany();
      }
      if ('address' in this.prisma) {
        await this.prisma.address.deleteMany();
      }
      if ('user' in this.prisma) {
        await this.prisma.user.deleteMany();
      }
    } catch (error) {
      // Ignorar errores de cleanup (modelos que no existen)
      console.warn('Cleanup warning:', error instanceof Error ? error.message : String(error));
    }
  }

  static async teardown(): Promise<void> {
    await this.cleanup();
    await this.app.close();
  }
}
