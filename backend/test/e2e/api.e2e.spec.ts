// 🧪 E2E TESTS - API Endpoints
// PROPÓSITO: Testing end-to-end de endpoints completos

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API Endpoints (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let prisma: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();
    prisma = moduleFixture.get('PrismaService');

    // Limpiar base de datos de prueba
    await prisma.user.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.cartItem.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    describe('POST /api/v1/auth/register', () => {
      it('should register a new user', () => {
        return request(server)
          .post('/api/v1/auth/register')
          .send({
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'StrongP@ssw0rd123!',
            role: 'USER',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.email).toBe('test@example.com');
            expect(res.body.data.user.firstName).toBe('John');
            expect(res.body.data.user.lastName).toBe('Doe');
            expect(res.body.data.user.role).toBe('USER');
            expect(res.body.message).toBe('User created successfully');
          });
      });

      it('should return error for duplicate email', async () => {
        // Create user first
        await request(server)
          .post('/api/v1/auth/register')
          .send({
            email: 'duplicate@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            password: 'StrongP@ssw0rd123!',
          });

        // Try to create same user again
        return request(server)
          .post('/api/v1/auth/register')
          .send({
            email: 'duplicate@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            password: 'StrongP@ssw0rd123!',
          })
          .expect(409)
          .expect((res) => {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Email already exists');
          });
      });

      it('should validate email format', () => {
        return request(server)
          .post('/api/v1/auth/register')
          .send({
            email: 'invalid-email',
            firstName: 'John',
            lastName: 'Doe',
            password: 'StrongP@ssw0rd123!',
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid email format');
          });
      });

      it('should validate password strength', () => {
        return request(server)
          .post('/api/v1/auth/register')
          .send({
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'weak',
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Password must be at least 8 characters');
          });
      });
    });

    describe('POST /api/v1/auth/login', () => {
      let user: any;

      beforeEach(async () => {
        // Create user for login tests
        const response = await request(server)
          .post('/api/v1/auth/register')
          .send({
            email: 'login@example.com',
            firstName: 'Login',
            lastName: 'User',
            password: 'LoginP@ssw0rd123!',
          });
        
        user = response.body.data.user;
      });

      it('should login successfully', () => {
        return request(server)
          .post('/api/v1/auth/login')
          .send({
            email: 'login@example.com',
            password: 'LoginP@ssw0rd123!',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.accessToken).toBeDefined();
            expect(res.body.data.refreshToken).toBeDefined();
            expect(res.body.data.user.email).toBe('login@example.com');
            expect(res.body.message).toBe('Login successful');
          });
      });

      it('should return error for invalid credentials', () => {
        return request(server)
          .post('/api/v1/auth/login')
          .send({
            email: 'login@example.com',
            password: 'wrongpassword',
          })
          .expect(401)
          .expect((res) => {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid credentials');
          });
      });

      it('should return error for non-existent user', () => {
        return request(server)
          .post('/api/v1/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'password',
          })
          .expect(401)
          .expect((res) => {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid credentials');
          });
      });
    });

    describe('POST /api/v1/auth/refresh', () => {
      let tokens: any;

      beforeEach(async () => {
        // Login to get tokens
        const loginResponse = await request(server)
          .post('/api/v1/auth/login')
          .send({
            email: 'refresh@example.com',
            firstName: 'Refresh',
            lastName: 'User',
            password: 'RefreshP@ssw0rd123!',
          });

        tokens = loginResponse.body.data;
      });

      it('should refresh tokens successfully', () => {
        return request(server)
          .post('/api/v1/auth/refresh')
          .send({
            refreshToken: tokens.refreshToken,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.accessToken).toBeDefined();
            expect(res.body.data.refreshToken).toBeDefined();
            expect(res.body.message).toBe('Token refreshed successfully');
          });
      });

      it('should return error for invalid refresh token', () => {
        return request(server)
          .post('/api/v1/auth/refresh')
          .send({
            refreshToken: 'invalid-token',
          })
          .expect(401)
          .expect((res) => {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid refresh token');
          });
      });
    });
  });

  describe('Products', () => {
    describe('GET /api/v1/products', () => {
      it('should get products list', () => {
        return request(server)
          .get('/api/v1/products')
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.products).toBeDefined();
            expect(Array.isArray(res.body.data.products)).toBe(true);
            expect(res.body.data.pagination).toBeDefined();
            expect(res.body.message).toBe('Products retrieved successfully');
          });
      });

      it('should filter products by category', () => {
        return request(server)
          .get('/api/v1/products?categoryId=wireless-attacks')
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.products).toBeDefined();
          });
      });

      it('should search products', () => {
        return request(server)
          .get('/api/v1/products?search=WiFi')
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.products).toBeDefined();
          });
      });

      it('should paginate products', () => {
        return request(server)
          .get('/api/v1/products?page=1&limit=5')
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.pagination.page).toBe(1);
            expect(res.body.data.pagination.limit).toBe(5);
            expect(res.body.data.products.length).toBeLessThanOrEqual(5);
          });
      });

      it('should sort products', () => {
        return request(server)
          .get('/api/v1/products?sortBy=name&sortOrder=asc')
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.products).toBeDefined();
          });
      });
    });

    describe('GET /api/v1/products/:identifier', () => {
      it('should get product by ID', () => {
        return request(server)
          .get('/api/v1/products/wifi-pineapple-mark-vii')
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.product).toBeDefined();
            expect(res.body.data.product.slug).toBe('wifi-pineapple-mark-vii');
            expect(res.body.message).toBe('Product retrieved successfully');
          });
      });

      it('should return 404 for non-existent product', () => {
        return request(server)
          .get('/api/v1/products/non-existent-product')
          .expect(404)
          .expect((res) => {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Product not found');
          });
      });
    });

    describe('GET /api/v1/products/search/:term', () => {
      it('should search products by term', () => {
        return request(server)
          .get('/api/v1/products/search/Pineapple')
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.products).toBeDefined();
            expect(res.body.message).toBe('Search results retrieved successfully');
          });
      });
    });
  });

  describe('Categories', () => {
    describe('GET /api/v1/categories', () => {
      it('should get categories list', () => {
        return request(server)
          .get('/api/v1/categories')
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Categories endpoint - Implement GetCategoriesUseCase');
          });
      });
    });
  });

  describe('Cart', () => {
    let authHeaders: any;
    let userTokens: any;

    beforeEach(async () => {
      // Create and authenticate user
      const registerResponse = await request(server)
        .post('/api/v1/auth/register')
        .send({
          email: 'cart@example.com',
          firstName: 'Cart',
          lastName: 'User',
          password: 'CartP@ssw0rd123!',
        });

      const loginResponse = await request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'cart@example.com',
          password: 'CartP@ssw0rd123!',
        });

      userTokens = loginResponse.body.data;
      authHeaders = {
        Authorization: `Bearer ${userTokens.accessToken}`,
      };
    });

    describe('GET /api/v1/cart', () => {
      it('should get user cart', () => {
        return request(server)
          .get('/api/v1/cart')
          .set(authHeaders)
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
          });
      });

      it('should return 401 for unauthenticated request', () => {
        return request(server)
          .get('/api/v1/cart')
          .expect(401)
          .expect((res) => {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Access token is required');
          });
      });
    });

    describe('POST /api/v1/cart/items', () => {
      it('should add item to cart', () => {
        return request(server)
          .post('/api/v1/cart/items')
          .set(authHeaders)
          .send({
            productId: 'wifi-pineapple-mark-vii',
            quantity: 1,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.message).toBeDefined();
          });
      });

      it('should return 401 for unauthenticated request', () => {
        return request(server)
          .post('/api/v1/cart/items')
          .send({
            productId: 'wifi-pineapple-mark-vii',
            quantity: 1,
          })
          .expect(401)
          .expect((res) => {
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Access token is required');
          });
      });
    });
  });

  describe('Health Check', () => {
    describe('GET /health', () => {
      it('should return health status', () => {
        return request(server)
          .get('/health')
          .expect(200)
          .expect((res) => {
            expect(res.body.status).toBe('OK');
            expect(res.body.timestamp).toBeDefined();
            expect(res.body.architecture).toBeDefined();
          });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', () => {
      return request(server)
        .get('/api/v1/non-existent-route')
        .expect(404)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toContain('Route not found');
        });
    });

    it('should handle malformed JSON', () => {
      return request(server)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400)
        .expect((res) => {
          expect(res.body.success).toBe(false);
        });
    });
  });
});
