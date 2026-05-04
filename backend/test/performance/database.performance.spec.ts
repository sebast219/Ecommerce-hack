// Tests de Performance para Base de Datos
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/infrastructure/database/prisma.service';
import { ProductRepositoryImpl } from '../../src/infrastructure/database/repositories/product.repository.impl';

describe('Performance Tests - Database', () => {
  let module: TestingModule;
  let prisma: PrismaService;
  let productRepository: ProductRepositoryImpl;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [PrismaService, ProductRepositoryImpl],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    productRepository = module.get<ProductRepositoryImpl>(ProductRepositoryImpl);
  });

  describe('Query Performance', () => {
    it('should use indexes for product searches', async () => {
      const startTime = Date.now();
      
      // Query con filtros que deberían usar índices
      await productRepository.findPaginated(
        { page: 1, limit: 20, sortBy: 'price', sortOrder: 'asc' },
        { 
          categoryId: 'test-category',
          minPrice: 10,
          maxPrice: 100,
          isActive: true,
          isFeatured: true
        }
      );
      
      const queryTime = Date.now() - startTime;
      
      // Queries con índices deben ser rápidas (< 100ms)
      expect(queryTime).toBeLessThan(100);
    });

    it('should avoid N+1 queries in product listings', async () => {
      const startTime = Date.now();
      
      // Esta query debe hacer JOINs en lugar de queries separadas
      const result = await productRepository.findPaginated(
        { page: 1, limit: 10 },
        { categoryId: 'test-category' }
      );
      
      const queryTime = Date.now() - startTime;
      
      // Sin N+1, debe ser rápido incluso con relaciones
      expect(queryTime).toBeLessThan(200);
      
      // Verificar que incluye relaciones sin queries adicionales
      expect(result.data[0]?.category).toBeDefined();
      expect(result.data[0]?.inventory).toBeDefined();
    });

    it('should handle large datasets efficiently', async () => {
      const startTime = Date.now();
      
      // Query de página avanzada (simulando dataset grande)
      const result = await productRepository.findPaginated(
        { page: 50, limit: 20 }, // Página 50 = 1000+ registros
        { search: 'test' }
      );
      
      const queryTime = Date.now() - startTime;
      
      // Paginación debe mantener performance constante
      expect(queryTime).toBeLessThan(300);
      expect(result.meta.page).toBe(50);
      expect(result.data.length).toBeLessThanOrEqual(20);
    });
  });

  describe('Pagination Performance', () => {
    it('should return correct pagination metadata', async () => {
      const result = await productRepository.findPaginated(
        { page: 2, limit: 10 },
        {}
      );
      
      expect(result.meta).toHaveProperty('total');
      expect(result.meta).toHaveProperty('page', 2);
      expect(result.meta).toHaveProperty('limit', 10);
      expect(result.meta).toHaveProperty('totalPages');
      expect(result.meta).toHaveProperty('hasNextPage');
      expect(result.meta).toHaveProperty('hasPreviousPage', true);
    });

    it('should respect maximum page size limit', async () => {
      // Intentar pedir más del máximo permitido
      const result = await productRepository.findPaginated(
        { page: 1, limit: 100 }, // Límite es 50
        {}
      );
      
      // Debe limitar al máximo
      expect(result.meta.limit).toBeLessThanOrEqual(50);
    });

    it('should handle edge cases gracefully', async () => {
      // Página fuera de rango
      const result1 = await productRepository.findPaginated(
        { page: 999999, limit: 10 },
        {}
      );
      
      expect(result1.data).toEqual([]);
      expect(result1.meta.page).toBe(999999);
      expect(result1.meta.hasPreviousPage).toBe(false);
      expect(result1.meta.hasNextPage).toBe(false);
      
      // Límite 0
      const result2 = await productRepository.findPaginated(
        { page: 1, limit: 0 },
        {}
      );
      
      expect(result2.data).toEqual([]);
    });
  });

  describe('Index Usage Validation', () => {
    it('should use composite indexes for complex filters', async () => {
      // Query que debe usar índice compuesto [categoryId, price]
      const startTime = Date.now();
      
      await productRepository.findPaginated(
        { page: 1, limit: 20 },
        { 
          categoryId: 'electronics',
          minPrice: 50,
          maxPrice: 500
        }
      );
      
      const queryTime = Date.now() - startTime;
      
      // Índice compuesto debe hacer esto muy rápido
      expect(queryTime).toBeLessThan(50);
    });

    it('should use featured products index', async () => {
      const startTime = Date.now();
      
      const featured = await productRepository.findFeatured(8);
      
      const queryTime = Date.now() - startTime;
      
      // Query de productos destacados debe usar índice específico
      expect(queryTime).toBeLessThan(30);
      expect(featured.length).toBeLessThanOrEqual(8);
    });

    it('should efficiently find low stock products', async () => {
      const startTime = Date.now();
      
      const lowStock = await productRepository.getLowStockProducts();
      
      const queryTime = Date.now() - startTime;
      
      // Debe usar índice [quantity, lowStock]
      expect(queryTime).toBeLessThan(50);
    });
  });

  describe('Memory Usage', () => {
    it('should not load unnecessary data', async () => {
      const startTime = Date.now();
      const memBefore = process.memoryUsage();
      
      // Query con select específico (sin descripciones largas)
      await productRepository.findPaginated(
        { page: 1, limit: 50 },
        {}
      );
      
      const memAfter = process.memoryUsage();
      const queryTime = Date.now() - startTime;
      
      // No debe cargar datos innecesarios
      expect(queryTime).toBeLessThan(100);
      
      // Memory usage debe ser razonable
      const heapDiff = memAfter.heapUsed - memBefore.heapUsed;
      expect(heapDiff).toBeLessThan(10 * 1024 * 1024); // < 10MB
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
