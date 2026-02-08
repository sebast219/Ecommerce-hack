# Setup Guide - eCommerce Cybersecurity Platform

## Overview

This guide will help you set up the complete eCommerce platform for cybersecurity components. The project consists of:

- **Backend**: NestJS monolito modular con Prisma ORM
- **Frontend**: Next.js 14 con React Query y Tailwind CSS
- **Database**: PostgreSQL

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn
- Git

## 1. Database Setup

### PostgreSQL Installation

**Windows:**
```bash
# Descargar e instalar PostgreSQL desde https://www.postgresql.org/download/windows/
# Durante instalación, recordar contraseña del usuario postgres
```

**Crear base de datos:**
```sql
-- Conectar a PostgreSQL con pgAdmin o psql
CREATE DATABASE ecommerce_cybersecurity;
```

## 2. Backend Setup

### Instalación de Dependencias

```bash
cd backend
npm install
```

### Configuración de Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

**Variables requeridas:**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_cybersecurity?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Stripe (opcional para desarrollo)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# App
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Migraciones y Seed

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Poblar base de datos con datos de prueba
npm run prisma:seed
```

### Iniciar Backend

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

**Backend estará disponible en:** http://localhost:3001
**Documentación API:** http://localhost:3001/api

## 3. Frontend Setup

### Instalación de Dependencias

```bash
cd frontend
npm install
```

### Configuración de Variables de Entorno

```bash
# Crear archivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

### Iniciar Frontend

```bash
# Modo desarrollo
npm run dev

# Construir para producción
npm run build
npm run start
```

**Frontend estará disponible en:** http://localhost:3000

## 4. Verificación del Setup

### 1. Verificar Backend

```bash
# Probar endpoint de health
curl http://localhost:3001

# Ver documentación Swagger
# Abrir http://localhost:3001/api en navegador
```

### 2. Verificar Frontend

```bash
# Abrir http://localhost:3000 en navegador
# Deberías ver la página principal con productos de ejemplo
```

### 3. Probar Autenticación

**Usuarios creados por seed:**
- **Admin**: admin@cybersecurity.com / admin123
- **User**: user@cybersecurity.com / user123

## 5. Flujo Completo de Prueba

### 1. Registro/Login
1. Ve a http://localhost:3000
2. Regístrate o usa credenciales existentes
3. Verifica que recibes tokens JWT

### 2. Explorar Productos
1. Navega a /products
2. Filtra por categoría
3. Ve detalles de productos

### 3. Proceso de Compra
1. Agrega productos al carrito
2. Crea una orden
3. Procesa pago (con Stripe de prueba)

### 4. Panel Admin
1. Login como admin@cybersecurity.com
2. Accede a /admin
3. Gestiona productos y órdenes

## 6. Troubleshooting Común

### Problemas de Base de Datos

```bash
# Resetear base de datos
npx prisma migrate reset

# Regenerar cliente
npx prisma generate

# Verificar conexión
npx prisma db pull
```

### Problemas de CORS

```bash
# Verificar FRONTEND_URL en .env del backend
# Debe coincidir con URL del frontend
```

### Problemas de Dependencias

```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install
```

### Problemas de TypeScript

```bash
# Verificar tipos
npm run type-check

# Rebuild
npm run build
```

## 7. Desarrollo Productivo

### Variables de Entorno de Producción

```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@prod-host:5432/db"
JWT_SECRET="production-secret-key"
STRIPE_SECRET_KEY="sk_live_..."
FRONTEND_URL="https://yourdomain.com"
```

### Deploy Sugerido

- **Backend**: Railway, Heroku, o VPS
- **Frontend**: Vercel, Netlify
- **Database**: Railway, Neon, o AWS RDS

## 8. Testing

### Backend Tests

```bash
# Unit tests
npm run test

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Frontend Tests

```bash
# Unit tests (cuando se implementen)
npm run test

# E2E tests (cuando se implementen)
npm run test:e2e
```

## 9. Monitoreo y Logs

### Backend Logs

```bash
# Ver logs en tiempo real
npm run start:dev

# Logs de producción
pm2 logs ecommerce-backend
```

### Database Monitoring

```bash
# Prisma Studio
npx prisma studio

# Consultas SQL
npx prisma db seed
```

## 10. Seguridad Consideraciones

1. **Cambiar secrets** en producción
2. **HTTPS** obligatorio
3. **Rate limiting** en endpoints
4. **Validación de inputs** 
5. **Sanitización de datos**
6. **CORS** configurado correctamente

## 11. Próximos Pasos

Una vez configurado:

1. **Personalizar diseño** y branding
2. **Añadir más productos** 
3. **Configurar Stripe** real
4. **Implementar testing** completo
5. **Setup CI/CD**
6. **Monitoreo** y analytics

---

## Soporte

Si encuentras problemas:

1. Revisa los logs del backend
2. Verifica conexión a base de datos
3. Confirma variables de entorno
4. Revisa documentación de NestJS/Next.js

**¡Listo para desarrollar!** 🚀
