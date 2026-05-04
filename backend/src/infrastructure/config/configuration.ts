// Configuration Factory con validación Zod
import { validateEnv } from './env.validation';

export default () => {
  const env = validateEnv();

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    database: {
      url: env.DATABASE_URL,
    },
    jwt: {
      secret: env.JWT_SECRET,
      accessTokenTTL: 900, // 15 min
      refreshTokenTTL: 604800, // 7 días
    },
    stripe: {
      secretKey: env.STRIPE_SECRET_KEY,
      webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    },
    cors: {
      origins: env.CORS_ORIGINS,
    },
    bcrypt: {
      rounds: env.BCRYPT_ROUNDS,
    },
  };
};
