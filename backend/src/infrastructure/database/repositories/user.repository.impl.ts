// 🏗️ INFRASTRUCTURE REPOSITORIES IMPLEMENTATIONS
// PROPÓSITO: Implementar interfaces de dominio usando tecnologías específicas (Prisma)

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import {
  User,
  UserRole,
  Product,
  Money,
} from '../../../domain/entities/user.entity';
import {
  IUserRepository,
  IProductRepository,
  UserWithPassword,
} from '../../../domain/repositories/user.repository.interface';

// EJEMPLO: Implementación de repositorio de usuarios con Prisma
@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  // EJEMPLO: Implementación de método de interfaz
  async findById(id: string): Promise<User | null> {
    // EJEMPLO: Mapeo de Prisma a entidad de dominio
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
      include: {
        // EJEMPLO: Incluir relaciones si es necesario
        orders: false,
        cartItems: false,
      },
    });

    if (!prismaUser) {
      return null;
    }

    // EJEMPLO: Transformar a entidad de dominio
    return this.mapPrismaUserToUser(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log('=== REPOSITORY FIND BY EMAIL ===');
    console.log('Searching for email:', email);
    
    // Buscar case insensitive - usar findUnique con email normalizado
    const normalizedEmail = email.toLowerCase().trim();
    console.log('Normalized email for search:', normalizedEmail);
    
    const prismaUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    console.log('Prisma user found:', !!prismaUser);
    if (prismaUser) {
      console.log('Found user ID:', prismaUser.id);
      console.log('Found user email:', prismaUser.email);
      console.log('Email comparison (stored vs search):');
      console.log('- Stored email:', prismaUser.email);
      console.log('- Search email:', email);
      console.log('- Normalized search:', normalizedEmail);
      console.log('- Case insensitive match:', prismaUser.email.toLowerCase() === normalizedEmail);
    }

    return prismaUser ? this.mapPrismaUserToUser(prismaUser) : null;
  }

  async create(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    // Hash de la contraseña
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Creación con Prisma
    const prismaUser = await this.prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role as any,
        password: hashedPassword,
        isVerified: userData.isVerified || false,
        experienceLevel: userData.experienceLevel as any || 'BEGINNER',
        certifications: userData.certifications || '[]',
        phone: userData.phone,
        avatar: userData.avatar,
      },
    });

    return this.mapPrismaUserToUser(prismaUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data: userData,
    });

    return this.mapPrismaUserToUser(prismaUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  // EJEMPLO: Métodos específicos del dominio
  async findByRole(role: string): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: { role: role as any },
    });

    return prismaUsers.map((user) => this.mapPrismaUserToUser(user));
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }

  // Método de autenticación - incluye contraseña
  async findByEmailForAuth(email: string): Promise<UserWithPassword | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) {
      return null;
    }

    return {
      id: prismaUser.id,
      email: prismaUser.email,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      password: prismaUser.password,
      role: prismaUser.role as any,
      isVerified: prismaUser.isVerified || false,
      experienceLevel: prismaUser.experienceLevel || 'BEGINNER',
      certifications: (prismaUser.certifications || '[]') as any,
      phone: prismaUser.phone,
      avatar: prismaUser.avatar,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }

  // EJEMPLO: Método privado de mapeo
  private mapPrismaUserToUser(prismaUser: any): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      password: prismaUser.password,
      role: prismaUser.role, // Cambiado a string para compatibilidad con SQLite
      isVerified: prismaUser.isVerified || false,
      experienceLevel: prismaUser.experienceLevel || 'BEGINNER',
      certifications: (prismaUser.certifications || '[]') as any,
      phone: prismaUser.phone,
      avatar: prismaUser.avatar,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }
}

// EJEMPLO: Implementación de repositorio de productos
@Injectable()
export class ProductRepositoryImpl implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const prismaProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProduct ? this.mapPrismaProductToProduct(prismaProduct) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const prismaProduct = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProduct ? this.mapPrismaProductToProduct(prismaProduct) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const prismaProduct = await this.prisma.product.findUnique({
      where: { sku },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProduct ? this.mapPrismaProductToProduct(prismaProduct) : null;
  }

  async create(
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    throw new Error('Create method not implemented - use ProductRepositoryImpl instead');
  }

  // EJEMPLO: Implementaciones de otros métodos...
  async update(id: string, productData: Partial<Product>): Promise<Product> {
    // EJEMPLO: Lógica de actualización
    const prismaProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        price: productData.price?.amount, // Convertir Money a decimal
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return this.mapPrismaProductToProduct(prismaProduct);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  // EJEMPLO: Métodos específicos del dominio
  async findActive(): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map((product) =>
      this.mapPrismaProductToProduct(product),
    );
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map((product) =>
      this.mapPrismaProductToProduct(product),
    );
  }

  async search(query: string): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { sku: { contains: query } },
        ],
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map((product) =>
      this.mapPrismaProductToProduct(product),
    );
  }

  async existsBySku(sku: string): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
      select: { id: true },
    });

    return !!product;
  }

  // Método de autenticación - incluye contraseña
  async findByEmailForAuth(email: string): Promise<UserWithPassword | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) {
      return null;
    }

    return {
      id: prismaUser.id,
      email: prismaUser.email,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      password: prismaUser.password,
      role: prismaUser.role as any,
      isVerified: prismaUser.isVerified || false,
      experienceLevel: prismaUser.experienceLevel || 'BEGINNER',
      certifications: (prismaUser.certifications || '[]') as any,
      phone: prismaUser.phone,
      avatar: prismaUser.avatar,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }

  // EJEMPLO: Método privado de mapeo
  private mapPrismaProductToProduct(prismaProduct: any): Product {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      slug: prismaProduct.slug,
      price: new Money(Number(prismaProduct.price), 'USD'),
      sku: prismaProduct.sku,
      isActive: prismaProduct.isActive,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
    };
  }
}
