// 🏗️ PRESENTATION PIPES - Pipes personalizados de validación
// PROPÓSITO: Validar y transformar datos de entrada

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

// EJEMPLO: Pipe para validación personalizada
@Injectable()
export class CustomValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // EJEMPLO: Validar tipo de dato específico
    if (metadata.type === 'string' && typeof value !== 'string') {
      throw new BadRequestException(`Expected string, got ${typeof value}`);
    }

    if (metadata.type === 'number' && isNaN(Number(value))) {
      throw new BadRequestException(`Expected number, got ${value}`);
    }

    // EJEMPLO: Transformación de datos
    if (metadata.type === 'string') {
      return value?.trim();
    }

    if (metadata.type === 'number') {
      return Number(value);
    }

    return value;
  }
}

// EJEMPLO: Pipe para parseo de UUID
@Injectable()
export class ParseUuidPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    // EJEMPLO: Validar formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(value)) {
      throw new BadRequestException(`Invalid UUID format: ${value}`);
    }

    return value;
  }
}

// EJEMPLO: Pipe para parseo de fechas
@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  transform(value: string): Date {
    // EJEMPLO: Validar y parsear fecha
    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date format: ${value}`);
    }

    return date;
  }
}

// EJEMPLO: Pipe para validación de email
@Injectable()
export class ParseEmailPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    // EJEMPLO: Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
      throw new BadRequestException(`Invalid email format: ${value}`);
    }

    return value.toLowerCase().trim();
  }
}

// EJEMPLO: Pipe para validación de passwords
@Injectable()
export class ValidatePasswordPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    // EJEMPLO: Validar requisitos de password
    if (value.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(value)) {
      throw new BadRequestException('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(value)) {
      throw new BadRequestException('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(value)) {
      throw new BadRequestException('Password must contain at least one number');
    }

    if (!/[!@#$%^&*]/.test(value)) {
      throw new BadRequestException('Password must contain at least one special character');
    }

    return value;
  }
}

// EJEMPLO: Pipe para validación de archivos
@Injectable()
export class ValidateFilePipe implements PipeTransform {
  constructor(
    private readonly allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'],
    private readonly maxSize: number = 5 * 1024 * 1024, // 5MB
  ) {}

  transform(value: any) {
    // EJEMPLO: Validar que se haya subido un archivo
    if (!value) {
      throw new BadRequestException('No file provided');
    }

    // EJEMPLO: Validar tipo de archivo
    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        `File type ${value.mimetype} not allowed. Allowed types: ${this.allowedTypes.join(', ')}`,
      );
    }

    // EJEMPLO: Validar tamaño de archivo
    if (value.size > this.maxSize) {
      throw new BadRequestException(
        `File size ${value.size} exceeds maximum allowed size ${this.maxSize}`,
      );
    }

    return value;
  }
}

// EJEMPLO: Pipe para sanitización de strings
@Injectable()
export class SanitizeStringPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value) {
      return value;
    }

    // EJEMPLO: Sanitización básica
    return value
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
}

// EJEMPLO: Pipe para validación de arrays
@Injectable()
export class ParseArrayPipe implements PipeTransform<string, string[]> {
  constructor(private readonly separator: string = ',') {}

  transform(value: string): string[] {
    if (!value) {
      return [];
    }

    // EJEMPLO: Parsear string a array y limpiar elementos
    return value
      .split(this.separator)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
}

// EJEMPLO: Pipe para validación de booleanos
@Injectable()
export class ParseBooleanPipe implements PipeTransform<string | boolean, boolean> {
  transform(value: string | boolean): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      
      if (['true', '1', 'yes', 'on'].includes(lowerValue)) {
        return true;
      }
      
      if (['false', '0', 'no', 'off'].includes(lowerValue)) {
        return false;
      }
    }

    throw new BadRequestException(`Invalid boolean value: ${value}`);
  }
}

// EJEMPLO: Pipe para validación de rangos numéricos
@Injectable()
export class ValidateNumberRangePipe implements PipeTransform<number, number> {
  constructor(
    private readonly min?: number,
    private readonly max?: number,
  ) {}

  transform(value: number): number {
    const numValue = Number(value);

    if (isNaN(numValue)) {
      throw new BadRequestException(`Expected number, got ${value}`);
    }

    if (this.min !== undefined && numValue < this.min) {
      throw new BadRequestException(`Value must be at least ${this.min}`);
    }

    if (this.max !== undefined && numValue > this.max) {
      throw new BadRequestException(`Value must be at most ${this.max}`);
    }

    return numValue;
  }
}
