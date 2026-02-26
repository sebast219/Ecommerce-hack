// 🏗️ CONFIGURACIÓN ACTUALIZADA - Configuration con Clean Architecture
// PROPÓSITO: Centralizar toda la configuración de la aplicación

export default () => ({
  // EJEMPLO: Configuración de la aplicación
  app: {
    port: parseInt(process.env.PORT, 10) || 3001,
    apiPrefix: process.env.API_PREFIX || 'api/v1',
    environment: process.env.NODE_ENV || 'development',
  },

  // EJEMPLO: Configuración de base de datos
  database: {
    url: process.env.DATABASE_URL,
  },

  // EJEMPLO: Configuración JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // EJEMPLO: Configuración CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },

  // EJEMPLO: Configuración de rate limiting
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
  },

  // EJEMPLO: Configuración de archivos
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },

  // EJEMPLO: Configuración de email
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'noreply@ecommerce.com',
  },

  // EJEMPLO: Configuración de Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // EJEMPLO: Configuración de Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },

  // EJEMPLO: Configuración de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },

  // EJEMPLO: Configuración de seguridad
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    sessionSecret: process.env.SESSION_SECRET,
  },
});
