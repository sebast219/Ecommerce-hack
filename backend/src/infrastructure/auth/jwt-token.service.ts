// JWT Token Service con Algorithm Pinning y Token Family
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;      // User ID
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  jti?: string;     // JWT ID único
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class JwtTokenService {
  private readonly logger = new Logger(JwtTokenService.name);
  private readonly accessTokenTTL: number;
  private readonly refreshTokenTTL: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenTTL = 900;      // 15 minutos
    this.refreshTokenTTL = 604800;  // 7 días
  }

  async generateTokenPair(user: { id: string; email: string; role: string }): Promise<TokenPair> {
    const jti = this.generateJti();

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      jti,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessTokenTTL,
    });

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: this.refreshTokenTTL },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenTTL,
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        algorithms: ['HS256'], // Re-enforce algorithm
      });
    } catch (error) {
      this.logger.warn(`Invalid access token: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  verifyRefreshToken(token: string): JwtPayload & { type: string } {
    try {
      const payload = this.jwtService.verify(token, {
        algorithms: ['HS256'],
      });

      if (payload.type !== 'refresh') {
        throw new Error('Not a refresh token');
      }

      return payload;
    } catch (error) {
      this.logger.warn(`Invalid refresh token: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateJti(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
