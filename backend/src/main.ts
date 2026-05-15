// 🏗️ CONFIGURACIÓN ACTUALIZADA - Main Bootstrap con Clean Architecture
// PROPÓSITO: Inicializar la aplicación con configuración enterprise-ready

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './presentation/filters/http-exception.filter';
import { LoggingInterceptor } from './presentation/interceptors/logging.interceptor';
import { TransformInterceptor } from './presentation/interceptors/transform.interceptor';
import { SecurityInterceptor } from './presentation/interceptors/security.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Servir archivos estáticos de uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // EJEMPLO: Filtros globales
  app.useGlobalFilters(new AllExceptionsFilter());

  // EJEMPLO: Pipes globales - VALIDACIÓN BLINDADA
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos no decorados
      forbidNonWhitelisted: true, // Error si envían campos extra
      transform: true, // Auto-transform tipos
      transformOptions: {
        enableImplicitConversion: false, // NO conversión implícita
      },
      disableErrorMessages: configService.get('NODE_ENV') === 'production', // Oculta detalles en prod
      stopAtFirstError: false,
    }),
  );

  // EJEMPLO: Interceptors globales
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new SecurityInterceptor(),
  );

  app.enableCors({
    origin: (origin, callback) => {
      const allowed = (process.env.CORS_ORIGIN || 'http://localhost:3000')
        .split(',')
        .map(o => o.trim());
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // EJEMPLO: Prefijo global de API
  const apiPrefix = configService.get('app.apiPrefix');
  // Excluir la ruta 'products' del prefijo global para que quede disponible en '/products'
  app.setGlobalPrefix(apiPrefix, { exclude: ['products'] });

  // EJEMPLO: Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Ecommerce Universitario API - Clean Architecture')
    .setVersion('2.0.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Products', 'Product management')
    .addTag('Orders', 'Order management')
    .addTag('Payments', 'Payment processing')
    .addTag('Admin', 'Administrative functions')
    .addServer(
      `http://localhost:${configService.get('app.port')}/${apiPrefix}`,
      'Development',
    )
    .addServer('https://api.yourdomain.com/v1', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
    customSiteTitle: 'Ecommerce API Documentation',
  });

  // EJEMPLO: Health check endpoint
  app.getHttpServer().on('listening', () => {
    console.log('🚀 Application is running');
    console.log(`📍 Environment: ${configService.get('NODE_ENV')}`);
    console.log(
      `🌐 API: http://localhost:${configService.get('app.port')}/${apiPrefix}`,
    );
    console.log(
      `📚 Docs: http://localhost:${configService.get('app.port')}/${apiPrefix}/docs`,
    );
  });

  // EJEMPLO: Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  const port = process.env.PORT || configService.get('app.port') || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🎯 Application ready on port ${port}`);
}

// EJEMPLO: Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
