// 🏗️ SHARED MIDDLEWARE - Autenticación Unificada
// PROPÓSITO: Middleware de autenticación compartido entre NestJS y Railway

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
  };
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Middleware para Express (Railway-server.js)
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access token is required',
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({
      success: false,
      message: 'JWT secret not configured',
    });
    return;
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        res.status(403).json({
          success: false,
          message: 'Token has expired',
        });
      } else if (err.name === 'JsonWebTokenError') {
        res.status(403).json({
          success: false,
          message: 'Invalid token',
        });
      } else {
        res.status(403).json({
          success: false,
          message: 'Token validation failed',
        });
      }
      return;
    }

    req.user = user as JwtPayload;
    next();
  });
};

// Middleware para NestJS (Guard compatible)
export const validateToken = (token: string): JwtPayload => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT secret not configured');
  }

  try {
    return jwt.verify(token, jwtSecret) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token validation failed');
    }
  }
};

// Generador de tokens compartido
export const generateTokens = (payload: {
  sub: string;
  email: string;
  role: string;
}) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || !jwtRefreshSecret) {
    throw new Error('JWT secrets not configured');
  }

  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    jwtRefreshSecret,
    { expiresIn: '7d' },
  );

  return { accessToken, refreshToken };
};

// Validador de refresh token
export const validateRefreshToken = (token: string): JwtPayload => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!jwtRefreshSecret) {
    throw new Error('JWT refresh secret not configured');
  }

  try {
    return jwt.verify(token, jwtRefreshSecret) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    } else {
      throw new Error('Refresh token validation failed');
    }
  }
};

// Middleware para rutas públicas (compatible con ambos servidores)
export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // No hay token, continuar sin autenticación
    next();
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    next();
    return;
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      // Token inválido, pero continuamos sin autenticación
      next();
    } else {
      req.user = user as JwtPayload;
      next();
    }
  });
};

// Middleware de roles compartido
export const requireRole = (...allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

// Exportar para uso en Express
export default {
  authenticateToken,
  validateToken,
  generateTokens,
  validateRefreshToken,
  optionalAuth,
  requireRole,
};
