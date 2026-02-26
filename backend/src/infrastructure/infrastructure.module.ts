// 🏗️ INFRASTRUCTURE MODULE - Módulo raíz de infraestructura
// PROPÓSITO: Exportar todas las implementaciones concretas

import { Module } from '@nestjs/common';

// EJEMPLO: Exportar implementaciones de repositorios
export { 
  UserRepositoryImpl, 
  ProductRepositoryImpl 
} from './database/repositories/user.repository.impl';

// EJEMPLO: Exportar servicios externos
export { 
  // StripeService,
  // EmailService,
  // CacheService,
} from './external';

@Module({
  providers: [
    // EJEMPLO: Implementaciones de repositorios
    // UserRepositoryImpl,
    // ProductRepositoryImpl,
    
    // EJEMPLO: Servicios externos
    // StripeService,
    // EmailService,
    // CacheService,
  ],
  exports: [
    // EJEMPLO: Exportar implementaciones para Application layer
    // UserRepositoryImpl,
    // ProductRepositoryImpl,
    
    // EJEMPLO: Exportar servicios externos
    // StripeService,
    // EmailService,
    // CacheService,
  ],
})
export class InfrastructureModule {}
