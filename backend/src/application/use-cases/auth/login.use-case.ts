// 🏗️ APPLICATION USE CASES - Login de Usuario
// PROPÓSITO: Autenticar usuarios y generar tokens JWT

import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../../domain/entities/user.entity';
import {
  IUserRepository,
  UserWithPassword,
  USER_REPOSITORY,
} from '../../../domain/repositories/user.repository.interface';
import { RefreshTokenRepositoryImpl } from '../../../infrastructure/database/repositories/cart.repository.impl';
import { UserDomainService } from '../../../domain/services/user.domain.service';
import * as crypto from 'crypto';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class LoginUseCase {
  private jwtService: JwtService;

  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
    private refreshTokenRepository: RefreshTokenRepositoryImpl,
    private userDomainService: UserDomainService,
  ) {
    // Crear JwtService directamente con el secreto
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET || 'test-secret-key-for-development',
      signOptions: { expiresIn: '24h' },
    });
  }

  async execute(request: LoginRequest): Promise<LoginResponse> {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('Invalid email format');
    }

    // Buscar usuario
    // Buscar usuario con contraseña para autenticación
    const userWithPassword = await this.userRepository.findByEmailForAuth(
      request.email,
    );
    if (!userWithPassword) {
      throw new Error('Invalid credentials');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(
      request.password,
      userWithPassword.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Crear objeto user sin contraseña para el resto del flujo
    const { password: _, ...userWithoutPassword } = userWithPassword;

    // Generar tokens - agregar password temporal para cumplir con tipo User
    const userWithTempPassword = { ...userWithoutPassword, password: '' };
    const accessToken = this.generateAccessToken(userWithTempPassword);
    const refreshToken = await this.generateRefreshToken(userWithTempPassword);

    // Limpiar tokens anteriores del usuario
    await this.refreshTokenRepository.deleteByUserId(userWithoutPassword.id);

    // Guardar nuevo refresh token con hash
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    const familyId = this.generateFamilyId();

    await this.refreshTokenRepository.create({
      tokenHash,
      familyId,
      userId: userWithoutPassword.id,
      isRevoked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      updatedAt: new Date(),
    });

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET ||
        'test-super-secret-refresh-key-for-testing-only',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
  }

  private generateFamilyId(): string {
    // Generar un ID único para la familia de tokens
    return crypto.randomUUID();
  }
}
