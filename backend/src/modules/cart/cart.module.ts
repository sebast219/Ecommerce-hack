/**
 * CART MODULE - EJERCICIO PRÁCTICO
 * 
 * CONCEPTOS QUE APRENDERÁS:
 * - Module System: Organización de código en NestJS
 * - Dependency Injection: Inyección de dependencias
 * - Provider Registration: Registro de servicios y controladores
 * - Module Imports: Importación de módulos necesarios
 * - Exports: Exportación de componentes reutilizables
 * 
 * RECURSOS DE APRENDIZAJE:
 * - NestJS Modules: https://docs.nestjs.com/modules
 * - Dependency Injection: https://docs.nestjs.com/providers
 * - Module Architecture: https://docs.nestjs.com/modules
 */

import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  // TODO: Importar módulos necesarios
  imports: [
    // CONCEPTO: DatabaseModule
    // - Proporciona PrismaService
    // - Acceso a base de datos
    // - Requerido por CartService
    
    DatabaseModule,
    
    // TODO: (Opcional) Importar otros módulos
    // ProductsModule, // Para validación de productos
    // AuthModule, // Para guards y decorators
  ],
  
  // TODO: Registrar controladores
  controllers: [
    // CONCEPTO: CartController
    // - Expone endpoints HTTP
    // - Maneja requests y responses
    // - Aplica validación y guards
    
    CartController,
  ],
  
  // TODO: Registrar servicios
  providers: [
    // CONCEPTO: CartService
    // - Contiene lógica de negocio
    // - Inyectable en otros componentes
    // - Maneja operaciones del carrito
    
    CartService,
  ],
  
  // TODO: Exportar servicios para otros módulos
  exports: [
    // CONCEPTO: Service export
    // - Permite uso en otros módulos
    // - Reutilización de lógica
    // - Evita dependencias circulares
    
    CartService,
  ],
})
export class CartModule {}
