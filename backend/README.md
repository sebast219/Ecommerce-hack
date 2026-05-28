# 🚀 Ecommerce Hak 6 Backend - NestJS API

Backend API RESTful especializado en herramientas de ciberseguridad con Clean Architecture, NestJS, Prisma y PostgreSQL.

## 🏗️ Arquitectura

### Stack Tecnológico
- **Framework**: NestJS 10 con TypeScript
- **Base de Datos**: PostgreSQL 14+ con Prisma ORM
- **Autenticación**: JWT con refresh tokens y Passport
- **Validación**: Class-validator + Class-transformer
- **Documentación**: Swagger/OpenAPI 3.0
- **Testing**: Jest con Supertest
- **Arquitectura**: Clean Architecture (Domain, Application, Infrastructure, Presentation)

### Estructura del Proyecto
```
src/
├── domain/           # Capa de Dominio (Clean Architecture)
│   ├── entities/      # Entidades puras del negocio
│   ├── repositories/  # Interfaces de repositorios
│   └── services/      # Servicios de dominio
├── application/       # Capa de Aplicación
│   ├── use-cases/     # Casos de uso del negocio
│   └── dto/          # Data Transfer Objects
├── infrastructure/    # Capa de Infraestructura
│   ├── database/      # Implementación de repositorios
│   └── external/      # Servicios externos (Stripe, Email)
├── presentation/      # Capa de Presentación
│   ├── controllers/   # Endpoints API
│   ├── guards/        # Guards de autenticación
│   ├── pipes/         # Pipes de validación
│   └── filters/       # Filtros de excepción
├── shared/           # Utilidades compartidas
├── config/           # Configuración de la aplicación
├── app.module.ts     # Módulo raíz
└── main.ts           # Punto de entrada
```

## � Inicio Rápido

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Instalación

1. **Clonar e instalar dependencias**
```bash
git clone <repository-url>
cd ecommerce-hack/backend
npm install
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales de base de datos
```

3. **Configurar base de datos**
```bash
# Generar Prisma client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Sembrar datos iniciales
npm run prisma:seed
```

4. **Iniciar aplicación**
```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

5. **Acceder a la documentación**
- API: http://localhost:3001
- Documentación Swagger: http://localhost:3001/api/v1/docs
- Prisma Studio: `npm run prisma:studio`

## 🔐 Autenticación

La API utiliza JWT con refresh tokens para autenticación.

### Headers requeridos
```
Authorization: Bearer <access_token>
```

### Flujo de autenticación
1. **Login**: Email/contraseña → Access + Refresh tokens
2. **Access Token**: 15 minutos de duración
3. **Refresh Token**: 7 días de duración
4. **Protected Routes**: Verificación automática de tokens

### Usuarios por defecto
| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@cybersec-store.com | admin123 |
| Usuario | hacker@pro.com | user123 |

## � Endpoints Principales

### Autenticación (`/api/v1/auth`)
- `POST /login` - Iniciar sesión
- `POST /register` - Registrar usuario
- `POST /refresh` - Refrescar token
- `GET /profile` - Obtener perfil del usuario
- `POST /logout` - Cerrar sesión

### Usuarios (`/api/v1/users`)
- `GET /` - Listar usuarios (Admin)
- `GET /:id` - Obtener usuario
- `PATCH /:id` - Actualizar usuario
- `DELETE /:id` - Eliminar usuario (Admin)

### Productos (`/api/v1/products`)
- `GET /` - Listar productos con filtros
- `POST /` - Crear producto (Admin/Vendor)
- `GET /:id` - Obtener producto
- `PATCH /:id` - Actualizar producto (Admin/Vendor)
- `DELETE /:id` - Eliminar producto (Admin)

### Categorías (`/api/v1/categories`)
- `GET /` - Listar categorías jerárquicas
- `POST /` - Crear categoría (Admin)
- `GET /:id` - Obtener categoría
- `PATCH /:id` - Actualizar categoría (Admin)
- `DELETE /:id` - Eliminar categoría (Admin)

### Carrito (`/api/v1/cart`)
- `GET /` - Obtener carrito del usuario
- `POST /items` - Agregar item al carrito
- `PATCH /items/:id` - Actualizar cantidad
- `DELETE /items/:id` - Eliminar item
- `DELETE /` - Vaciar carrito

### Pedidos (`/api/v1/orders`)
- `GET /` - Listar pedidos del usuario
- `POST /` - Crear orden desde carrito
- `GET /:id` - Obtener detalles de orden
- `PATCH /:id/status` - Actualizar estado (Admin)

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run start:dev      # Servidor con hot reload
npm run start:debug    # Modo debug
npm run start:prod     # Servidor producción

# Build
npm run build          # Compilar TypeScript
npm run build:prod     # Build optimizado para producción

# Testing
npm run test           # Ejecutar tests unitarios
npm run test:e2e       # Tests end-to-end
npm run test:cov       # Tests con cobertura
npm run test:watch     # Tests en modo watch

# Database (Prisma)
npm run prisma:generate    # Generar Prisma client
npm run prisma:migrate     # Ejecutar migraciones
npm run prisma:studio      # Abrir Prisma Studio
npm run prisma:seed        # Sembrar datos iniciales
npm run prisma:reset       # Resetear base de datos

# Calidad de código
npm run lint           # Análisis con ESLint
npm run format         # Formato con Prettier
```

