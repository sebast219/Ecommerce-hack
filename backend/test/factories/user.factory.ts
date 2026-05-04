// backend/test/factories/user.factory.ts - NUEVO
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../src/infrastructure/database/prisma.service';

export interface TestUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;        // Plain text para tests
  hashedPassword: string;  // Hash almacenado en DB
  role: string;
}

export class UserFactory {
  private counter = 0;

  constructor(private readonly prisma: PrismaService) {}

  async createUser(overrides: Partial<TestUser> = {}): Promise<TestUser> {
    this.counter++;
    const plainPassword = overrides.password || 'TestP@ssw0rd123!';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const userData = {
      email: overrides.email || `testuser${this.counter}@example.com`,
      firstName: overrides.firstName || 'Test',
      lastName: overrides.lastName || `User${this.counter}`,
      password: hashedPassword,
      role: overrides.role || 'USER',
      experienceLevel: 'BEGINNER',
      certifications: JSON.stringify([]), // Campo requerido por Prisma
    };

    const user = await this.prisma.user.create({ data: userData });

    return {
      ...user,
      password: plainPassword,
      hashedPassword: user.password,
    } as TestUser;
  }

  async createAdmin(overrides: Partial<TestUser> = {}): Promise<TestUser> {
    return this.createUser({ ...overrides, role: 'ADMIN' });
  }
}
