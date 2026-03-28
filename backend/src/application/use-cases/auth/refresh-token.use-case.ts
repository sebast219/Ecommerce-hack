// 🏗️ APPLICATION USE CASES - Refresh Token
// PROPÓSITO: Refrescar tokens de acceso usando refresh token

import { JwtService } from '@nestjs/jwt';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '../../../domain/repositories/cart.repository.interface';
import { ConfigService } from '@nestjs/config';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    // Verificar el refresh token
    const payload = this.verifyRefreshToken(request.refreshToken);
    
    // Buscar el token en la base de datos
    const storedToken = await this.refreshTokenRepository.findByToken(
      request.refreshToken,
    );
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

    // Generar nuevos tokens
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);

    // Eliminar el token anterior y guardar el nuevo
    await this.refreshTokenRepository.delete(storedToken.id);
    await this.refreshTokenRepository.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  private verifyRefreshToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  private generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '24h',
    });
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
    });
  }
}
