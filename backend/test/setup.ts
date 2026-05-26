// backend/test/setup.ts - NUEVO
// Configurar variables de entorno para tests ANTES de cualquier importación
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-super-secret-jwt-key-for-testing-only';
process.env.JWT_REFRESH_SECRET =
  'test-super-secret-refresh-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '24h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecommerce_test';

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
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: false },
      }),
    );

    app.setGlobalPrefix('api/v1');

    await app.init();

    this.app = app;
    this.prisma = moduleFixture.get<PrismaService>(PrismaService);
    this.moduleRef = moduleFixture;

    return app;
  }

  static async cleanup(): Promise<void> {
    try {
      // Usar deleteMany en orden correcto de dependencias
      // Primero borrar tablas dependientes
      await this.prisma.orderItem.deleteMany();
      await this.prisma.order.deleteMany();
      await this.prisma.cartItem.deleteMany();
      await this.prisma.cart.deleteMany();
      await this.prisma.productInventory.deleteMany();
      // Productos ANTES de categorías (onDelete: Cascade en schema)
      await this.prisma.product.deleteMany();
      // NO borrar categorías en cleanup para evitar foreign key issues
      // Las categorías se acumulan pero usan timestamps únicos
      await this.prisma.refreshToken.deleteMany();
      await this.prisma.address.deleteMany();
      // Users al final
      await this.prisma.user.deleteMany();
    } catch (error) {
      // Ignorar errores de cleanup
      console.warn(
        'Cleanup warning:',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  static async teardown(): Promise<void> {
    await this.cleanup();
    // NO borrar categorías en teardown para evitar que otros test suites fallen
    // Las categorías se acumulan pero usan timestamps únicos
    await this.app.close();
  }
}
