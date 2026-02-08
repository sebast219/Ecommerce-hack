# 📅 PLAN DE APRENDIZAJE SEMANAL DETALLADO

## 🎯 OBJETIVO GENERAL
Convertirte en desarrollador FullStack experto a través de un proyecto eCommerce enterprise-grade en 12 semanas.

---

## 📅 SEMANA 1: FUNDAMENTOS BACKEND

### 📚 Día 1-2: Setup y Configuración
#### 🎯 Objetivos del Día
- [ ] **Configurar entorno de desarrollo**
  - Instalar PostgreSQL local
  - Crear base de datos `ecommerce_db`
  - Configurar variables de entorno (.env)
  - **Tiempo estimado:** 3 horas

- [ ] **Inicializar proyecto NestJS**
  - `npx @nestjs/cli new ecommerce-backend`
  - Configurar TypeScript estricto
  - Estructura de carpetas profesional
  - **Tiempo estimado:** 2 horas

#### 📋 Tareas Específicas
```bash
# 1. Instalar PostgreSQL
brew install postgresql  # macOS
# o usar Docker para cross-platform

# 2. Crear base de datos
createdb ecommerce_db

# 3. Inicializar NestJS
npx @nestjs/cli new ecommerce-backend --package-manager npm
cd ecommerce-backend

# 4. Instalar dependencias iniciales
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install @prisma/client prisma bcryptjs
npm install class-validator class-transformer
```

#### 💡 Conceptos Clave
- **Database Connection Strings:** `postgresql://user:password@localhost:5432/db`
- **TypeScript Estricto:** `strict: true` en tsconfig.json
- **NestJS Modules:** Arquitectura modular y dependency injection

#### ✅ Criterios de Éxito
- [ ] PostgreSQL corriendo y accesible
- [ ] Proyecto NestJS inicializado sin errores
- [ ] Estructura de carpetas creada
- [ ] Dependencias instaladas

### 📚 Día 3-4: Prisma ORM
#### 🎯 Objetivos del Día
- [ ] **Configurar Prisma**
  - `npm install prisma @prisma/client`
  - `npx prisma init`
  - Configurar database URL
  - **Tiempo estimado:** 2 horas

- [ ] **Diseñar Schema inicial**
  - User, Product, Category básicos
  - Relaciones principales
  - Validaciones a nivel de schema
  - **Tiempo estimado:** 4 horas

