// 🏗️ INFRASTRUCTURE REPOSITORIES IMPLEMENTATIONS
// PROPÓSITO: Implementar interfaces de dominio usando tecnologías específicas (Prisma)

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { User, Product, Order, UserRole, OrderStatus } from '../../../domain/entities/user.entity';
import { 
  IUserRepository, 
  IProductRepository, 
  IOrderRepository 
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
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return prismaUser ? this.mapPrismaUserToUser(prismaUser) : null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // EJEMPLO: Creación con Prisma
    const prismaUser = await this.prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role as any, // EJEMPLO: Conversión de tipos
        password: 'hashed_password_here', // EJEMPLO: Se inyectaría servicio de hashing
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

    return prismaUsers.map(user => this.mapPrismaUserToUser(user));
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }

  // EJEMPLO: Método privado de mapeo
  private mapPrismaUserToUser(prismaUser: any): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      role: prismaUser.role as UserRole,
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

  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const prismaProduct = await this.prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        price: productData.price.amount, // EJEMPLO: Mapeo de Money a decimal
        sku: productData.sku,
        isActive: productData.isActive,
        categoryId: 'category_id_here', // EJEMPLO: Vendría del DTO
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return this.mapPrismaProductToProduct(prismaProduct);
  }

  // EJEMPLO: Implementaciones de otros métodos...
  async update(id: string, productData: Partial<Product>): Promise<Product> {
    // EJEMPLO: Lógica de actualización
    const prismaProduct = await this.prisma.product.update({
      where: { id },
      data: productData,
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

    return prismaProducts.map(product => this.mapPrismaProductToProduct(product));
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map(product => this.mapPrismaProductToProduct(product));
  }

  async search(query: string): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return prismaProducts.map(product => this.mapPrismaProductToProduct(product));
  }

  async existsBySku(sku: string): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
      select: { id: true },
    });

    return !!product;
  }

  // EJEMPLO: Método privado de mapeo
  private mapPrismaProductToProduct(prismaProduct: any): Product {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      slug: prismaProduct.slug,
      price: {
        amount: prismaProduct.price,
        currency: 'USD', // EJEMPLO: Valor por defecto
      },
      sku: prismaProduct.sku,
      isActive: prismaProduct.isActive,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
    };
  }
}
