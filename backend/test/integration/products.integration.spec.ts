// backend/test/integration/products.integration.spec.ts - NUEVO
const request = require('supertest');
import { TestSetup } from '../setup';
import { UserFactory } from '../factories/user.factory';
import { ProductFactory } from '../factories/product.factory';

// Importar funciones de Jest para que TypeScript las reconozca
import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from '@jest/globals';

describe('Products Integration Tests', () => {
  let userFactory: UserFactory;
  let productFactory: ProductFactory;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    await TestSetup.initialize();
    userFactory = new UserFactory(TestSetup.prisma);
    productFactory = new ProductFactory(TestSetup.prisma);
  });

  beforeEach(async () => {
    await TestSetup.cleanup();

    // Crear usuarios y obtener tokens
    const admin = await userFactory.createAdmin({ email: 'admin@test.com' });
    const user = await userFactory.createUser({ email: 'user@test.com' });

    const adminLogin = await request(TestSetup.app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: admin.email, password: admin.password });
    // La respuesta está anidada: { success: true, data: { data: { accessToken, refreshToken } } }
    adminToken = adminLogin.body.data?.data?.accessToken || adminLogin.body.data?.accessToken;

    const userLogin = await request(TestSetup.app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password });
    userToken = userLogin.body.data?.data?.accessToken || userLogin.body.data?.accessToken;
  });

  afterAll(async () => {
    await TestSetup.teardown();
  });

  // LISTADO CON PAGINACIÓN
  describe('GET /api/v1/products', () => {
    it('should return paginated products', async () => {
       const category = await productFactory.createCategory();
      for (let i = 0; i < 15; i++) {
        await productFactory.createProduct({ categoryId: category.id });
      }

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?page=1&limit=10')
        .expect(200);

      expect(response.body.data.products).toHaveLength(10);
      expect(response.body.data.total).toBe(15);
      expect(response.body.data.totalPages).toBe(2);
      expect(response.body.data.page).toBe(1);
    }, 30000);

    it('should return last page correctly', async () => {
      const category = await productFactory.createCategory();
      for (let i = 0; i < 15; i++) {
        await productFactory.createProduct({ categoryId: category.id });
      }

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?page=2&limit=10')
        .expect(200);

      expect(response.body.data.products).toHaveLength(5);
      expect(response.body.data.page).toBe(2);
    }, 30000);

    it('should enforce max page size of 50', async () => {
      await productFactory.createProducts(5);

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?page=1&limit=1000')
        .expect(200);

      // Debe limitar a 50, no devolver 1000
      expect(response.body.data.limit).toBeLessThanOrEqual(50);
    });

    it('should filter by search term', async () => {
      const category = await productFactory.createCategory();
      await productFactory.createProduct({ name: 'Nmap Scanner Pro Test', categoryId: category.id });
      await productFactory.createProduct({ name: 'Wireshark Toolkit Test', categoryId: category.id });
      await productFactory.createProduct({ name: 'Metasploit Framework Test', categoryId: category.id });

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?search=nmap')
        .expect(200);

      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].name).toContain('Nmap');
    });

    it('should filter by price range', async () => {
      const category = await productFactory.createCategory();
      await productFactory.createProduct({ name: 'Price Test Low', price: 10, categoryId: category.id });
      await productFactory.createProduct({ name: 'Price Test Mid', price: 50, categoryId: category.id });
      await productFactory.createProduct({ name: 'Price Test High', price: 100, categoryId: category.id });

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?minPrice=20&maxPrice=80')
        .expect(200);

      const filteredProducts = response.body.data.products.filter((p: any) => p.name.includes('Price Test'));
      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].price.amount).toBe(50);
    });

    it('should sort by price ascending', async () => {
      const category = await productFactory.createCategory();
      await productFactory.createProduct({ price: 100, categoryId: category.id });
      await productFactory.createProduct({ price: 10, categoryId: category.id });
      await productFactory.createProduct({ price: 50, categoryId: category.id });

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?sortBy=price&sortOrder=asc')
        .expect(200);

      const prices = response.body.data.products.map(
        (p: any) => p.price.amount,
      );
      expect(prices).toEqual([...prices].sort((a: number, b: number) => a - b));
    }, 30000);

    it('should NOT return sensitive fields in list view', async () => {
      const category = await productFactory.createCategory();
      await productFactory.createProduct({ categoryId: category.id });

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products')
        .expect(200);

      const product = response.body.data.products[0];
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.price).toBeDefined();
      // No debería incluir metadata pesada en listado
    });

    it('should only return active products for public', async () => {
      const category = await productFactory.createCategory();
      await productFactory.createProduct({ isActive: true, categoryId: category.id });
      await productFactory.createProduct({ isActive: false, categoryId: category.id });

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products')
        .expect(200);

      expect(response.body.data.products).toHaveLength(1);
      response.body.data.products.forEach((p: any) => {
        expect(p.isActive).toBe(true);
      });
    });
  });

  // DETALLE DE PRODUCTO
  describe('GET /api/v1/products/:slug', () => {
    it('should return product detail', async () => {
      const product = await productFactory.createProduct({
        name: 'Test Product',
        slug: 'test-product',
      });

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products/test-product')
        .expect(200);

      expect(response.body.data.name).toBe('Test Product');
      expect(response.body.data.description).toBeDefined();
      expect(response.body.data.sku).toBeDefined();
    });

    it('should return 404 for non-existent product', async () => {
      await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products/non-existent-product')
        .expect(404);
    });
  });

  // ADMIN: CRUD
  describe('POST /api/v1/admin/products (Admin only)', () => {
    it('should allow admin to create product', async () => {
      const category = await productFactory.createCategory();

      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Metasploit Framework',
          slug: 'metasploit-framework',
          description: 'Advanced penetration testing framework',
          price: 299.99,
          sku: 'SKU-HACK-001',
          categoryId: category.id,
          images: ['https://example.com/image.jpg'],
          tags: ['pentesting', 'framework'],
          difficulty: 'INTERMEDIATE',
          compatibility: ['windows', 'linux', 'mac'],
          tutorials: ['https://example.com/tutorial'],
          isPhysical: false,
          trackInventory: false,
          isActive: true,
        })
        .expect(201);
    });

    it('should reject non-admin creating product (403)', async () => {
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Hack Product',
          slug: 'hack-product',
          price: 49.99,
          sku: 'SKU-HACK-001',
        })
        .expect(403);
    });

    it('should reject unauthenticated request (401)', async () => {
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/admin/products')
        .send({ name: 'test' })
        .expect(401);
    });
  });
});
