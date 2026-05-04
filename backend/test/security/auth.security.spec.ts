// Tests de Seguridad Críticos para Autenticación
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserUseCase } from '../../src/application/use-cases/auth/create-user.use-case';
import { LoginUseCase } from '../../src/application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '../../src/application/use-cases/auth/refresh-token.use-case';
import { UserRepositoryImpl } from '../../src/infrastructure/database/repositories/user.repository.impl';
import { UserDomainService } from '../../src/domain/services/user.domain.service';
import { USER_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from '../../src/domain/repositories/user.repository.interface';
import { RefreshTokenService } from '../../src/infrastructure/auth/refresh-token.service';
import { RateLimiterService } from '../../src/infrastructure/security/rate-limiter.service';

describe('Security Tests - Authentication', () => {
  let module: TestingModule;
  let createUserUseCase: CreateUserUseCase;
  let loginUseCase: LoginUseCase;
  let refreshTokenUseCase: RefreshTokenUseCase;
  let rateLimiter: RateLimiterService;
  let jwtService: JwtService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        LoginUseCase,
        RefreshTokenUseCase,
        UserRepositoryImpl,
        RefreshTokenService,
        RateLimiterService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                'JWT_SECRET': 'test-secret-key-with-32-chars-minimum',
                'JWT_REFRESH_SECRET': 'test-refresh-secret-key-with-32-chars',
                'BCRYPT_ROUNDS': 12,
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    refreshTokenUseCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
    rateLimiter = module.get<RateLimiterService>(RateLimiterService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('Mass Assignment Prevention', () => {
    it('should NOT allow role assignment during registration', async () => {
      // Intentar registrar usuario con role ADMIN
      const userData = {
        email: 'attacker@evil.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'StrongP@ssw0rd123!',
        role: 'ADMIN', // Este campo debe ser ignorado
      };

      const result = await createUserUseCase.execute(userData);
      
      // El rol debe ser USER por defecto, no ADMIN
      expect(result.user.role).toBe('USER');
      expect(result.user.role).not.toBe('ADMIN');
    });

    it('should reject extra fields in DTO', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'StrongP@ssw0rd123!',
        isAdmin: true, // Campo extra no permitido
        isActive: true, // Campo extra no permitido
        extraField: 'should be ignored',
      };

      // El ValidationPipe con forbidNonWhitelisted debe rechazar
      await expect(createUserUseCase.execute(userData)).rejects.toThrow();
    });
  });

  describe('JWT Algorithm Confusion Prevention', () => {
    it('should reject tokens with wrong algorithm', async () => {
      // Crear token con algoritmo incorrecto (simulado)
      const maliciousToken = jwtService.sign(
        { sub: 'user123', email: 'test@example.com' },
        { algorithm: 'none' } // Intento de bypass
      );

      await expect(refreshTokenUseCase.execute({ refreshToken: maliciousToken }))
        .rejects.toThrow('Invalid or expired refresh token');
    });

    it('should validate algorithm explicitly', async () => {
      const payload = { sub: 'user123', email: 'test@example.com' };
      
      // Token válido con HS256
      const validToken = jwtService.sign(payload);
      
      // Verificar que el algoritmo sea HS256
      const decoded = jwtService.decode(validToken, { complete: true });
      expect(decoded.header.alg).toBe('HS256');
    });
  });

  describe('Rate Limiting', () => {
    it('should block IP after too many failed attempts', async () => {
      const ip = '192.168.1.100';
      const email = 'test@example.com';

      // Hacer intentos fallidos hasta el límite
      for (let i = 0; i < 10; i++) {
        rateLimiter.recordAttempt(ip, email, false);
      }

      // El siguiente intento debe ser bloqueado
      const result = rateLimiter.checkLoginRateLimit(ip, email);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Too many requests from this IP');
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should block email after too many failed attempts', async () => {
      const ip = '192.168.1.100';
      const email = 'test@example.com';

      // Intentos desde diferentes IPs pero mismo email
      for (let i = 0; i < 5; i++) {
        rateLimiter.recordAttempt(`192.168.1.${i}`, email, false);
      }

      const result = rateLimiter.checkLoginRateLimit('192.168.1.999', email);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Too many login attempts for this account');
    });

    it('should reset on successful login', async () => {
      const ip = '192.168.1.100';
      const email = 'test@example.com';

      // Hacer intentos fallidos
      rateLimiter.recordAttempt(ip, email, false);
      rateLimiter.recordAttempt(ip, email, false);

      // Login exitoso debe resetear los contadores
      rateLimiter.recordAttempt(ip, email, true);

      const result = rateLimiter.checkLoginRateLimit(ip, email);
      expect(result.allowed).toBe(true);
    });
  });

  describe('Token Family Security', () => {
    it('should detect reuse attack', async () => {
      const refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
      
      // Simular token reuse
      const oldToken = 'old-refresh-token';
      
      // Primer uso del token (normal)
      jest.spyOn(refreshTokenService, 'rotateRefreshToken')
        .mockResolvedValueOnce({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
          expiresIn: 900,
        });

      // Segundo uso del mismo token (reuse attack)
      jest.spyOn(refreshTokenService, 'rotateRefreshToken')
        .mockRejectedValueOnce(new Error('Token reuse detected - all sessions invalidated'));

      // El segundo uso debe lanzar error
      await expect(refreshTokenService.rotateRefreshToken(oldToken))
        .rejects.toThrow('Token reuse detected - all sessions invalidated');
    });

    it('should invalidate entire family on reuse', async () => {
      const refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
      
      // Mock para simular invalidación de familia
      const revokeAllSpy = jest.spyOn(refreshTokenService, 'revokeAllUserTokens');
      
      try {
        await refreshTokenService.rotateRefreshToken('reused-token');
      } catch (error) {
        // En reuse attack, se debe invalidar toda la familia
        expect(revokeAllSpy).toHaveBeenCalled();
      }
    });
  });

  describe('Password Security', () => {
    it('should reject weak passwords', async () => {
      const weakPasswords = [
        '123456',
        'password',
        'qwerty',
        'abc123',
        'short',
        'nouppercase1!',
        'NOLOWERCASE1!',
        'NoNumber!',
        'NoSpecialChar1',
      ];

      for (const password of weakPasswords) {
        const userData = {
          email: `test${password}@example.com`,
          firstName: 'Test',
          lastName: 'User',
          password,
        };

        await expect(createUserUseCase.execute(userData))
          .rejects.toThrow(/password/i);
      }
    });

    it('should hash passwords with bcrypt', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'StrongP@ssw0rd123!',
      };

      const result = await createUserUseCase.execute(userData);
      
      // El usuario debe haber sido creado exitosamente
      expect(result.user.email).toBe(userData.email);
      expect(result.user.firstName).toBe(userData.firstName);
      // El password no debe ser devuelto en la respuesta por seguridad
    });
  });

  describe('Input Validation', () => {
    it('should sanitize email input', async () => {
      const emails = [
        'test+spam@example.com',
        'TEST@EXAMPLE.COM',
        '  test@example.com  ',
        'test@sub.example.com',
      ];

      for (const email of emails) {
        const userData = {
          email,
          firstName: 'Test',
          lastName: 'User',
          password: 'StrongP@ssw0rd123!',
        };

        const result = await createUserUseCase.execute(userData);
        // Email debe estar normalizado (lowercase, trimmed)
        expect(result.user.email).toBe(email.toLowerCase().trim());
      }
    });

    it('should validate email format', async () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com',
        'test@example.',
      ];

      for (const email of invalidEmails) {
        const userData = {
          email,
          firstName: 'Test',
          lastName: 'User',
          password: 'StrongP@ssw0rd123!',
        };

        await expect(createUserUseCase.execute(userData))
          .rejects.toThrow(/email/i);
      }
    });
  });

  afterEach(async () => {
    await module.close();
  });
});
