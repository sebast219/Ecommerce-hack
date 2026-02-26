// 🏗️ SHARED TYPES - Tipos globales compartidos
// PROPÓSITO: Definir tipos comunes utilizados en toda la aplicación

// EJEMPLO: Tipos base para respuestas API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// EJEMPLO: Tipos para paginación
export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// EJEMPLO: Tipos para ordenamiento
export interface SortOptions {
  field?: string;
  direction?: 'asc' | 'desc';
}

// EJEMPLO: Tipos para filtrado
export interface FilterOptions {
  search?: string;
  filters?: Record<string, any>;
}

// EJEMPLO: Tipos para búsqueda
export interface SearchOptions {
  query?: string;
  fields?: string[];
}

// EJEMPLO: Tipos para relaciones
export interface IncludeOptions {
  include?: string[];
  select?: string[];
}

// EJEMPLO: Tipos para query complejas
export interface QueryOptions extends PaginationOptions, SortOptions, FilterOptions, SearchOptions, IncludeOptions {
  // Combinación de todas las opciones
}

// EJEMPLO: Tipos para errores
export interface ErrorDetails {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  path: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// EJEMPLO: Tipos para auditoría
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// EJEMPLO: Tipos para cache
export interface CacheOptions {
  ttl?: number;
  key?: string;
  tags?: string[];
}

// EJEMPLO: Tipos para logging
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: string;
  userId?: string;
  requestId?: string;
  timestamp: Date;
  metadata?: any;
}

// EJEMPLO: Tipos para eventos
export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  data: any;
  version: number;
  timestamp: Date;
}

// EJEMPLO: Tipos para notificaciones
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

// EJEMPLO: Tipos para archivos
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// EJEMPLO: Tipos para configuración
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  pool?: {
    min?: number;
    max?: number;
    idle?: number;
  };
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

// EJEMPLO: Tipos para entorno
export interface Environment {
  NODE_ENV: 'development' | 'staging' | 'production';
  PORT: number;
  API_PREFIX: string;
  CORS_ORIGIN: string[];
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  REDIS_URL?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

// EJEMPLO: Tipos para métricas
export interface Metrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  uptime: number;
}

// EJEMPLO: Tipos para health checks
export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  services: {
    database: ServiceHealth;
    redis?: ServiceHealth;
    external?: Record<string, ServiceHealth>;
  };
  uptime: number;
  version: string;
}

export interface ServiceHealth {
  status: 'healthy' | 'unhealthy';
  responseTime?: number;
  error?: string;
  lastCheck: Date;
}

// EJEMPLO: Tipos para feature flags
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  conditions?: FeatureFlagCondition[];
}

export interface FeatureFlagCondition {
  type: 'user_id' | 'role' | 'percentage' | 'custom';
  operator: 'equals' | 'in' | 'greater_than' | 'less_than';
  value: any;
}

// EJEMPLO: Tipos para rate limiting
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// EJEMPLO: Tipos para CORS
export interface CorsConfig {
  origin: string[] | boolean;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge?: number;
}

// EJEMPLO: Tipos para seguridad
export interface SecurityConfig {
  helmet?: {
    contentSecurityPolicy?: any;
    crossOriginEmbedderPolicy?: boolean;
    crossOriginOpenerPolicy?: boolean;
    crossOriginResourcePolicy?: boolean;
    dnsPrefetchControl?: boolean;
    frameguard?: boolean;
    hidePoweredBy?: boolean;
    hsts?: boolean;
    ieNoOpen?: boolean;
    noSniff?: boolean;
    originAgentCluster?: boolean;
    permittedCrossDomainPolicies?: boolean;
    referrerPolicy?: boolean;
    xssFilter?: boolean;
  };
}

// EJEMPLO: Tipos para middleware
export interface MiddlewareConfig {
  global?: boolean;
  routes?: string[];
  exclude?: string[];
}

// EJEMPLO: Tipos para interceptors
export interface InterceptorConfig {
  global?: boolean;
  routes?: string[];
  exclude?: string[];
}

// EJEMPLO: Tipos para guards
export interface GuardConfig {
  global?: boolean;
  routes?: string[];
  exclude?: string[];
}

// EJEMPLO: Tipos para pipes
export interface PipeConfig {
  global?: boolean;
  routes?: string[];
  exclude?: string[];
}