#### 📋 Tareas Específicas
```prisma
// schema.prisma - Esqueleto inicial
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password   String
  firstName String
  lastName  String
  role       UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          String    @id @default(cuid())
  name        String
  description String?
  price       Float
  sku         String    @unique
  slug        String    @unique
  images      String[]
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  inventory   ProductInventory?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### 💡 Conceptos Clave
- **Schema-First Development:** Define data structure first
- **Relations:** One-to-many, many-to-many relationships
- **CUID:** Unique identifiers por Prisma
- **Migrations:** Version control para base de datos

#### ✅ Criterios de Éxito
- [ ] Prisma configurado correctamente
- [ ] Schema básico diseñado
- [ ] Relaciones definidas
- [ ] Primera migración ejecutada

### 📚 Día 5-7: Migraciones y Seed
#### 🎯 Objetivos del Día
- [ ] **Crear y ejecutar migraciones**
  - `npx prisma migrate dev --name init`
  - Entender migration files
  - Probar rollback
  - **Tiempo estimado:** 3 horas

- [ ] **Seed data inicial**
  - Categorías de ejemplo
  - 10-20 productos de prueba
  - Usuarios de desarrollo
  - **Tiempo estimado:** 4 horas

#### 📋 Tareas Específicas
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const electronics = await prisma.category.create({
    data: { name: 'Electrónicos', slug: 'electronicos' }
  });

  // Seed products
  await prisma.product.create({
    data: {
      name: 'Laptop Gaming',
      description: 'Laptop de alto rendimiento',
      price: 999.99,
      sku: 'LAPTOP-001',
      slug: 'laptop-gaming',
      images: ['/images/laptop1.jpg'],
      categoryId: electronics.id,
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

#### 💡 Conceptos Clave
- **Migrations:** Control de versiones para schema
- **Seed Data:** Datos iniciales para desarrollo
- **Environment Isolation:** Diferentes datos por entorno
- **Idempotent Operations:** Seeds que pueden ejecutarse múltiples veces

#### ✅ Criterios de Éxito
- [ ] Primera migración exitosa
- [ ] Seed data creada
- [ ] Verificación de datos en DB
- [ ] Script de seed en package.json

---

## 📅 SEMANA 2: AUTENTICACIÓN COMPLETA

### 📚 Día 1-3: JWT Authentication
#### 🎯 Objetivos del Día
- [ ] **Implementar Auth Service completo**
  - `validateUser()`, `login()`, `register()`
  - Hashing con bcrypt (salt rounds: 10)
  - JWT token generation con expiración
  - **Tiempo estimado:** 6 horas

- [ ] **JWT Strategy con Passport**
  - Passport JWT strategy configuration
  - Token validation middleware
  - Refresh token mechanism
  - **Tiempo estimado:** 4 horas

#### 📋 Tareas Específicas
```typescript
// src/modules/auth/auth.service.ts - Métodos clave
async validateUser(email: string, password: string): Promise<any> {
  const user = await this.prisma.user.findUnique({ where: { email } });
  
  if (user && await bcrypt.compare(password, user.password)) {
    const { password, ...result } = user;
    return result;
  }
  return null;
}

async login(loginDto: LoginDto) {
  const user = await this.validateUser(loginDto.email, loginDto.password);
  
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = { 
    email: user.email, 
    sub: user.id,
    role: user.role 
  };

  const accessToken = this.jwtService.sign(payload);
  const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: { /* user data sin password */ }
  };
}
```

#### 💡 Conceptos Clave
- **Password Hashing:** bcrypt con salt rounds
- **JWT Payload:** Datos codificados en token
- **Access vs Refresh Token:** Corta duración vs larga duración
- **Token Validation:** Middleware para verificar tokens

#### ✅ Criterios de Éxito
- [ ] Login funcional con credenciales correctas
- [ ] Registro de nuevos usuarios
- [ ] Hashing de contraseñas implementado
- [ ] JWT tokens generados correctamente

### 📚 Día 4-5: Guards y Decorators
#### 🎯 Objetivos del Día
- [ ] **Crear Guards de autenticación**
  - JwtAuthGuard para rutas protegidas
  - RolesGuard para autorización por rol
  - Public decorator para rutas públicas
  - **Tiempo estimado:** 4 horas

- [ ] **Implementar Auth Controller**
  - Endpoints RESTful: /login, /register, /refresh
  - DTOs de validación con class-validator
  - Error handling centralizado
  - **Tiempo estimado:** 4 horas

#### 📋 Tareas Específicas
```typescript
// src/common/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedException();
    }
    
    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

// src/common/decorators/roles.decorator.ts
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
```

#### 💡 Conceptos Clave
- **Guards:** Middleware para protección de rutas
- **Decorators:** Metadata para configuración
- **Dependency Injection:** Inyección de dependencias
- **Metadata Reflection:** Acceso a metadata en runtime

#### ✅ Criterios de Éxito
- [ ] Guards funcionando correctamente
- [ ] Rutas protegidas denegando acceso no autorizado
- [ ] Auth controller con todos los endpoints
- [ ] Validación de DTOs funcionando

### 📚 Día 6-7: Testing Auth
#### 🎯 Objetivos del Día
- [ ] **Unit Tests para Auth Service**
  - Jest configuration
  - Mock de PrismaService
  - Test de login/register con diferentes casos
  - **Tiempo estimado:** 4 horas

- [ ] **Integration Tests para Auth**
  - Supertest para endpoints HTTP
  - Test de guards y decorators
  - Coverage >80%
  - **Tiempo estimado:** 4 horas

#### 📋 Tareas Específicas
```typescript
// test/auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      // Mock user in database
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      
      const result = await service.login(validLoginDto);
      
      expect(result.access_token).toBeDefined();
      expect(result.user.email).toBe(validLoginDto.email);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      
      await expect(service.login(invalidLoginDto))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
