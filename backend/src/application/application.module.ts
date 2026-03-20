// 🏗️ APPLICATION MODULE - Módulo raíz de casos de uso
// PROPÓSITO: Exportar todos los casos de uso y DTOs de la aplicación

import { Module } from '@nestjs/common';

// EJEMPLO: Exportar casos de uso
export {
  CreateUserUseCase,
  LoginUseCase,
  CreateUserRequest,
  CreateUserResponse,
  LoginRequest,
  LoginResponse,
} from './use-cases/auth/create-user.use-case';

// EJEMPLO: Exportar DTOs de aplicación
export {} from // DTOs de otros casos de uso se agregarían aquí
'./dto';

@Module({
  providers: [
    // EJEMPLO: Casos de uso (inyectables en Presentation layer)
    // CreateUserUseCase,
    // LoginUseCase,
  ],
  exports: [
    // EJEMPLO: Exportar casos de uso para Presentation layer
    // CreateUserUseCase,
    // LoginUseCase,
  ],
})
export class ApplicationModule {}
