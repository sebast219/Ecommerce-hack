// AUTH CONTROLLER - EJERCICIO PRÁCTICO
// OBJETIVO: Aprender a crear endpoints de autenticación con NestJS

import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  Get,
  Request,
  Post,
  Patch,
  Delete
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard, Public } from '../../common';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // TODO: Implementa endpoint POST /auth/login - Inicio de sesión
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    // CONCEPTO: Endpoint público con @Public decorator
    // - Login y register no requieren autenticación previa
    // - @Public override el guard global si existe
    
    // CONCEPTO: Status codes específicos
    // - @HttpCode(HttpStatus.OK): Retorna 200 en lugar de 201
    // - Login no es creación de recurso, es autenticación
    
    // CONCEPTO: DTO validation
    // - LoginDto valida email y password automáticamente
    // - Si la validación falla, retorna 400 antes de llegar aquí
    
    console.log('POST /auth/login - Login user:', loginDto.email);
    return this.authService.login(loginDto);
  }

  // TODO: Implementa endpoint POST /auth/register - Registro de usuarios
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    // CONCEPTO: Creación de recursos
    // - POST retorna 201 por defecto (creado)
    // - RegisterDto valida todos los campos requeridos
    
    // CONCEPTO: Validación de negocio
    // - El service verifica si el email ya existe
    // - Maneja ConflictException (409) apropiadamente
    
    console.log('POST /auth/register - Register user:', registerDto.email);
    return this.authService.register(registerDto);
  }

  // TODO: Implementa endpoint POST /auth/refresh - Renovar tokens
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    // CONCEPTO: Token refresh mechanism
    // - @Body('refreshToken'): Extrae campo específico del body
    // - Espera { "refreshToken": "abc123" } en el request
    
    // CONCEPTO: JWT rotation
    // - Se genera nuevo access y refresh token
    // - El refresh token antiguo se invalida
    
    console.log('POST /auth/refresh - Refresh token');
    return this.authService.refreshToken(refreshToken);
  }

  // TODO: Implementa endpoint GET /auth/profile - Obtener perfil del usuario
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    // CONCEPTO: Endpoint protegido
    // - @UseGuards(JwtAuthGuard): Requiere token válido
    // - @ApiBearerAuth(): Documenta que requiere Bearer token
    
    // CONCEPTO: Request object inyectado
    // - @Request() inyecta el objeto request completo
    // - req.user es poblado por el JwtAuthGuard
    
    // CONCEPTO: User payload
    // - req.user contiene el payload del JWT decodificado
    // - Incluye: id, email, role (definido en login/register)
    
    console.log('GET /auth/profile - Get user profile');
    return req.user;
  }

  // TODO: Implementa endpoint POST /auth/logout - Cerrar sesión
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Request() req) {
    // CONCEPTO: Token invalidation
    // - Extrae refresh token del request (podría venir del body o header)
    // - Invalida el refresh token en la base de datos
    
    // CONCEPTO: Session management
    // - El access token sigue siendo válido hasta que expire
    // - Pero el refresh token ya no puede renovarlo
    
    console.log('POST /auth/logout - Logout user');
    // En una implementación real, extraeríamos el refresh token del request
    return this.authService.logout('refresh-token-placeholder');
  }

  // TODO: Implementa endpoint DELETE /auth/revoke-all - Revocar todos los tokens
  @Delete('revoke-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke all user tokens (Admin only)' })
  @ApiResponse({ status: 200, description: 'All tokens revoked' })
  async revokeAllTokens(@Request() req, @Body('userId') userId?: string) {
    // CONCEPTO: Admin functionality
    // - Admin puede revocar todos los tokens de cualquier usuario
    // - Usuario normal solo puede revocar sus propios tokens
    
    // CONCEPTO: Security measures
    // - Útil para forzar logout en todos los dispositivos
    // - Común después de cambio de contraseña o actividad sospechosa
    
    const targetUserId = userId || req.user.id;
    console.log('DELETE /auth/revoke-all - Revoke all tokens for user:', targetUserId);
    return this.authService.revokeAllUserTokens(targetUserId);
  }
}
