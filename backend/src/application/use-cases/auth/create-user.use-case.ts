// 🏗️ APPLICATION USE CASES - Casos de uso y orquestación
// PROPÓSITO: Coordinar flujos de negocio entre entidades y servicios

import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { UserDomainService } from '../../../domain/services/user.domain.service';
import { ConfigService } from '@nestjs/config';

// EJEMPLO: Caso de uso - Crear usuario
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
}

export interface CreateUserResponse {
  user: User;
  message: string;
}

// EJEMPLO: Use Case para creación de usuarios
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
    private userDomainService: UserDomainService,
  ) {}

  // EJEMPLO: Método principal del caso de uso
  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    // EJEMPLO: Validaciones de negocio
    await this.validateBusinessRules(request);

    // EJEMPLO: Creación de entidad
    const user = await this.createUserEntity(request);

    // EJEMPLO: Persistencia
    const createdUser = await this.userRepository.create(user);

    return {
      user: createdUser,
      message: 'User created successfully',
    };
  }

  // EJEMPLO: Validaciones específicas del caso de uso
  private async validateBusinessRules(
    request: CreateUserRequest,
  ): Promise<void> {
    // EJEMPLO: Verificar si email ya existe
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('Email already exists');
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
      role: (request.role as any) || 'USER',
    };
  }
}

// EJEMPLO: Caso de uso - Login de usuario
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
    private userDomainService: UserDomainService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    // EJEMPLO: Buscar usuario
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // EJEMPLO: Validar contraseña (aquí se inyectaría servicio de hashing)
    // const isPasswordValid = await this.validatePassword(request.password, user.password);
    // if (!isPasswordValid) {
    //   throw new Error('Invalid credentials');
    // }

    // EJEMPLO: Generar tokens (aquí se inyectaría servicio JWT)
    const accessToken = 'generated_access_token'; // EJEMPLO
    const refreshToken = 'generated_refresh_token'; // EJEMPLO

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
