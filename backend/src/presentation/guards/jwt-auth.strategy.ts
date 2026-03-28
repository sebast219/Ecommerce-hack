// 🏗️ PRESENTATION STRATEGY - Estrategia JWT con Passport
// PROPÓSITO: Implementar estrategia de autenticación JWT con Passport

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
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
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
