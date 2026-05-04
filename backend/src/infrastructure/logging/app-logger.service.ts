// Logger Service Centralizado con Sanitización de Datos Sensibles
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

interface LogContext {
  service?: string;
  method?: string;
  userId?: string;
  requestId?: string;
  duration?: number;
  [key: string]: any;
}

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly isProduction: boolean;
  private context: string = 'App';

  constructor(private readonly configService: ConfigService) {
    this.isProduction = configService.get('NODE_ENV') === 'production';
  }

  setContext(context: string): this {
    this.context = context;
    return this;
  }

  log(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.INFO, message, context);
  }

  error(message: string, trace?: string, context?: LogContext): void {
    this.writeLog(LogLevel.ERROR, message, { ...context, trace });
  }

  warn(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.WARN, message, context);
  }

  debug(message: string, context?: LogContext): void {
    if (!this.isProduction) {
      this.writeLog(LogLevel.DEBUG, message, context);
    }
  }

  verbose(message: string, context?: LogContext): void {
    if (!this.isProduction) {
      this.writeLog(LogLevel.VERBOSE, message, context);
    }
  }

  private writeLog(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): void {
    const timestamp = new Date().toISOString();

    if (this.isProduction) {
      // JSON estructurado para producción (compatible con ELK, Datadog, etc.)
      const logEntry = {
        timestamp,
        level,
        service: this.context,
        message: this.sanitize(message),
        ...this.sanitizeContext(context),
      };
      console.log(JSON.stringify(logEntry));
    } else {
      // Formato legible para desarrollo
      const emoji = this.getEmoji(level);
      const coloredLevel = this.colorize(level);
      console.log(
        `${emoji} [${timestamp}] ${coloredLevel} [${this.context}] ${message}`,
        context ? JSON.stringify(this.sanitizeContext(context), null, 2) : '',
      );
    }
  }

  /**
   * Sanitiza datos sensibles de los logs
   */
  private sanitize(message: string): string {
    return message
      .replace(/password['":\s]*['"]\S+['"]/gi, 'password: "[REDACTED]"')
      .replace(/token['":\s]*['"]\S+['"]/gi, 'token: "[REDACTED]"')
      .replace(
        /authorization['":\s]*['"]\S+['"]/gi,
        'authorization: "[REDACTED]"',
      )
      .replace(/\b[\w._%+-]+@[\w.-]+\.[A-Z]{2,}\b/gi, '[EMAIL_REDACTED]');
  }

  private sanitizeContext(context?: LogContext): LogContext {
    if (!context) return {};

    const sanitized = { ...context };
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'authorization',
      'creditCard',
      'ssn',
    ];

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private getEmoji(level: LogLevel): string {
    const emojis: Record<LogLevel, string> = {
      [LogLevel.ERROR]: ' ',
      [LogLevel.WARN]: ' ',
      [LogLevel.INFO]: ' ',
      [LogLevel.DEBUG]: ' ',
      [LogLevel.VERBOSE]: ' ',
    };
    return emojis[level];
  }

  private colorize(level: LogLevel): string {
    return level.toUpperCase().padEnd(7);
  }
}
