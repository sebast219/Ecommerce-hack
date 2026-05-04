// PRESENTATION FILTERS - Not Found Exception Filter
// PURPOSE: Convert product not found errors to HTTP 404 responses

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (
      exception.message === 'Product not found' ||
      exception.message === 'Product is not active'
    ) {
      response.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: exception.message,
      });
    } else {
      // Si no es un error de producto no encontrado, dejar que NestJS lo maneje
      throw exception;
    }
  }
}
