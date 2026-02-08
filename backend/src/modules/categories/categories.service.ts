import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    const category = await this.prisma.category.create({
      data: createCategoryDto,
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return category;
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findRootCategories() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          where: { isActive: true },
          include: {
            inventory: true,
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        products: {
          where: { isActive: true },
          include: {
            inventory: true,
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return updatedCategory;
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.products > 0) {
      throw new ConflictException('Cannot delete category with associated products');
    }

    if (category._count.children > 0) {
      throw new ConflictException('Cannot delete category with subcategories');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }
}
