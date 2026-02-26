// 🏗️ PRESENTATION FILTERS - Filtros globales de excepciones
// PROPÓSITO: Manejar errores de forma centralizada y consistente

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// EJEMPLO: DTO para respuestas de error estandarizadas
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
  statusCode: number;
  details?: any;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'INTERNAL_ERROR';

    // EJEMPLO: Manejar diferentes tipos de excepciones
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // EJEMPLO: Crear respuesta de error estandarizada
    const errorResponse: ErrorResponse = {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
    };

    // EJEMPLO: Agregar detalles para errores de validación
    if (status === HttpStatus.BAD_REQUEST && exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && (exceptionResponse as any).message) {
        errorResponse.details = (exceptionResponse as any).message;
      }
    }

    // EJEMPLO: Logging estructurado
    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify({
        exception: exception?.toString(),
        stack: exception instanceof Error ? exception.stack : undefined,
        body: request.body,
        params: request.params,
        query: request.query,
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      }),
    );

    // EJEMPLO: Enviar respuesta
    response.status(status).json(errorResponse);
  }
}

// EJEMPLO: Filtro específico para validación
@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse: ErrorResponse = {
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: HttpStatus.BAD_REQUEST,
      details: exception,
    };

    this.logger.warn(
      `Validation error on ${request.method} ${request.url}`,
      JSON.stringify(errorResponse.details),
    );

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}

// EJEMPLO: Filtro específico para errores de base de datos
@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';
    let error = 'DATABASE_ERROR';

    // EJEMPLO: Manejar errores específicos de base de datos
    if (exception instanceof Error) {
      if (exception.message.includes('unique constraint')) {
        status = HttpStatus.CONFLICT;
        message = 'Resource already exists';
        error = 'DUPLICATE_RESOURCE';
      } else if (exception.message.includes('foreign key constraint')) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid reference';
        error = 'INVALID_REFERENCE';
      } else if (exception.message.includes('not found')) {
        status = HttpStatus.NOT_FOUND;
        message = 'Resource not found';
        error = 'RESOURCE_NOT_FOUND';
      }
    }

    const errorResponse: ErrorResponse = {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
    };

    this.logger.error(
      `Database error on ${request.method} ${request.url}`,
      JSON.stringify({
        originalException: exception?.toString(),
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    );

    response.status(status).json(errorResponse);
  }
}
