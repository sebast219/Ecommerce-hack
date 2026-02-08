/**
 * UPDATE CART ITEM DTO - EJERCICIO PRÁCTICO
 * 
 * CONCEPTOS QUE APRENDERÁS:
 * - Partial Updates: Actualizaciones parciales con DTOs
 * - Optional Fields: Campos opcionales en validación
 * - Validation Rules: Reglas específicas para actualización
 * - Type Safety: Tipado en operaciones de actualización
 * 
 * RECURSOS DE APRENDIZAJE:
 * - PartialType NestJS: https://docs.nestjs.com/openapi/mapped-types
 * - Update Patterns: https://docs.nestjs.com/techniques/validation
 */

import { IsNumber, Min, Max, IsOptional } from 'class-validator';

export class UpdateCartItemDto {
  // TODO: Implementar validación de quantity (opcional)
  @IsNumber()
  @Min(1)
  @Max(999)
  @IsOptional()
  quantity?: number;
  
  // CONCEPTO: Actualización parcial
  // - @IsOptional(): Permite omitir este campo
  // - Si no se envía, no se actualiza
  // - Útil para PATCH endpoints
  
  // TODO: (Opcional) Implementar actualización de variante
  // @IsString()
  // @IsOptional()
  // variant?: string;
  
  // CONCEPTO: Cambio de variante
  // - Permitir cambiar talla/color
  // - Debe validar stock de nueva variante
  // - Puede afectar precio
}
