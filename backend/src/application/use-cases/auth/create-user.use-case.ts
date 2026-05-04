// 🏗️ APPLICATION USE CASES - Casos de uso y orquestación
// PROPÓSITO: Coordinar flujos de negocio entre entidades y servicios

import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { RefreshTokenRepositoryImpl } from '../../../infrastructure/database/repositories/cart.repository.impl';
import { UserDomainService } from '../../../domain/services/user.domain.service';
import * as crypto from 'crypto';

// EJEMPLO: Caso de uso - Crear usuario
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
}

export interface CreateUserResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
  message: string;
}

// EJEMPLO: Use Case para creación de usuarios
export class CreateUserUseCase {
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

  // EJEMPLO: Método principal del caso de uso
  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    // EJEMPLO: Validaciones de negocio
    await this.validateBusinessRules(request);

    // EJEMPLO: Creación de entidad
    const user = await this.createUserEntity(request);

    // EJEMPLO: Persistencia
    const createdUser = await this.userRepository.create(user);

    // Generar tokens como en LoginUseCase
    const { accessToken, refreshToken } = await this.generateTokens(createdUser);

    // Remover password del response
    const { password, ...userWithoutPassword } = createdUser as any;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      message: 'User created successfully',
    };
  }

  // EJEMPLO: Método para generar tokens
  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'test-super-secret-refresh-key-for-testing-only',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    // Guardar refresh token en la base de datos
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const familyId = crypto.randomUUID();

    await this.refreshTokenRepository.create({
      tokenHash,
      familyId,
      userId: user.id,
      isRevoked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      updatedAt: new Date(),
    });

    return { accessToken, refreshToken };
  }

  // EJEMPLO: Validaciones específicas del caso de uso
  private async validateBusinessRules(
    request: CreateUserRequest,
  ): Promise<void> {
    // EJEMPLO: Verificar si email ya existe
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // EJEMPLO: Validaciones de dominio adicionales
    if (request.firstName.length < 2) {
      throw new Error('First name must be at least 2 characters');
    }

    // EJEMPLO: Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('Invalid email format');
    }
  }

  // EJEMPLO: Creación de entidad de dominio
  private createUserEntity(
    request: CreateUserRequest,
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      password: request.password, // Incluir password
      role: (request.role as any) || 'USER',
      isVerified: false, // Valor por defecto
      experienceLevel: 'BEGINNER', // Valor por defecto
      certifications: '[]', // Valor por defecto para compatibilidad con SQLite
    };
  }
}
