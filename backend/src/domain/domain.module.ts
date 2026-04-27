// 🏗️ DOMAIN MODULE - Módulo raíz del dominio
// PROPÓSITO: Exportar todas las entidades, repositorios y servicios del dominio

import { Module } from '@nestjs/common';
import { EcommerceRulesService } from './services/ecommerce-rules.service';

// EJEMPLO: Exportar entidades del dominio
export {
  User,
  Product,
  Order,
  UserRole,
  OrderStatus,
  Money,
} from './entities/user.entity';

// EJEMPLO: Exportar interfaces de repositorios
export {
  IUserRepository,
  IProductRepository,
  IOrderRepository,
} from './repositories/user.repository.interface';

// EJEMPLO: Exportar servicios de dominio
export {
  UserDomainService,
  ProductDomainService,
  OrderDomainService,
} from './services/user.domain.service';
export { EcommerceRulesService } from './services/ecommerce-rules.service';

@Module({
  providers: [
    // EJEMPLO: Servicios de dominio (inyectables en Application layer)
    EcommerceRulesService,
    // UserDomainService,
    // ProductDomainService,
    // OrderDomainService,
  ],
  exports: [
    // EJEMPLO: Exportar servicios para que otros módulos puedan inyectarlos
    EcommerceRulesService,
    // UserDomainService,
    // ProductDomainService,
    // OrderDomainService,
  ],
})
export class DomainModule {}
