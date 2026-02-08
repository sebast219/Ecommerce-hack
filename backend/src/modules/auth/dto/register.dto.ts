import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
}

export class RegisterDto {
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+]?[\d\s\-\(\)]+$/, {
    message: 'Phone number must be valid',
  })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
