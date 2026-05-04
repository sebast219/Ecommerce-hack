// JWT Module Hardened con Algorithm Pinning y Token Family
import { Module, Global } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtTokenService } from './jwt-token.service';
import { RefreshTokenService } from './refresh-token.service';

@Global()
@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',        // Algoritmo fijo
          expiresIn: '15m',          // Access token corto
          issuer: 'ecommerce-hack',  // Issuer verification
          audience: 'ecommerce-hack-api',
        },
        verifyOptions: {
          algorithms: ['HS256'],     // SOLO acepta HS256
          issuer: 'ecommerce-hack',
          audience: 'ecommerce-hack-api',
        },
      }),
    }),
  ],
  providers: [JwtTokenService, RefreshTokenService],
  exports: [JwtTokenService, RefreshTokenService, NestJwtModule],
})
export class JwtAuthModule {}
