// Refresh Token Service con Token Family (Anti-Replay)
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JwtTokenService, TokenPair } from './jwt-token.service';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  /**
   * Crea un nuevo token family para el usuario (login)
   */
  async createTokenFamily(user: {
    id: string;
    email: string;
    role: string;
  }): Promise<TokenPair> {
    const familyId = crypto.randomUUID();
    const tokenPair = await this.jwtTokenService.generateTokenPair(user);

    // Hash del refresh token para almacenarlo seguro
    const tokenHash = this.hashToken(tokenPair.refreshToken);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        familyId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        isRevoked: false,
      },
    });

    return tokenPair;
  }

  /**
   * Rota el refresh token - DETECTA REUSE ATTACKS
   */
  async rotateRefreshToken(oldRefreshToken: string): Promise<TokenPair> {
    const oldTokenHash = this.hashToken(oldRefreshToken);

    // Buscar el token actual
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { tokenHash: oldTokenHash },
      include: { user: true },
    });

    if (!existingToken) {
      this.logger.error('Refresh token not found - possible token theft');
      throw new UnauthorizedException('Invalid refresh token');
    }

    // DETECCIÓN DE REUSE ATTACK
    if (existingToken.isRevoked) {
      this.logger.error(
        `REUSE ATTACK DETECTED for user ${existingToken.userId}, family ${existingToken.familyId}`,
      );

      // Invalidar TODA la familia de tokens
      await this.prisma.refreshToken.updateMany({
        where: { familyId: existingToken.familyId },
        data: { isRevoked: true },
      });

      throw new UnauthorizedException(
        'Token reuse detected - all sessions invalidated',
      );
    }

    // Verificar expiración
    if (existingToken.expiresAt < new Date()) {
      await this.prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: { isRevoked: true },
      });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Revocar el token actual
    await this.prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { isRevoked: true },
    });

    // Generar nuevo par de tokens EN LA MISMA FAMILIA
    const user = existingToken.user;
    const newTokenPair = await this.jwtTokenService.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const newTokenHash = this.hashToken(newTokenPair.refreshToken);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: newTokenHash,
        familyId: existingToken.familyId, // Misma familia
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isRevoked: false,
      },
    });

    return newTokenPair;
  }

  /**
   * Revoca todos los tokens de un usuario (logout global)
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
    this.logger.log(`All tokens revoked for user ${userId}`);
  }

  /**
   * Limpia tokens expirados (cron job)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          {
            isRevoked: true,
            updatedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        ],
      },
    });
    return result.count;
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
