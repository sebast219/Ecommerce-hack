// 🏗️ APPLICATION USE CASES - Login de Usuario
// PROPÓSITO: Autenticar usuarios y generar tokens JWT

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../../domain/entities/user.entity';
import { IUserRepository, UserWithPassword } from '../../../domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '../../../domain/repositories/cart.repository.interface';
import { UserDomainService } from '../../../domain/services/user.domain.service';
import { ConfigService } from '@nestjs/config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('Invalid email format');
    }

    // Buscar usuario
    // Buscar usuario con contraseña para autenticación
    const userWithPassword = await this.userRepository.findByEmailForAuth(request.email);
    if (!userWithPassword) {
      throw new Error('Invalid credentials');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(request.password, userWithPassword.password);
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

    // Guardar nuevo refresh token
    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: userWithoutPassword.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
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
