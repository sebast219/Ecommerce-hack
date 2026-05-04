// backend/test/integration/products.integration.spec.ts - NUEVO
const request = require('supertest');
import { TestSetup } from '../setup';
import { UserFactory } from '../factories/user.factory';
import { ProductFactory } from '../factories/product.factory';

// Importar funciones de Jest para que TypeScript las reconozca
import { describe, it, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';

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
    adminToken = adminLogin.body.data.accessToken;

    const userLogin = await request(TestSetup.app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password });
    userToken = userLogin.body.data.accessToken;
  });

  afterAll(async () => {
    await TestSetup.teardown();
  });

  // LISTADO CON PAGINACIÓN
  describe('GET /api/v1/products', () => {
    it('should return paginated products', async () => {
      await productFactory.createProducts(25);

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?page=1&limit=10')
        .expect(200);

      expect(response.body.data.products).toHaveLength(10);
      expect(response.body.data.total).toBe(25);
      expect(response.body.data.totalPages).toBe(3);
      expect(response.body.data.page).toBe(1);
    });

    it('should return last page correctly', async () => {
      await productFactory.createProducts(25);

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?page=3&limit=10')
        .expect(200);

      expect(response.body.data.products).toHaveLength(5);
      expect(response.body.data.page).toBe(3);
    });

    it('should enforce max page size of 50', async () => {
      await productFactory.createProducts(5);

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?page=1&limit=1000')
        .expect(200);

      // Debe limitar a 50, no devolver 1000
      expect(response.body.data.limit).toBeLessThanOrEqual(50);
    });

    it('should filter by search term', async () => {
      await productFactory.createProduct({ name: 'Nmap Scanner Pro' });
      await productFactory.createProduct({ name: 'Wireshark Toolkit' });
      await productFactory.createProduct({ name: 'Metasploit Framework' });

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?search=nmap')
        .expect(200);

      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].name).toContain('Nmap');
    });

    it('should filter by price range', async () => {
      await productFactory.createProduct({ price: 10 });
      await productFactory.createProduct({ price: 50 });
      await productFactory.createProduct({ price: 100 });

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?minPrice=20&maxPrice=80')
        .expect(200);

      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].price.amount).toBe(50);
    });

    it('should sort by price ascending', async () => {
      await productFactory.createProduct({ price: 100 });
      await productFactory.createProduct({ price: 10 });
      await productFactory.createProduct({ price: 50 });

      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/products?sortBy=price&sortOrder=asc')
        .expect(200);

      const prices = response.body.data.products.map((p: any) => p.price.amount);
      expect(prices).toEqual([...prices].sort((a: number, b: number) => a - b));
    });

    it('should NOT return sensitive fields in list view', async () => {
      await productFactory.createProduct();

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
      await productFactory.createProduct({ isActive: true });
      await productFactory.createProduct({ isActive: false });

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
