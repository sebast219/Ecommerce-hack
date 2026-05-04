// 🏗️ APPLICATION DTOs - Data Transfer Objects con validación
// PROPÓSITO: Definir estructuras de datos con validación robusta

import { IsEmail, IsString, IsOptional, MinLength, IsEnum, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
  MODERATOR = 'MODERATOR',
  INSTRUCTOR = 'INSTRUCTOR',
}

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'First name can only contain letters and spaces' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Last name can only contain letters and spaces' })
  lastName: string;

  @ApiProperty({ example: 'StrongP@ssw0rd123!', description: 'User password' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  password: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+?[\d\s\-\(\)]+$/, { message: 'Please provide a valid phone number' })
  phone?: string;

  // @ApiPropertyOptional({ example: 'USER', enum: UserRole, description: 'User role' })
  // @IsOptional()
  // @IsEnum(UserRole, { message: 'Role must be a valid user role' })
  // role?: UserRole;
  // REMOVIDO: Prevenir Mass Assignment Attack - el rol no debe ser asignable en registro
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd123!', description: 'User password' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(1, { message: 'Password cannot be empty' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Refresh token' })
  @IsString({ message: 'Refresh token must be a string' })
  @MinLength(10, { message: 'Refresh token is too short' })
  refreshToken: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John', description: 'User first name' })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'First name can only contain letters and spaces' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'User last name' })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Last name can only contain letters and spaces' })
  lastName?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+?[\d\s\-\(\)]+$/, { message: 'Please provide a valid phone number' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Cybersecurity professional', description: 'User bio' })
  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  bio?: string;

  @ApiPropertyOptional({ example: 'Tech Corp', description: 'User company' })
  @IsOptional()
  @IsString({ message: 'Company must be a string' })
  company?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldP@ssw0rd123!', description: 'Current password' })
  @IsString({ message: 'Current password must be a string' })
  @MinLength(1, { message: 'Current password cannot be empty' })
  currentPassword: string;

  @ApiProperty({ example: 'NewP@ssw0rd123!', description: 'New password' })
  @IsString({ message: 'New password must be a string' })
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  newPassword: string;

  @ApiProperty({ example: 'NewP@ssw0rd123!', description: 'Confirm new password' })
  @IsString({ message: 'Password confirmation must be a string' })
  @MinLength(8, { message: 'Password confirmation must be at least 8 characters' })
  confirmPassword: string;
}
