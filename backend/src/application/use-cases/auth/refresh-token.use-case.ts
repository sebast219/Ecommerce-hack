// 🏗️ APPLICATION USE CASES - Refresh Token
// PROPÓSITO: Refrescar tokens de acceso usando refresh token

import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { RefreshTokenRepositoryImpl } from '../../../infrastructure/database/repositories/cart.repository.impl';
import * as crypto from 'crypto';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase {
  private jwtService: JwtService;
  private jwtRefreshService: JwtService;

  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
    private refreshTokenRepository: RefreshTokenRepositoryImpl,
  ) {
    // Crear JwtService para access tokens
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET || 'test-secret-key-for-development',
      signOptions: { expiresIn: '24h' },
    });

    // Crear JwtService para refresh tokens
    this.jwtRefreshService = new JwtService({
      secret: process.env.JWT_REFRESH_SECRET || 'test-super-secret-refresh-key-for-testing-only',
      signOptions: { expiresIn: '7d' },
    });
  }

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    // Verificar el refresh token
    const payload = this.verifyRefreshToken(request.refreshToken);
    
    // Buscar el token en la base de datos usando hash
    const tokenHash = crypto.createHash('sha256').update(request.refreshToken).digest('hex');
    const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    // Verificar que no esté expirado
    if (storedToken.expiresAt < new Date()) {
      await this.refreshTokenRepository.delete(storedToken.id);
      throw new Error('Refresh token expired');
    }

    // Buscar usuario
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }

    // Revocar el token antiguo específico
    await this.refreshTokenRepository.delete(storedToken.id);

    // Generar nuevos tokens
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Agregar UUID único para asegurar que el refresh token sea diferente
    const newRefreshToken = this.jwtRefreshService.sign({
      sub: user.id,
      type: 'refresh',
      jti: crypto.randomUUID(), // JWT ID único
    });

    // Guardar nuevo refresh token con hash
    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    
    await this.refreshTokenRepository.create({
      tokenHash: newTokenHash,
      familyId: storedToken.familyId, // Mantener misma familia
      userId: user.id,
      isRevoked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      updatedAt: new Date(),
    });

    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    };
  }

  private verifyRefreshToken(token: string): any {
    try {
      return this.jwtRefreshService.verify(token);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
