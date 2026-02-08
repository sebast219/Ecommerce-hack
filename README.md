# eCommerce IUSH - Plataforma de Comercio Electrónico

## 📋 Descripción

Plataforma web de comercio electrónico con arquitectura monolítica modular basada en principios de Clean Architecture, desarrollada con Next.js, NestJS y PostgreSQL.

## 🏗️ Arquitectura

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript + Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT con refresh tokens
- **Pagos**: Stripe (modo prueba)

## 🚀 Tecnologías

### Frontend
- React 18
- Next.js 14 (App Router)
- TypeScript 5
- Tailwind CSS 3
- Zustand (estado global)
- React Hook Form + Zod
- Axios

### Backend
- Node.js 20
- NestJS 10
- TypeScript 5
- Prisma ORM
- PostgreSQL
- JWT + Passport
- Swagger/OpenAPI

## 📁 Estructura del Proyecto

```
ecommerce-hack/
├── frontend/          # Next.js App
├── backend/           # NestJS API
├── docs/              # Documentación
└── README.md
```

## 🛠️ Instalación

### Prerrequisitos
- Node.js 20+
- PostgreSQL
- Git

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd ecommerce-hack
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. **Configurar base de datos**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Iniciar backend**
```bash
npm run start:dev
```

6. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

7. **Configurar variables de entorno del frontend**
```bash
cp .env.example .env.local
# Editar .env.local
```

8. **Iniciar frontend**
```bash
npm run dev
```

## 📚 Documentación

- [Arquitectura](./ARQUITECTURA.md)
- [Diseño Arquitectónico](./DISENO_ARQUITECTONICO.md)
- [Estructura del Proyecto](./ESTRUCTURA_PROYECTO.md)
- [Plan de Acción](./PLAN_DE_ACCION.md)

## 🔗 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/refresh` - Refrescar token

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Detalle de producto
- `POST /api/products` - Crear producto (admin)

### Carrito
- `GET /api/cart` - Obtener carrito
- `POST /api/cart/items` - Agregar item
- `PUT /api/cart/items/:id` - Actualizar cantidad

## 🎯 Estado Actual del Proyecto

### Backend (80% completado)
- ✅ Autenticación JWT completa
- ✅ CRUD de usuarios y productos
- ✅ Gestión de carrito y pedidos
- ✅ Schema de base de datos completo
- ✅ API documentada con Swagger

### Frontend (30% completado)
- ✅ Estructura base configurada
- ✅ Dependencias instaladas
- ⏳ Componentes UI por implementar
- ⏳ Páginas y funcionalidades por desarrollar

## 🚀 Despliegue

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy en Vercel
```

### Backend (Railway)
```bash
cd backend
npm run build
# Deploy en Railway
```

## 👥 Equipo

- **Brahian Garcés**
- **Sebastián Yepes**

## 📄 Licencia

Proyecto académico - Universidad IUSH

---

**Nota**: Este proyecto está en desarrollo actual. Consulta el [Plan de Acción](./PLAN_DE_ACCION.md) para ver el progreso y próximos pasos.
