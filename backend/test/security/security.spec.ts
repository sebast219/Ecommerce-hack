// backend/test/security/security.spec.ts - NUEVO
import * as request from 'supertest';
import { TestSetup } from '../setup';
import { UserFactory } from '../factories/user.factory';

describe('Security Tests', () => {
  let userFactory: UserFactory;

  beforeAll(async () => {
    await TestSetup.initialize();
    userFactory = new UserFactory(TestSetup.prisma);
  });

  beforeEach(async () => {
    await TestSetup.cleanup();
  });

  afterAll(async () => {
    await TestSetup.teardown();
  });

  // XSS PREVENTION
  describe('XSS Prevention', () => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '"><img src=x onerror=alert(1)>',
      "'; DROP TABLE users; --",
      '{{constructor.constructor("return this")()}}',
      '<iframe src="javascript:alert(1)">',
    ];

    it.each(xssPayloads)('should sanitize XSS payload in name: %s', async (payload) => {
      const response = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'xss@test.com',
          firstName: payload,
          lastName: 'Test',
          password: 'StrongP@ssw0rd123!',
        });

      // Debe rechazar (validation) o sanitizar
      if (response.status === 201) {
        expect(response.body.data.user.firstName).not.toContain('<script>');
        expect(response.body.data.user.firstName).not.toContain('onerror');
      }
    });
  });

  // SQL INJECTION PREVENTION
  describe('SQL Injection Prevention', () => {
    const sqlPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "1'; DELETE FROM products WHERE '1'='1",
      "admin'--",
      "' UNION SELECT * FROM users --",
    ];

    it.each(sqlPayloads)('should prevent SQL injection in login: %s', async (payload) => {
      const response = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: payload,
          password: payload,
        });

      // Debe ser 400 (validation) o 401 (auth failed), nunca 500
      expect(response.status).toBeLessThan(500);
    });

    it.each(sqlPayloads)('should prevent SQL injection in product search: %s', async (payload) => {
      const response = await request(TestSetup.app.getHttpServer())
        .get(`/api/v1/products?search=${encodeURIComponent(payload)}`);

      expect(response.status).toBeLessThan(500);
    });
  });

  // IDOR (Insecure Direct Object Reference)
  describe('IDOR Prevention', () => {
    it('should not allow user to access other user profile', async () => {
      const user1 = await userFactory.createUser({ email: 'user1@test.com' });
      const user2 = await userFactory.createUser({ email: 'user2@test.com' });

      const login1 = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: user1.email, password: user1.password });

      const token1 = login1.body.data.accessToken;

      // Intentar acceder a datos de user2 con token de user1
      const response = await request(TestSetup.app.getHttpServer())
        .get(`/api/v1/users/${user2.id}`)
        .set('Authorization', `Bearer ${token1}`);

      // Debe ser 403 o 404, nunca 200 con datos de otro usuario
      expect([403, 404]).toContain(response.status);
    });

    it('should not allow user to access other user orders', async () => {
      const user1 = await userFactory.createUser({ email: 'user1@test.com' });
      const user2 = await userFactory.createUser({ email: 'user2@test.com' });

      const login1 = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: user1.email, password: user1.password });

      const token1 = login1.body.data.accessToken;

      const response = await request(TestSetup.app.getHttpServer())
        .get(`/api/v1/orders?userId=${user2.id}`)
        .set('Authorization', `Bearer ${token1}`);

      if (response.status === 200) {
        // Si devuelve 200, no debe tener órdenes de otro usuario
        expect(response.body.data).toHaveLength(0);
      }
    });
  });

  // MASS ASSIGNMENT
  describe('Mass Assignment Prevention', () => {
    it('should not allow role escalation via registration', async () => {
      const response = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'attacker@evil.com',
          firstName: 'Evil',
          lastName: 'Attacker',
          password: 'StrongP@ssw0rd123!',
          role: 'ADMIN',
        });

      // forbidNonWhitelisted debe rechazar
      if (response.status === 400) {
        expect(response.body.message).toBeDefined();
      } else if (response.status === 201) {
        // Si pasa, verificar que NO es admin
        const dbUser = await TestSetup.prisma.user.findUnique({
          where: { email: 'attacker@evil.com' },
        });
        expect(dbUser?.role).toBe('USER');
      }
    });

    it('should not allow isActive manipulation via registration', async () => {
      const response = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'attacker2@evil.com',
          firstName: 'Evil',
          lastName: 'Attacker',
          password: 'StrongP@ssw0rd123!',
          isActive: false,
          isAdmin: true,
          superUser: true,
        });

      // Debe rechazar por campos no permitidos
      expect(response.status).toBe(400);
    });
  });

  // SECURITY HEADERS
  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      // Helmet headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-xss-protection']).toBeDefined();
    });

    it('should include X-Request-ID', async () => {
      const response = await request(TestSetup.app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      expect(response.headers['x-request-id']).toBeDefined();
    });
  });

  // RATE LIMITING
  describe('Rate Limiting', () => {
    it('should block after too many failed login attempts', async () => {
      const email = 'victim@example.com';
      await userFactory.createUser({ email, password: 'StrongP@ssw0rd123!' });

      // Realizar múltiples intentos fallidos
      for (let i = 0; i < 6; i++) {
        await request(TestSetup.app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({ email, password: 'WrongPassword123!' });
      }

      // El siguiente intento debería estar bloqueado
      const response = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email, password: 'WrongPassword123!' });

      expect(response.status).toBe(429);
      expect(response.body.retryAfter).toBeDefined();
    });
  });
});