```

#### 💡 Conceptos Clave
- **Unit Testing:** Aislamiento de dependencias
- **Mocking:** Simulación de dependencias externas
- **Integration Testing:** Testing de componentes juntos
- **Coverage:** Métrica de código testeado

#### ✅ Criterios de Éxito
- [ ] Tests unitarios pasando
- [ ] Tests de integración funcionando
- [ ] Coverage >80%
- [ ] CI/CD configurado para tests

---

## 📅 SEMANA 3: PRODUCT MANAGEMENT

### 📚 Día 1-3: Products CRUD
#### 🎯 Objetivos del Día
- [ ] **Implementar Products Service completo**
  - CRUD operations: create, findAll, findOne, update, remove
  - Validaciones de negocio (SKU único, precio >0)
  - Error handling específico
  - **Tiempo estimado:** 8 horas

- [ ] **Filtros y búsqueda avanzada**
  - Búsqueda por texto (name, description, sku)
  - Filtros por categoría, rango de precios
  - Paginación y ordenamiento
  - **Tiempo estimado:** 4 horas

#### 📋 Tareas Específicas
```typescript
// src/modules/products/products.service.ts - Métodos clave
async findAll(filterDto: FilterProductDto) {
  const { page = 1, limit = 10, search, categoryId, minPrice, maxPrice } = filterDto;
  const skip = (page - 1) * limit;

  const where: any = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }

  const [products, total] = await Promise.all([
    this.prisma.product.findMany({ where, skip, take: limit }),
    this.prisma.product.count({ where })
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}
```

#### 💡 Conceptos Clave
- **Dynamic Queries:** Construcción de queries basadas en filtros
- **Pagination:** Skip/take pattern para paginación
- **Text Search:** Búsqueda case-insensitive
- **Price Filtering:** Rangos numéricos con gte/lte

#### ✅ Criterios de Éxito
- [ ] CRUD completo funcionando
- [ ] Búsqueda por texto funcionando
- [ ] Filtros de precio y categoría
- [ ] Paginación implementada

### 📚 Día 4-5: Inventory Management
#### 🎯 Objetivos del Día
- [ ] **Sistema de inventario completo**
  - Stock tracking con ProductInventory
  - Low stock alerts (quantity < lowStock)
  - Inventory transactions (add/remove)
  - **Tiempo estimado:** 6 horas

- [ ] **Transacciones atómicas**
  - Database transactions con Prisma
  - Concurrent access handling
  - Rollback on errors
  - **Tiempo estimado:** 4 horas

#### 📋 Tareas Específicas
```typescript
// Inventory management con transacciones
async decreaseInventory(productId: string, quantity: number) {
  return await this.prisma.$transaction(async (tx) => {
    const inventory = await tx.productInventory.findUnique({
      where: { productId }
    });

    if (!inventory || inventory.quantity < quantity) {
      throw new ConflictException('Insufficient inventory');
    }

    const updatedInventory = await tx.productInventory.update({
      where: { productId },
      data: { 
        quantity: inventory.quantity - quantity,
        lastUpdated: new Date()
      }
    });

    // Create inventory transaction record
    await tx.inventoryTransaction.create({
      data: {
        productId,
        type: 'DECREASE',
        quantity,
        previousQuantity: inventory.quantity,
        newQuantity: updatedInventory.quantity
      }
    });

    return updatedInventory;
  });
}
```

#### 💡 Conceptos Clave
- **Database Transactions:** Atomicidad y consistencia
- **Concurrency Control:** Manejo de acceso concurrente
- **Inventory Tracking:** Registro de cambios
- **Business Logic:** Validaciones a nivel de servicio

#### ✅ Criterios de Éxito
- [ ] Inventory tracking funcional
- [ ] Transacciones atómicas implementadas
- [ ] Low stock alerts funcionando
- [ ] Concurrent access handling

### 📚 Día 6-7: Products Controller y Testing
#### 🎯 Objetivos del Día
- [ ] **Products Controller completo**
  - Endpoints RESTful con decoradores Swagger
  - File upload para imágenes
  - Response formatting consistente
  - **Tiempo estimado:** 4 horas

- [ ] **Testing completo de Products**
  - Unit tests para service layer
  - Integration tests para controller
  - Edge cases y error scenarios
  - **Tiempo estimado:** 4 horas

#### 📋 Tareas Específicas
```typescript
// src/modules/products/products.controller.ts
@Controller('products')
@ApiTags('Products')
export class ProductsController {
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, description: 'Product created' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get products with filters' })
  async findAll(@Query() filterDto: FilterProductDto) {
    return this.productsService.findAll(filterDto);
  }
}
```

#### 💡 Conceptos Clave
- **RESTful Design:** Convenciones HTTP
- **File Upload:** Multer integration
- **API Documentation:** Swagger decorators
- **Error Handling:** HTTP status codes apropiados

#### ✅ Criterios de Éxito
- [ ] Controller con todos los endpoints
- [ ] File upload funcionando
- [ ] Documentación Swagger generada
- [ ] Tests con coverage >80%

---

## 🎯 MÉTRICAS DE PROGRESO

### 📊 Semanales
- **Semana 1:** 100% - Setup y configuración
- **Semana 2:** 100% - Autenticación completa
- **Semana 3:** 100% - Product management
- **Semana 4:** 100% - Categories y testing

### 📈 Habilidades Desarrolladas
- **Backend:** NestJS, Prisma, PostgreSQL, JWT
- **Testing:** Jest, Supertest, Mocking
- **API Design:** RESTful, Documentation
- **Database:** Migrations, Relations, Transactions

### 🏆 Proyectos Intermedios
- **Mini-Proyecto 1 (Semana 4):** Product Catalog API
- **Mini-Proyecto 2 (Semana 8):** Shopping Cart System
- **Proyecto Final (Semana 12):** Ecommerce Complete

---

## 🚀 RECURSOS ADICIONALES

### 📚 Material de Estudio
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### 🛠️ Herramientas Recomendadas
- **IDE:** VS Code + Prisma + NestJS extensions
- **Database:** pgAdmin o DBeaver para PostgreSQL
- **API Testing:** Postman o Insomnia
- **Version Control:** Git + GitHub Desktop

### 🎥 Cursos Complementarios
- [NestJS Zero to Hero](https://www.udemy.com/course/nestjs-zero-to-hero/)
- [Database Design Fundamentals](https://www.coursera.org/learn/database-design)
- [API Design Best Practices](https://www.udemy.com/course/rest-api-design-best-practices/)

---

## ✅ CHECKLIST SEMANAL

### 📋 Para Completar Cada Semana
- [ ] **Code Review:** Revisar código con linter
- [ ] **Testing:** Ejecutar suite de tests
- [ ] **Documentation:** Actualizar README y comentarios
- [ ] **Git Commit:** Commits descriptivos y frecuentes
- [ ] **Reflection:** Escribir aprendizajes de la semana

### 🎯 Metas de Aprendizaje
- [ ] **Conceptos Entendidos:** Lista de conceptos nuevos
- [ ] **Problemas Resueltos:** Desafíos técnicos superados
- [ ] **Habilidades Practicadas:** Tecnologías utilizadas
- [ ] **Mejoras Identificadas:** Áreas de oportunidad

**¡Sigue este plan consistentemente y serás un desarrollador FullStack experto en 12 semanas!** 🚀
