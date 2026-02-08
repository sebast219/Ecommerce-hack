# Ecommerce Backend - NestJS

Backend API para el eCommerce Universitario construido con NestJS, Prisma y PostgreSQL.

## 🚀 Características

- **Autenticación JWT** con refresh tokens
- **Gestión de usuarios** con roles (Admin, User, Vendor)
- **Catálogo de productos** con inventario
- **Sistema de categorías** jerárquico
- **Validación de datos** con class-validator
- **Documentación API** con Swagger
- **Rate limiting** para seguridad
- **TypeScript** para type safety

## 📋 Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

## 🛠️ Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Configurar la base de datos PostgreSQL en `.env`

5. Generar Prisma client:
```bash
npm run prisma:generate
```

6. Ejecutar migraciones:
```bash
npm run prisma:migrate
```

7. Sembrar la base de datos:
```bash
npm run prisma:seed
```

## 🏃‍♂️ Ejecutar la aplicación

### Modo desarrollo
```bash
npm run start:dev
```

### Modo producción
```bash
npm run build
npm run start:prod
```

## 📚 Documentación API

Una vez iniciada la aplicación, la documentación estará disponible en:
```
http://localhost:3001/api/v1/docs
```

## 🗂️ Estructura del Proyecto

```
src/
├── common/          # Elementos compartidos
│   ├── decorators/  # Decoradores personalizados
│   ├── guards/      # Guards de autenticación
│   ├── filters/     # Filtros de excepción
│   └── pipes/       # Pipes de validación
├── config/          # Configuración
├── database/        # Configuración de DB
├── modules/         # Módulos funcionales
│   ├── auth/        # Autenticación
│   ├── users/       # Usuarios
│   ├── products/    # Productos
│   └── categories/  # Categorías
├── utils/           # Utilidades
├── app.module.ts    # Módulo raíz
└── main.ts          # Punto de entrada
```

## 🔐 Autenticación

La API utiliza JWT para autenticación. Los endpoints protegidos requieren un token Bearer en el header:

```
Authorization: Bearer <token>
```

### Usuarios por defecto

- **Admin**: `admin@ecommerce.com` / `admin123`
- **User**: `user@ecommerce.com` / `user123`

## 📝 Scripts disponibles

- `npm run start` - Inicia en modo producción
- `npm run start:dev` - Inicia en modo desarrollo con hot reload
- `npm run start:debug` - Inicia en modo debug
- `npm run build` - Compila la aplicación
- `npm run test` - Ejecuta tests unitarios
- `npm run test:e2e` - Ejecuta tests e2e
- `npm run test:cov` - Ejecuta tests con cobertura
- `npm run lint` - Ejecuta ESLint
- `npm run format` - Formatea el código con Prettier
- `npm run prisma:generate` - Genera Prisma client
- `npm run prisma:migrate` - Ejecuta migraciones
- `npm run prisma:seed` - Sembrar datos iniciales
- `npm run prisma:studio` - Abre Prisma Studio

## 🐳 Docker (Opcional)

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d postgres

# Ejecutar migraciones
npm run prisma:migrate

# Sembrar datos
npm run prisma:seed
```

## 🔧 Variables de Entorno

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# Application
NODE_ENV="development"
PORT=3001
API_PREFIX="api/v1"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

## 📊 Endpoints Principales

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/register` - Registrarse
- `POST /api/v1/auth/refresh` - Refrescar token
- `GET /api/v1/auth/profile` - Obtener perfil

### Usuarios
- `GET /api/v1/users` - Listar usuarios (Admin)
- `GET /api/v1/users/:id` - Obtener usuario
- `PATCH /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario (Admin)

### Productos
- `GET /api/v1/products` - Listar productos
- `POST /api/v1/products` - Crear producto
- `GET /api/v1/products/:id` - Obtener producto
- `PATCH /api/v1/products/:id` - Actualizar producto
- `DELETE /api/v1/products/:id` - Eliminar producto

### Categorías
- `GET /api/v1/categories` - Listar categorías
- `POST /api/v1/categories` - Crear categoría
- `GET /api/v1/categories/:id` - Obtener categoría
- `PATCH /api/v1/categories/:id` - Actualizar categoría
- `DELETE /api/v1/categories/:id` - Eliminar categoría

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:cov

# Ejecutar tests e2e
npm run test:e2e
```

## 🎯 Resumen de Archivos de Configuración

| Archivo | Propósito | ¿Esencial? |
|---------|-----------|-------------|
| **.eslintrc.js** | Calidad de código | ✅ Sí |
| **.prettierrc** | Formato automático | ✅ Sí |
| **.gitignore** | Control de versiones | ✅ Sí |
| **nest-cli.json** | CLI NestJS | ✅ Sí |
| **tsconfig.json** | Compilador TypeScript | ✅ Sí |
| **package.json** | Dependencias y scripts | ✅ Sí |
| **package-lock.json** | Versiones exactas | ✅ Sí |
| **.env.example** | Variables de entorno | ✅ Sí |

### 🔧 ¿Cómo Funcionan Juntos?
- **Desarrollo**: `tsconfig.json` + `nest-cli.json` compilan el código
- **Calidad**: `eslint` + `prettier` mantienen estándares
- **Dependencias**: `package.json` + `package-lock.json` gestionan librerías
- **Producción**: `dist/` contiene el código compilado
- **Configuración**: `.env.example` guía las variables de entorno
- **Control**: `.gitignore` protege archivos sensibles

## 📚 Documentación

- **[API Reference](./API_REFERENCE.md)** - Documentación completa de endpoints
- **[Development Guide](./DEVELOPMENT.md)** - Guía de aprendizaje e implementación
- **Swagger UI**: http://localhost:3001/api/v1/docs (cuando el servidor está activo)