## 🔧 Variables de Entorno

### .env.example
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Application
NODE_ENV="development"
PORT=3001
API_PREFIX="api/v1"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880  # 5MB

# Email (opcional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

## 🧪 Testing

### Estructura de Tests
```
test/
├── unit/              # Tests unitarios
│   ├── auth/
│   ├── products/
│   └── users/
├── integration/       # Tests de integración
│   ├── auth.e2e-spec.ts
│   └── products.e2e-spec.ts
└── e2e/              # Tests end-to-end
    └── app.e2e-spec.ts
```

### Ejecutar Tests
```bash
# Todos los tests
npm run test

# Tests específicos
npm run test -- --testPathPattern=auth

# Coverage
npm run test:cov

# Tests e2e
npm run test:e2e
```

### Ejemplo de Test Unitario
```typescript
// test/unit/auth/auth.service.spec.ts
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

  it('should validate user credentials', async () => {
    const result = await service.validateUser(
      'admin@ecommerce.com', 
      'admin123'
    );
    expect(result).toBeDefined();
    expect(result.email).toBe('admin@ecommerce.com');
  });
});
```

## 🐳 Docker (Opcional)

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: ecommerce_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/ecommerce_db
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Ejecutar con Docker
```bash
# Iniciar servicios
docker-compose up -d

# Ejecutar migraciones
docker-compose exec backend npm run prisma:migrate

# Sembrar datos
docker-compose exec backend npm run prisma:seed
```

## 📊 Monitorización y Logging

### Logging
La aplicación utiliza Winston para logging estructurado:
- **Niveles**: error, warn, info, debug
- **Formato**: JSON con timestamps
- **Salida**: Consola y archivos (producción)

### Health Check
```bash
# Endpoint de salud
GET http://localhost:3001/health

# Respuesta esperada
{
  "status": "ok",
  "timestamp": "2024-02-08T12:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

## 🚀 Despliegue

### Producción
1. **Variables de entorno**: Configurar todas las variables requeridas
2. **Base de datos**: Ejecutar migraciones en producción
3. **Build**: Compilar para producción
4. **Process Manager**: Usar PM2 o similar

### Ejemplo PM2
```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start dist/main.js --name ecommerce-api

# Monitorear
pm2 monit

# Logs
pm2 logs ecommerce-api
```

## 🔒 Seguridad

### Implementaciones
- **Password Hashing**: bcrypt con salt rounds 10
- **JWT**: Tokens firmados con algoritmo HS256
- **Rate Limiting**: 100 requests por minuto por IP
- **CORS**: Configurado para frontend específico
- **Input Validation**: DTOs con class-validator
- **SQL Injection Prevention**: Prisma ORM

### Best Practices
- Usar variables de entorno para datos sensibles
- Implementar HTTPS en producción
- Rotar claves JWT periódicamente
- Monitorear logs de seguridad
- Actualizar dependencias regularmente

## 🤝 Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
3. Commits descriptivos
4. Pull request con tests
5. Code review por el equipo

### Estándares
- **TypeScript**: Modo estricto
- **ESLint**: Configuración de NestJS
- **Prettier**: Formato automático
- **Commits**: Conventional Commits
- **Tests**: Cobertura mínima 80%

## 📚 Documentación Adicional

- [Documentación Principal](../README.md)
- [Guía de Desarrollo](../GUIA_DESARROLLO.md)
- [Arquitectura del Sistema](../ARQUITECTURA.md)
- [API Reference](./docs/API.md) - Próximamente

---

**Desarrollado con ❤️ para Ecommerce Hak 6**
