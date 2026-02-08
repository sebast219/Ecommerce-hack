// PRODUCTS SERVICE - EJERCICIO PRÁCTICO
// OBJETIVO: Aprender a escribir business logic en NestJS

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implementa create paso a paso
  async create(createProductDto: CreateProductDto) {
    // PASO 1: Verificar si el SKU ya existe
    // - Usa prisma.product.findUnique({ where: { sku: createProductDto.sku } })
    // - Si existe, lanza ConflictException
    
    // PASO 2: Crear el producto
    // - Usa prisma.product.create({ data: createProductDto })
    // - Incluye relaciones si es necesario
    
    // PASO 3: Crear el inventario inicial
    // - Usa prisma.productInventory.create()
    // - Valores por defecto: quantity: 0, lowStock: 5
    
    console.log('Implementar create - SKU:', createProductDto.sku);
    return { message: 'Producto creado exitosamente' };
  }

  // TODO: Implementa findAll con filtros avanzados
  async findAll(filterDto: FilterProductDto) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      search,
      minPrice,
      maxPrice,
      isActive = true,
    } = filterDto;

    // PASO 1: Construir el where clause
    // - Crea un objeto where dinámico
    // - Agrega condiciones solo si los filtros existen
    
    // PASO 2: Implementar búsqueda por texto
    // - Usa el operador OR para buscar en name, description, sku
    // - Ejemplo: where.OR = [{ name: { contains: search, mode: 'insensitive' } }]
    
    // PASO 3: Implementar filtros de precio
    // - Usa gte (greater than or equal) y lte (less than or equal)
    // - Ejemplo: where.price = { gte: minPrice, lte: maxPrice }
    
    // PASO 4: Calcular skip para paginación
    // - const skip = (page - 1) * limit
    
    // PASO 5: Ejecutar queries en paralelo
    // - Usa Promise.all para obtener productos y total
    // - Ejemplo: Promise.all([prisma.product.findMany(), prisma.product.count()])
    
    // PASO 6: Retornar resultado con paginación
    // - Calcula pages: Math.ceil(total / limit)
    
    console.log('Implementar findAll con filtros:', filterDto);
    return {
      products: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0,
      },
    };
  }

  // TODO: Implementa findOne
  async findOne(id: string) {
    // PASO 1: Buscar producto por ID
    // - Usa prisma.product.findUnique({ where: { id } })
    // - Incluye relaciones: category, inventory
    
    // PASO 2: Manejar caso de no encontrado
    // - Si no existe, lanza NotFoundException
    
    console.log('Implementar findOne - ID:', id);
    return null;
  }

  // TODO: Implementa findBySlug
  async findBySlug(slug: string) {
    // PASO 1: Buscar por slug
    // - Usa prisma.product.findUnique({ where: { slug } })
    // - El slug debe ser único
    
    // PASO 2: Manejar no encontrado
    // - NotFoundException si no existe
    
    console.log('Implementar findBySlug - Slug:', slug);
    return null;
  }

  // TODO: Implementa update
  async update(id: string, updateProductDto: UpdateProductDto) {
    // PASO 1: Verificar que el producto existe
    // - Usa findOne() o prisma.product.findUnique()
    
    // PASO 2: Si se actualiza SKU, verificar que no exista
    // - Solo si updateProductDto.sku es diferente al actual
    
    // PASO 3: Actualizar el producto
    // - Usa prisma.product.update({ where: { id }, data: updateProductDto })
    
    console.log('Implementar update - ID:', id, 'Data:', updateProductDto);
    return { message: 'Producto actualizado' };
  }

  // TODO: Implementa remove (soft delete)
  async remove(id: string) {
    // PASO 1: Verificar que el producto existe
    // - Usa prisma.product.findUnique()
    
    // PASO 2: Soft delete (recomendado)
    // - Actualiza isActive: false en lugar de borrar
    // - Usa prisma.product.update({ where: { id }, data: { isActive: false } })
    
    // PASO 3: Hard delete (opcional)
    // - Usa prisma.product.delete({ where: { id } })
    // - CUIDADO: Esto borra permanentemente
    
    console.log('Implementar remove - ID:', id);
    return { message: 'Producto eliminado' };
  }

  // TODO: Implementa updateInventory
  async updateInventory(productId: string, quantity: number) {
    // PASO 1: Verificar que el producto y su inventario existen
    // - Usa prisma.productInventory.findUnique({ where: { productId } })
    
    // PASO 2: Actualizar cantidad
    // - Usa prisma.productInventory.update()
    // - Valida que quantity >= 0
    
    console.log('Implementar updateInventory - Product:', productId, 'Quantity:', quantity);
    return { message: 'Inventario actualizado' };
  }

  // TODO: Implementa decreaseInventory con transacción
  async decreaseInventory(productId: string, quantity: number) {
    // PASO 1: Usar transacción para consistencia
    // - Usa prisma.$transaction(async (tx) => { ... })
    
    // PASO 2: Verificar stock disponible
    // - Lee el inventario actual dentro de la transacción
    // - Si no hay suficiente stock, lanza ConflictException
    
    // PASO 3: Disminuir el inventario
    // - Actualiza la cantidad dentro de la transacción
    // - Asegúrate de que la cantidad no sea negativa
    
    console.log('Implementar decreaseInventory - Product:', productId, 'Quantity:', quantity);
    return { message: 'Inventario disminuido' };
  }

  // TODO: Implementa increaseInventory con transacción
  async increaseInventory(productId: string, quantity: number) {
    // PASO 1: Usar transacción
    // - Usa prisma.$transaction()
    
    // PASO 2: Verificar que el inventario existe
    // - Si no existe, créalo
    
    // PASO 3: Aumentar la cantidad
    // - Suma la cantidad al inventario existente
    
    console.log('Implementar increaseInventory - Product:', productId, 'Quantity:', quantity);
    return { message: 'Inventario aumentado' };
  }
}
