// 🧪 UNIT TESTS - Authentication Use Cases
// PROPÓSITO: Testing completo de casos de uso de autenticación

import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase, LoginUseCase, RefreshTokenUseCase } from '../../src/application/use-cases/auth/login.use-case';
import { UserRepositoryImpl } from '../../src/infrastructure/database/repositories/user.repository.impl';
import { RefreshTokenRepositoryImpl } from '../../src/infrastructure/database/repositories/cart.repository.impl';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/infrastructure/database/prisma.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('Authentication Use Cases', () => {
  let module: TestingModule;
  let userRepository: UserRepositoryImpl;
  let refreshTokenRepository: RefreshTokenRepositoryImpl;
  let jwtService: JwtService;
  let configService: ConfigService;
  let createUserUseCase: CreateUserUseCase;
  let loginUseCase: LoginUseCase;
  let refreshTokenUseCase: RefreshTokenUseCase;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config = {
          JWT_SECRET: 'test-secret',
          JWT_REFRESH_SECRET: 'test-refresh-secret',
        };
        return config[key];
      }),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      verifyAsync: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        PrismaService,
        ConfigService,
        JwtService,
        UserRepositoryImpl,
        RefreshTokenRepositoryImpl,
        CreateUserUseCase,
        LoginUseCase,
        RefreshTokenUseCase,
      ],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .overrideProvider(ConfigService)
    .useValue(mockConfigService)
    .overrideProvider(JwtService)
    .useValue(mockJwtService)
    .compile();

    userRepository = module.get<UserRepositoryImpl>(UserRepositoryImpl);
    refreshTokenRepository = module.get<RefreshTokenRepositoryImpl>(RefreshTokenRepositoryImpl);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    refreshTokenUseCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
  });

  describe('CreateUserUseCase', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'StrongP@ssw0rd123!',
        role: 'USER',
      };

      const expectedUser = {
        id: 'user-123',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockResolvedValue(expectedUser as any);

      // Act
      const result = await createUserUseCase.execute(userData);

      // Assert
      expect(result.user).toEqual(expectedUser);
      expect(result.message).toBe('User created successfully');
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'StrongP@ssw0rd123!',
      };

      const existingUser = { id: 'existing-user', email: userData.email };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(existingUser as any);

      // Act & Assert
      await expect(createUserUseCase.execute(userData)).rejects.toThrow(
        new BadRequestException('Email already exists')
      );
    });

    it('should validate email format', async () => {
      // Arrange
      const userData = {
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
        password: 'StrongP@ssw0rd123!',
      };

      // Act & Assert
      await expect(createUserUseCase.execute(userData)).rejects.toThrow(
        new BadRequestException('Invalid email format')
      );
    });

    it('should validate password strength', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'weak',
      };

      // Act & Assert
      await expect(createUserUseCase.execute(userData)).rejects.toThrow(
        new BadRequestException('Password must be at least 8 characters')
      );
    });
  });

  describe('LoginUseCase', () => {
    it('should login successfully', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'StrongP@ssw0rd123!',
      };

      const user = {
        id: 'user-123',
        email: loginData.email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
        password: '$2b$10$hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('access-token').mockReturnValueOnce('refresh-token');
      jest.spyOn(refreshTokenRepository, 'create').mockResolvedValue({} as any);

      // Act
      const result = await loginUseCase.execute(loginData);

      // Assert
      expect(result.user).toBeDefined();
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
    });

    it('should throw error for invalid credentials', async () => {
      // Arrange
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      // Act & Assert
      await expect(loginUseCase.execute(loginData)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );
    });

    it('should throw error for wrong password', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const user = {
        id: 'user-123',
        email: loginData.email,
        password: '$2b$10$hashedpassword',
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user as any);

      // Act & Assert
      await expect(loginUseCase.execute(loginData)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );
    });
  });

  describe('RefreshTokenUseCase', () => {
    it('should refresh tokens successfully', async () => {
      // Arrange
      const refreshTokenData = {
        refreshToken: 'valid-refresh-token',
      };

      const tokenPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: 'USER',
        type: 'refresh',
      };

      const user = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'USER',
      };

      const tokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(tokenPayload as any);
      jest.spyOn(userRepository, 'findById').mockResolvedValue(user as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('new-access-token').mockReturnValueOnce('new-refresh-token');
      jest.spyOn(refreshTokenRepository, 'deleteByUserId').mockResolvedValue();
      jest.spyOn(refreshTokenRepository, 'create').mockResolvedValue({} as any);

      // Act
      const result = await refreshTokenUseCase.execute(refreshTokenData);

      // Assert
      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
      expect(jwtService.verifyAsync).toHaveBeenCalled();
      expect(userRepository.findById).toHaveBeenCalledWith('user-123');
    });

    it('should throw error for invalid refresh token', async () => {
      // Arrange
      const refreshTokenData = {
        refreshToken: 'invalid-token',
      };

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'));

      // Act & Assert
      await expect(refreshTokenUseCase.execute(refreshTokenData)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token')
      );
    });

    it('should throw error for expired refresh token', async () => {
      // Arrange
      const refreshTokenData = {
        refreshToken: 'expired-token',
      };

      const tokenExpiredError = new Error('Token expired');
      (tokenExpiredError as any).name = 'TokenExpiredError';

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(tokenExpiredError);

      // Act & Assert
      await expect(refreshTokenUseCase.execute(refreshTokenData)).rejects.toThrow(
        new UnauthorizedException('Refresh token expired')
      );
    });
  });

  afterEach(async () => {
    await module.close();
  });
});
