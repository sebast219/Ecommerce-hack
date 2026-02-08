// AUTH SERVICE - EJERCICIO PRÁCTICO
// OBJETIVO: Aprender a implementar autenticación y gestión de tokens en NestJS

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // TODO: Implementa validateUser - Verificación de credenciales
  async validateUser(email: string, password: string) {
    // PASO 1: Buscar usuario por email
    // - Usa prisma.user.findUnique({ where: { email } })
    // - Concepto: Consulta a base de datos con Prisma
    
    // PASO 2: Verificar contraseña
    // - Usa bcrypt.compare(password, user.password)
    // - Concepto: Comparación segura de hashes de contraseñas
    
    // PASO 3: Retornar usuario sin contraseña
    // - Usa destructuring: { password, ...result }
    // - Concepto: Seguridad - nunca exponer hashes
    
    console.log('Implementar validateUser - Email:', email);
    return null;
  }

  // TODO: Implementa login - Autenticación y generación de tokens
  async login(loginDto: LoginDto) {
    // PASO 1: Validar credenciales del usuario
    // - Usa validateUser() con email y password del DTO
    // - Si no es válido, lanza UnauthorizedException
    
    // PASO 2: Crear payload para JWT
    // - Incluye email, id (sub), y role
    // - Concepto: JWT payload structure
    
    // PASO 3: Generar access token
    // - Usa this.jwtService.sign(payload)
    // - Concepto: JWT short-lived token
    
    // PASO 4: Generar refresh token
    // - Usa this.jwtService.sign(payload, { expiresIn: '7d' })
    // - Concepto: JWT long-lived token para renovación
    
    // PASO 5: Persistir refresh token
    // - Usa saveRefreshToken() que crearemos después
    // - Concepto: Token revocación management
    
    console.log('Implementar login - Email:', loginDto.email);
    return { message: 'Login pendiente de implementación' };
  }

  // TODO: Implementa register - Registro de nuevos usuarios
  async register(registerDto: RegisterDto) {
    // PASO 1: Verificar si el email ya existe
    // - Usa prisma.user.findUnique({ where: { email } })
    // - Si existe, lanza ConflictException
    
    // PASO 2: Hashear la contraseña
    // - Usa bcrypt.hash(password, 10)
    // - Concepto: Password hashing con salt rounds
    
    // PASO 3: Crear usuario en base de datos
    // - Usa prisma.user.create() con el password hasheado
    // - Usa select para excluir campos sensibles
    
    // PASO 4: Generar tokens (igual que login)
    // - Reutiliza la lógica de generación de tokens
    
    // PASO 5: Persistir refresh token
    // - Guarda el refresh token en la base de datos
    
    console.log('Implementar register - Email:', registerDto.email);
    return { message: 'Registro pendiente de implementación' };
  }

  // TODO: Implementa refreshToken - Renovación de access tokens
  async refreshToken(refreshToken: string) {
    // PASO 1: Verificar y decodificar el refresh token
    // - Usa this.jwtService.verify(refreshToken)
    // - Si es inválido, lanza UnauthorizedException
    
    // PASO 2: Buscar token almacenado en base de datos
    // - Usa prisma.refreshToken.findFirst()
    // - Verifica que no esté expirado: expiresAt > new Date()
    
    // PASO 3: Generar nuevos tokens
    // - Crea nuevo access token y refresh token
    // - Concepto: Token rotation security
    
    // PASO 4: Actualizar refresh token
    // - Borra el antiguo y guarda el nuevo
    // - Concepto: Prevent token reuse attacks
    
    console.log('Implementar refreshToken');
    return { message: 'Refresh token pendiente de implementación' };
  }

  // TODO: Implementa logout - Cierre de sesión
  async logout(refreshToken: string) {
    // PASO 1: Eliminar refresh token
    // - Usa prisma.refreshToken.deleteMany()
    // - Concepto: Token invalidation
    
    // PASO 2: Retornar confirmación
    // - Simple success message
    
    console.log('Implementar logout');
    return { message: 'Logout pendiente de implementación' };
  }

  // TODO: Implementa revokeAllUserTokens - Revocar todos los tokens de un usuario
  async revokeAllUserTokens(userId: string) {
    // PASO 1: Eliminar todos los refresh tokens del usuario
    // - Usa prisma.refreshToken.deleteMany({ where: { userId } })
    // - Concepto: Force logout from all devices
    
    // PASO 2: Retornar confirmación
    // - Útil para seguridad (cambio de contraseña, etc.)
    
    console.log('Implementar revokeAllUserTokens - User ID:', userId);
    return { message: 'Tokens revocados pendiente de implementación' };
  }

  // TODO: Implementa saveRefreshToken - Almacenamiento seguro de refresh tokens
  private async saveRefreshToken(userId: string, token: string) {
    // PASO 1: Calcular fecha de expiración
    // - Usa this.configService.get('jwt.refreshExpiresIn') || '7d'
    // - Calcula expiresAt = new Date() + días
    
    // PASO 2: Guardar token en base de datos
    // - Usa prisma.refreshToken.create()
    // - Incluye token, userId, y expiresAt
    
    console.log('Implementar saveRefreshToken - User ID:', userId);
  }
}
