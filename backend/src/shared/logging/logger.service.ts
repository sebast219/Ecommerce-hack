// 📊 LOGGING - Logger Service
// PROPÓSITO: Sistema de logging estructurado y monitoreo

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  TRACE = 'TRACE',
}

export enum LogCategory {
  AUTH = 'AUTH',
  USER = 'USER',
  PRODUCT = 'PRODUCT',
  ORDER = 'ORDER',
  CART = 'CART',
  PAYMENT = 'PAYMENT',
  DATABASE = 'DATABASE',
  API = 'API',
  SYSTEM = 'SYSTEM',
  PERFORMANCE = 'PERFORMANCE',
  SECURITY = 'SECURITY',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  context?: any;
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  duration?: number;
  error?: string;
  stack?: string;
}

@Injectable()
export class LoggerService {
  private readonly logger = new Logger('LoggerService');
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  constructor(private configService: ConfigService) {
    // Limpiar logs periódicamente
    setInterval(() => {
      this.cleanOldLogs();
    }, 60000); // Cada minuto
  }

  private createLogEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    context?: any,
    error?: Error,
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      context,
      error: error?.message || (typeof error === 'string' ? error : error?.toString()),
      stack: error?.stack,
    };

    // Agregar al buffer de logs
    this.logs.push(entry);

    // Mantener tamaño máximo
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    return entry;
  }

  private formatLog(entry: LogEntry): string {
    const parts = [
      `[${entry.timestamp}]`,
      `[${entry.level}]`,
      `[${entry.category}]`,
      entry.message,
    ];

    if (entry.userId) {
      parts.push(`[User: ${entry.userId}]`);
    }

    if (entry.duration) {
      parts.push(`[${entry.duration}ms]`);
    }

    const formatted = parts.join(' ');

    if (entry.context) {
      return `${formatted}\nContext: ${JSON.stringify(entry.context, null, 2)}`;
    }

    if (entry.error) {
      return `${formatted}\nError: ${entry.error}`;
    }

    return formatted;
  }

  private log(level: LogLevel, category: LogCategory, message: string, context?: any, error?: Error): void {
    const entry = this.createLogEntry(level, category, message, context, error);
    const formatted = this.formatLog(entry);

    switch (level) {
      case LogLevel.ERROR:
        this.logger.error(formatted);
        break;
      case LogLevel.WARN:
        this.logger.warn(formatted);
        break;
      case LogLevel.INFO:
        this.logger.log(formatted);
        break;
      case LogLevel.DEBUG:
        this.logger.debug(formatted);
        break;
      case LogLevel.TRACE:
        this.logger.verbose(formatted);
        break;
    }
  }

  // Métodos de logging por nivel
  error(category: LogCategory, message: string, context?: any, error?: Error): void {
    this.log(LogLevel.ERROR, category, message, context, error);
  }

  warn(category: LogCategory, message: string, context?: any): void {
    this.log(LogLevel.WARN, category, message, context);
  }

  info(category: LogCategory, message: string, context?: any): void {
    this.log(LogLevel.INFO, category, message, context);
  }

  debug(category: LogCategory, message: string, context?: any): void {
    this.log(LogLevel.DEBUG, category, message, context);
  }

  trace(category: LogCategory, message: string, context?: any): void {
    this.log(LogLevel.TRACE, category, message, context);
  }

  // Métodos de logging por categoría
  logAuth(message: string, context?: any): void {
    this.info(LogCategory.AUTH, message, context);
  }

  logAuthError(message: string, error?: Error, context?: any): void {
    this.error(LogCategory.AUTH, message, context, error);
  }

  logUser(message: string, context?: any): void {
    this.info(LogCategory.USER, message, context);
  }

  logProduct(message: string, context?: any): void {
    this.info(LogCategory.PRODUCT, message, context);
  }

  logOrder(message: string, context?: any): void {
    this.info(LogCategory.ORDER, message, context);
  }

  logPayment(message: string, context?: any): void {
    this.info(LogCategory.PAYMENT, message, context);
  }

  logPaymentError(message: string, error?: Error, context?: any): void {
    this.error(LogCategory.PAYMENT, message, context, error);
  }

  logDatabase(message: string, context?: any): void {
    this.debug(LogCategory.DATABASE, message, context);
  }

  logDatabaseError(message: string, error?: Error, context?: any): void {
    this.error(LogCategory.DATABASE, message, context, error);
  }

  logApi(message: string, context?: any): void {
    this.info(LogCategory.API, message, context);
  }

  logApiError(message: string, error?: Error, context?: any): void {
    this.error(LogCategory.API, message, context, error);
  }

  logPerformance(message: string, duration: number, context?: any): void {
    this.info(LogCategory.PERFORMANCE, message, { ...context, duration });
  }

  logSecurity(message: string, context?: any): void {
    this.warn(LogCategory.SECURITY, message, context);
  }

  logSecurityError(message: string, error?: Error, context?: any): void {
    this.error(LogCategory.SECURITY, message, context, error);
  }

  // Métodos de logging estructurado
  logRequest(req: any, res: any, duration: number): void {
    this.logApi('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
  }

  logError(req: any, error: Error, duration: number): void {
    this.logApiError('HTTP Error', error, {
      method: req.method,
      url: req.url,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
  }

  logDatabaseQuery(query: string, duration: number, params?: any): void {
    this.logDatabase('Database Query', {
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
      duration,
      params,
    });
  }

  logCacheOperation(operation: string, key: string, hit: boolean, duration?: number): void {
    this.logPerformance(`Cache ${operation}`, duration || 0, {
      key,
      hit,
    });
  }

  logUserAction(userId: string, action: string, context?: any): void {
    this.logUser(`User Action: ${action}`, {
      userId,
      action,
      ...context,
    });
  }

  logPaymentEvent(event: string, paymentId: string, amount: number, status: string, context?: any): void {
    this.logPayment(`Payment Event: ${event}`, {
      paymentId,
      amount,
      status,
      ...context,
    });
  }

  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high', context?: any): void {
    const level = severity === 'high' ? LogLevel.ERROR : severity === 'medium' ? LogLevel.WARN : LogLevel.INFO;
    this.log(level, LogCategory.SECURITY, `Security Event: ${event}`, {
      severity,
      ...context,
    });
  }

  // Métodos de consulta
  getLogs(level?: LogLevel, category?: LogCategory, limit?: number): LogEntry[] {
    let filtered = this.logs;

    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }

    if (category) {
      filtered = filtered.filter(log => log.category === category);
    }

    if (limit) {
      filtered = filtered.slice(-limit);
    }

    return filtered;
  }

  getLogStats(): {
    total: number;
    byLevel: Record<LogLevel, number>;
    byCategory: Record<LogCategory, number>;
    recent: LogEntry[];
  } {
    const byLevel = Object.values(LogLevel).reduce((acc, level) => {
      acc[level] = this.logs.filter(log => log.level === level).length;
      return acc;
    }, {} as Record<LogLevel, number>);

    const byCategory = Object.values(LogCategory).reduce((acc, category) => {
      acc[category] = this.logs.filter(log => log.category === category).length;
      return acc;
    }, {} as Record<LogCategory, number>);

    return {
      total: this.logs.length,
      byLevel,
      byCategory,
      recent: this.logs.slice(-10),
    };
  }

  clearLogs(): void {
    this.logs.length = 0;
    this.info(LogCategory.SYSTEM, 'Logs cleared');
  }

  private cleanOldLogs(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const beforeCount = this.logs.length;

    // Mantener solo logs de la última hora
    this.logs = this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime > oneHourAgo;
    });

    const cleaned = beforeCount - this.logs.length;
    if (cleaned > 0) {
      this.debug(LogCategory.SYSTEM, `Cleaned ${cleaned} old log entries`);
    }
  }

  // Exportar logs para análisis
  exportLogs(): string {
    const header = 'timestamp,level,category,message,userId,duration\n';
    const rows = this.logs.map(log => [
      log.timestamp,
      log.level,
      log.category,
      `"${log.message.replace(/"/g, '""')}"`,
      log.userId || '',
      log.duration || '',
    ].join(','));

    return header + rows.join('\n');
  }
}

// Middleware de logging para Express
export function createLoggingMiddleware(logger: LoggerService) {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();

    // Log de solicitud
    logger.logApi('Request started', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    // Capturar respuesta
    const originalSend = res.send;
    res.send = function(body) {
      const duration = Date.now() - startTime;
      
      logger.logRequest(req, res, duration);
      
      return originalSend.call(this, body);
    };

    next();
  };
}

// Decorador para logging de métodos
export function LogExecution(category: LogCategory, includeArgs = false, includeResult = false) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const logger = this.loggerService as LoggerService;

      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - startTime;

        let context: any = { duration };
        if (includeArgs) context.args = args;
        if (includeResult) context.result = typeof result === 'object' ? 'object' : result;

        logger.info(category, `${propertyName} executed successfully`, context);
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        let context: any = { duration, error: error.message };
        if (includeArgs) context.args = args;

        logger.error(category, `${propertyName} failed`, context, error as Error);
        
        throw error;
      }
    };

    return descriptor;
  };
}
