# 🚀 Guía Completa de Instalación - Ecommerce Universitario

Guía paso a paso para levantar tu proyecto completo de ecommerce en entorno de desarrollo local.

---

## 📋 Prerrequisitos

### Software Requerido
- **Node.js** 18+ (recomendado 20 LTS)
- **PostgreSQL** 14+ (opcional si usas Railway)
- **Git**
- **IDE**: IntelliJ/WebStorm/VSCode/Windsurf

### Opciones de Base de Datos
1. **Opción A (Recomendada)**: PostgreSQL en Railway (nube)
2. **Opción B**: PostgreSQL local (requiere instalación)

---

## 🗄️ Configuración de Base de Datos

### Opción A: Railway (Recomendado para desarrollo)

1. **Crear cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Regístrate con GitHub/GitLab

2. **Crear nuevo proyecto**
   - Click en "New Project" → "Provision PostgreSQL"
   - Espera a que se cree la base de datos

3. **Obtener cadena de conexión**
   - En tu proyecto Railway, ve a la pestaña "PostgreSQL"
   - Copia la `DATABASE_URL` que se muestra

4. **Configurar variables de entorno adicionales**
   ```env
   DATABASE_URL="postgresql://user:pass@host:port/dbname?schema=public"
   JWT_SECRET="tu_super_secreto_jwt_min_32_caracteres"
   STRIPE_KEY="sk_test_tu_clave_stripe_prueba"
   STRIPE_WEBHOOK_SECRET="whsec_tu_webhook_secret"
   ```

### Opción B: PostgreSQL Local

1. **Instalar PostgreSQL**
   ```bash
   # Windows: Descargar desde postgresql.org
   # macOS: brew install postgresql
   # Linux: sudo apt-get install postgresql postgresql-contrib
   ```

2. **Crear base de datos**
   ```sql
   CREATE DATABASE ecommerce_dev;
   CREATE USER ecommerce_user WITH PASSWORD 'tu_password';
   GRANT ALL PRIVILEGES ON DATABASE ecommerce_dev TO ecommerce_user;
   ```

3. **Configurar .env**
   ```env
   DATABASE_URL="postgresql://ecommerce_user:tu_password@localhost:5432/ecommerce_dev?schema=public"
   JWT_SECRET="tu_super_secreto_jwt_min_32_caracteres"
   STRIPE_KEY="sk_test_tu_clave_stripe_prueba"
   ```

---

## 🔧 Backend Setup (NestJS + Prisma)

### 1. Instalar Dependencias
```bash
cd backend
npm install
```

### 2. Configurar Variables de Entorno
Crea el archivo `.env` en la raíz del backend:
```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/dbname?schema=public"

# JWT
JWT_SECRET="tu_super_secreto_jwt_min_32_caracteres"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Stripe (modo prueba)
STRIPE_KEY="sk_test_tu_clave_stripe_prueba"
STRIPE_WEBHOOK_SECRET="whsec_tu_webhook_secret"

# App
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### 3. Generar Cliente Prisma
```bash
npx prisma generate
```

### 4. Ejecutar Migraciones
```bash
npx prisma migrate dev --name init
```

### 5. Sembrar Datos Iniciales (Seed)
```bash
npx prisma db seed
# O si tienes un seed personalizado:
npm run prisma:seed
```

### 6. Levantar Servidor de Desarrollo
```bash
npm run start:dev
```

**✅ Verificación Backend**
- API: http://localhost:3001
- Documentación Swagger: http://localhost:3001/api/v1/docs
- Prisma Studio: `npx prisma studio` (para ver datos)

---

## 🎨 Frontend Setup (Next.js + TypeScript)

### 1. Instalar Dependencias
```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno
Crea el archivo `.env.local` en la raíz del frontend:
```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_stripe_prueba
```

### 3. Levantar Servidor de Desarrollo
```bash
npm run dev
```

**✅ Verificación Frontend**
- App: http://localhost:3000
- Si hay conflicto de puertos: `npm run dev -- -p 3001`

---

## 🧪 Testing del Sistema Completo

