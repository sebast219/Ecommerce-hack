import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getProfile(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUserRole(userId: string, role: Role, currentUserRole: Role) {
    // Only admins can update roles
    if (currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can update user roles');
    }

    const user = await this.usersRepository.updateRole(userId, role);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt,
    };
  }

  async getAllUsers(currentUserRole: Role) {
    // Only admins can view all users
    if (currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can view all users');
    }

    return this.usersRepository.findAll();
  }
}
