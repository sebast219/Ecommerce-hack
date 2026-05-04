// backend/test/integration/auth.integration.spec.ts - NUEVO
import * as request from 'supertest';
import { TestSetup } from '../setup';
import { UserFactory } from '../factories/user.factory';

describe('Authentication Integration Tests', () => {
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

  // REGISTRO
  describe('POST /api/v1/auth/register', () => {
    const validUser = {
      email: 'newuser@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'StrongP@ssw0rd123!',
    };

    it('should register user and return tokens (201)', async () => {
      const response = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(validUser);

      console.log('Response status:', response.status);
      console.log('Response body:', JSON.stringify(response.body, null, 2));
      console.log('Response headers:', response.headers);

      expect(response.status).toBe(201);
      
      // Verificar la estructura del response
      if (response.body.success === false) {
        console.log('Registration failed with message:', response.body.message);
        throw new Error(`Registration failed: ${response.body.message}`);
      }
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(validUser.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();

      // Verificar que NO devuelve password
      expect(response.body.data.user.password).toBeUndefined();

      // Verificar en DB
      const dbUser = await TestSetup.prisma.user.findUnique({
        where: { email: validUser.email },
      });
      expect(dbUser).toBeTruthy();
      expect(dbUser.password).not.toBe(validUser.password);
      expect(dbUser.role).toBe('USER'); // Siempre USER
    });

    it('should reject duplicate email (409)', async () => {
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(validUser)
        .expect(201);

      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(validUser)
        .expect(409);
    });

    // MASS ASSIGNMENT TEST
    it('should IGNORE role field in registration', async () => {
      const response = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ ...validUser, role: 'ADMIN' })
        .expect(400); // forbidNonWhitelisted rechaza campos extra

      // Si por alguna razón pasa, verificar que no sea ADMIN
      if (response.status === 201) {
        const dbUser = await TestSetup.prisma.user.findUnique({
          where: { email: validUser.email },
        });
        expect(dbUser.role).toBe('USER');
      }
    });

    it('should reject extra unknown fields (400)', async () => {
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ ...validUser, isAdmin: true, superUser: true })
        .expect(400);
    });

    it('should reject weak password (400)', async () => {
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ ...validUser, password: '12345' })
        .expect(400);
    });

    it('should reject invalid email format (400)', async () => {
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ ...validUser, email: 'not-an-email' })
        .expect(400);
    });

    it('should trim and lowercase email', async () => {
      const response = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ ...validUser, email: '  John@EXAMPLE.com  ' })
        .expect(201);

      expect(response.body.data.user.email).toBe('john@example.com');
    });

    it('should reject missing required fields (400)', async () => {
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'test@example.com' }) // sin password, firstName, lastName
        .expect(400);
    });
  });

  // LOGIN
  describe('POST /api/v1/auth/login', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await userFactory.createUser({
        email: 'login@example.com',
        password: 'StrongP@ssw0rd123!',
      });
    });

    it('should login with valid credentials (200)', async () => {
      const response = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should reject wrong password (401)', async () => {
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongP@ssw0rd123!',
        })
        .expect(401);
    });

    it('should reject non-existent email (401)', async () => {
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'StrongP@ssw0rd123!',
        })
        .expect(401);
    });

    it('should be case-insensitive for email', async () => {
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email.toUpperCase(),
          password: testUser.password,
        })
        .expect(200);
    });
  });

  // REFRESH TOKEN
  describe('POST /api/v1/auth/refresh', () => {
    it('should rotate refresh token successfully', async () => {
      const testUser = await userFactory.createUser();

      // Login para obtener tokens
      const loginRes = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      const { refreshToken } = loginRes.body.data;

      // Usar refresh token
      const refreshRes = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(refreshRes.body.data.accessToken).toBeDefined();
      expect(refreshRes.body.data.refreshToken).toBeDefined();
      // Nuevo refresh token debe ser diferente
      expect(refreshRes.body.data.refreshToken).not.toBe(refreshToken);
    });

    it('should reject reused (old) refresh token - REUSE DETECTION', async () => {
      const testUser = await userFactory.createUser();

      const loginRes = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      const oldRefreshToken = loginRes.body.data.refreshToken;

      // Primera rotación - éxito
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: oldRefreshToken })
        .expect(200);

      // Intentar reusar el token viejo - DEBE FALLAR
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: oldRefreshToken })
        .expect(401);
    });

    it('should reject invalid refresh token (401)', async () => {
      await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'completely-invalid-token' })
        .expect(401);
    });
  });

  // PROTECTED ENDPOINTS
  describe('Protected Endpoints', () => {
    it('should reject requests without token (401)', async () => {
      await request(TestSetup.app.getHttpServer())
        .get('/api/v1/users/me')
        .expect(401);
    });

    it('should reject requests with expired token (401)', async () => {
      // Token con expiración en el pasado
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxfQ.invalid';
      
      await request(TestSetup.app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });

    it('should reject requests with tampered token (401)', async () => {
      const testUser = await userFactory.createUser();
      const loginRes = await request(TestSetup.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      const tamperedToken = loginRes.body.data.accessToken + 'tampered';

      await request(TestSetup.app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${tamperedToken}`)
        .expect(401);
    });
  });
});