### 1. Verificar Conexión Backend-Frontend
1. Abre http://localhost:3000 en tu navegador
2. Intenta registrarte con un nuevo usuario
3. Verifica que no haya errores de CORS en la consola

### 2. Probar Funcionalidades Clave

#### Autenticación
```bash
# Registro de usuario
POST http://localhost:3001/api/v1/auth/register
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}

# Login
POST http://localhost:3001/api/v1/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Productos
```bash
# Listar productos
GET http://localhost:3001/api/v1/products

# Crear producto (necesitas token de admin)
POST http://localhost:3001/api/v1/products
Authorization: Bearer tu_token_jwt
```

### 3. Usuarios por Defecto (si ejecutaste seed)
| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@ecommerce.com | admin123 |
| Usuario | user@ecommerce.com | user123 |

---

## 🔍 Herramientas de Desarrollo

### Backend
```bash
# Ver logs en tiempo real
npm run start:dev

# Interactuar con la base de datos
npx prisma studio

# Ver documentación API
# Abre http://localhost:3001/api/v1/docs

# Tests
npm run test
npm run test:e2e
```

### Frontend
```bash
# Ver logs en tiempo real
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🚨 Problemas Comunes y Soluciones

### 1. Error: "Database connection failed"
**Solución**: Verifica tu `DATABASE_URL` en el archivo `.env` del backend

### 2. Error: "CORS policy blocked"
**Solución**: Asegúrate que `CORS_ORIGIN` en el backend incluya la URL del frontend

### 3. Error: "Port already in use"
**Solución**: Cambia el puerto en el frontend:
```bash
npm run dev -- -p 3001
```

### 4. Error: "Prisma Client not generated"
**Solución**: Ejecuta `npx prisma generate` en el backend

### 5. Error: "JWT secret not provided"
**Solución**: Asegúrate de configurar `JWT_SECRET` en el `.env` del backend

---

## 🌐 Flujo de Datos del Sistema

```
Frontend (Next.js:3000)
    ↓ HTTP Requests
Backend (NestJS:3001)
    ↓ Prisma Queries
PostgreSQL (Railway/Local)
```

### Arquitectura de Módulos
- **Auth**: Login, Register, JWT tokens
- **Users**: Gestión de usuarios y roles
- **Products**: Catálogo e inventario
- **Categories**: Jerarquía de categorías
- **Cart**: Carrito de compras
- **Orders**: Gestión de pedidos
- **Payments**: Integración con Stripe

---

## 📝 Scripts Útiles

### Backend
```bash
npm run start:dev      # Desarrollo con hot reload
npm run build          # Compilar para producción
npm run start:prod     # Ejecutar versión compilada
npm run prisma:migrate # Ejecutar migraciones
npm run prisma:studio  # UI de base de datos
npm run test           # Tests unitarios
```

### Frontend
```bash
npm run dev            # Desarrollo con hot reload
npm run build          # Compilar para producción
npm run start          # Ejecutar versión compilada
npm run lint           # Análisis de código
npm run type-check     # Verificación TypeScript
```

---

## 🎯 Checklist de Verificación

Antes de empezar a desarrollar, verifica:

- [ ] Backend corriendo en http://localhost:3001
- [ ] Frontend corriendo en http://localhost:3000
- [ ] Base de datos conectada (Prisma Studio funciona)
- [ ] Documentación Swagger accesible
- [ ] Registro/login funcionando
- [ ] No errores CORS en consola del navegador
- [ ] Variables de entorno configuradas correctamente

---

## 🚀 Siguientes Pasos

Una vez que todo esté funcionando:

1. **Explora la API** en Swagger para entender los endpoints
2. **Revisa el schema** de Prisma para entender la estructura de datos
3. **Personaliza el diseño** del frontend según tus necesidades
4. **Añade nuevas funcionalidades** siguiendo la arquitectura existente
5. **Configura tests** para asegurar calidad del código

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de la terminal donde ejecutaste los servidores
2. Verifica las variables de entorno
3. Consulta la documentación específica:
   - [Backend README](./backend/README.md)
   - [Frontend README](./frontend/README.md)
   - [Arquitectura](./ARQUITECTURA.md)

---
