/**
 * CREATE CART ITEM DTO - EJERCICIO PRÁCTICO
 * 
 * CONCEPTOS QUE APRENDERÁS:
 * - DTO Validation: Validación de datos de entrada
 * - Class Validator: Decoradores de validación
 * - Business Rules: Reglas de negocio en DTOs
 * - Type Safety: Tipado estricto en TypeScript
 * 
 * RECURSOS DE APRENDIZAJE:
 * - Class Validator Documentation: https://github.com/typestack/class-validator
 * - NestJS DTOs: https://docs.nestjs.com/validation
 * - Validation Patterns: https://docs.nestjs.com/techniques/validation
 */

import { IsString, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateCartItemDto {
  // TODO: Implementar validación de productId
  @IsString()
  @IsNotEmpty()
  productId: string;
  
  // CONCEPTO: Validación de ID de producto
  // - @IsString(): Asegura que sea string
  // - @IsNotEmpty(): No permite valores vacíos
  // - En el service: verificar que el producto exista

  // TODO: Implementar validación de quantity
  @IsNumber()
  @Min(1)
  @Max(999)
  quantity: number;
  
  // CONCEPTO: Validación de cantidad
  // - @IsNumber(): Asegura que sea número
  // - @Min(1): Mínimo 1 unidad
  // - @Max(999): Límite para prevenir abusos
  // - En el service: verificar stock disponible

  // TODO: (Opcional) Implementar validación de variantes
  // @IsString()
  // @IsOptional()
  // variant?: string;
  
  // CONCEPTO: Productos con variantes
  // - Tallas, colores, etc.
  // - @IsOptional(): No requerido
  // - Afecta inventario por variante
}
