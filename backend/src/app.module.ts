// 🏗️ CONFIGURACIÓN ACTUALIZADA - Root Module con Clean Architecture
// PROPÓSITO: Configurar la aplicación con todas las capas y módulos

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';

// EJEMPLO: Módulos de Domain (inyectados en Application)
import { DomainModule } from './domain/domain.module';

// EJEMPLO: Módulos de Infrastructure (implementaciones concretas)
import { InfrastructureModule } from './infrastructure/infrastructure.module';

// EJEMPLO: Módulos de Application (casos de uso)
import { ApplicationModule } from './application/application.module';

// EJEMPLO: Módulos de Presentation (controllers, guards, etc.)
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [
    // EJEMPLO: Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // EJEMPLO: Rate limiting global
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),

    // EJEMPLO: Módulos organizados por capas - ORDEN CORRECTO
    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
    DomainModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
}
