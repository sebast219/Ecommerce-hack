// 🏗️ PRESENTATION DECORATORS - Public Route Decorator
// PROPÓSITO: Marcar rutas como públicas (sin autenticación requerida)

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
