// 🚀 PERFORMANCE - Cache Service
// PROPÓSITO: Servicio de caché en memoria para optimizar rendimiento

import { Injectable } from '@nestjs/common';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

@Injectable()
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly defaultTTL = 300000; // 5 minutos en milisegundos

  /**
   * Almacena un valor en caché
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, item);
  }

  /**
   * Obtiene un valor de caché
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Verificar si el item ha expirado
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Obtiene un valor de caché o lo crea si no existe
   */
  async getOrCreate<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const data = await factory();
    this.set(key, data, ttl);
    return data;
  }

  /**
   * Elimina un valor de caché
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Elimina valores de caché por patrón
   */
  deletePattern(pattern: string): number {
    const regex = new RegExp(pattern);
    let deleted = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deleted++;
      }
    }

    return deleted;
  }

  /**
   * Limpia toda la caché
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Limpia caché expirada
   */
  cleanExpired(): number {
    let cleaned = 0;
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Obtiene estadísticas de la caché
   */
  getStats(): {
    size: number;
    expired: number;
    hitRate: number;
    memoryUsage: number;
  } {
    const now = Date.now();
    let expired = 0;
    let memoryUsage = 0;

    for (const item of this.cache.values()) {
      if (now - item.timestamp > item.ttl) {
        expired++;
      }

      // Estimación simple del tamaño en memoria
      memoryUsage += JSON.stringify(item.data).length * 2; // 2 bytes por caracter
    }

    return {
      size: this.cache.size,
      expired,
      hitRate: 0, // Se podría implementar tracking de hits/misses
      memoryUsage,
    };
  }

  /**
   * Cache para productos con TTL extendido
   */
  cacheProduct(productId: string, product: any): void {
    const key = `product:${productId}`;
    this.set(key, product, 600000); // 10 minutos
  }

  /**
   * Cache para categorías con TTL extendido
   */
  cacheCategory(categoryId: string, category: any): void {
    const key = `category:${categoryId}`;
    this.set(key, category, 1800000); // 30 minutos
  }

  /**
   * Cache para búsquedas con TTL corto
   */
  cacheSearch(searchTerm: string, results: any): void {
    const key = `search:${searchTerm}`;
    this.set(key, results, 60000); // 1 minuto
  }

  /**
   * Cache para carritos de usuarios con TTL corto
   */
  cacheCart(userId: string, cart: any): void {
    const key = `cart:${userId}`;
    this.set(key, cart, 300000); // 5 minutos
  }

  /**
   * Invalida caché relacionada con productos
   */
  invalidateProductCache(productId: string): void {
    this.delete(`product:${productId}`);
    this.deletePattern(`search:*`);
    this.deletePattern(`cart:*`);
  }

  /**
   * Invalida caché relacionada con categorías
   */
  invalidateCategoryCache(categoryId: string): void {
    this.delete(`category:${categoryId}`);
    this.deletePattern(`product:*`);
    this.deletePattern(`search:*`);
  }
}

// Decorador para caché de métodos
export function Cacheable(ttl?: number) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = this.cacheService as CacheService;
      const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;

      return cacheService.getOrCreate(
        cacheKey,
        () => method.apply(this, args),
        ttl,
      );
    };

    return descriptor;
  };
}

// Decorador para invalidación de caché
export function CacheInvalidate(pattern: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await method.apply(this, args);

      const cacheService = this.cacheService as CacheService;
      cacheService.deletePattern(pattern);

      return result;
    };

    return descriptor;
  };
}
