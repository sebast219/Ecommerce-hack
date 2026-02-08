import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async create(productData: CreateProductDto, currentUserRole: Role) {
    // Only admins can create products
    if (currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can create products');
    }

    return this.productsRepository.create(productData);
  }

  async findAll(category?: string, limit = 20, offset = 0) {
    return this.productsRepository.findAll(category, limit, offset);
  }

  async findById(id: string) {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: string,
    productData: Partial<CreateProductDto>,
    currentUserRole: Role
  ) {
    // Only admins can update products
    if (currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can update products');
    }

    // Check if product exists
    await this.findById(id);

    return this.productsRepository.update(id, productData);
  }

  async delete(id: string, currentUserRole: Role) {
    // Only admins can delete products
    if (currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can delete products');
    }

    // Check if product exists
    await this.findById(id);

    return this.productsRepository.delete(id);
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.findById(id);
    
    // Check if enough stock is available
    if (product.stock + quantity < 0) {
      throw new ForbiddenException('Insufficient stock');
    }

    return this.productsRepository.updateStock(id, quantity);
  }

  async getCategories() {
    return this.productsRepository.getCategories();
  }
}
