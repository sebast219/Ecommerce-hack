// 🏗️ PRESENTATION STRATEGY - Estrategia JWT con Passport
// PROPÓSITO: Implementar estrategia de autenticación JWT con Passport

import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get('JWT_SECRET') || 'test-secret-key-for-development',
      algorithms: ['HS256'], // PREVENIR Algorithm Confusion Attack
    });
  }

  async validate(payload: any) {
    // Validar que el usuario existe en la base de datos
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new Error('User not found');
    }

    // Validar que el usuario existe (no hay campo isActive en el schema)
    // if (!user.isActive) {
    //   throw new Error('User is not active');
    // }

    // Retornar información del usuario para ser inyectada en el request
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
