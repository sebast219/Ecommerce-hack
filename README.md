# 🛍️ eCommerce Universitario - Plataforma FullStack

Plataforma de comercio electrónico completa construida con tecnologías modernas para el proyecto académico de la Universidad IUSH.

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + Zustand
- **Backend**: NestJS + TypeScript + Prisma ORM + PostgreSQL
- **Autenticación**: JWT con refresh tokens
- **Pagos**: Integración con Stripe (modo prueba)
- **Arquitectura**: Monolito modular con Clean Architecture

### Flujo de Datos
```
Frontend (Next.js) ↔ API REST (NestJS) ↔ PostgreSQL (Prisma)
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- Git

### Instalación Completa

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd ecommerce-hack
```

2. **Configurar Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configurar DATABASE_URL y JWT_SECRET en .env
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

3. **Configurar Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env.local
# Configurar NEXT_PUBLIC_API_URL en .env.local
npm run dev
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Documentación API: http://localhost:3001/api/v1/docs

## 📁 Estructura del Proyecto

```
ecommerce-hack/
├── frontend/          # Next.js App Router
│   ├── src/
│   │   ├── app/       # Rutas y layouts
│   │   ├── components/ # Componentes React
│   │   ├── hooks/     # Custom hooks
│   │   ├── store/     # Estado global (Zustand)
│   │   ├── lib/       # Utilidades y API client
│   │   └── types/     # Tipos TypeScript
│   └── README.md      # Guía específica del frontend
├── backend/           # NestJS API
│   ├── src/
│   │   ├── modules/   # Módulos funcionales
│   │   ├── common/    # Elementos compartidos
│   │   ├── config/    # Configuración
│   │   └── database/  # Configuración de DB
│   ├── prisma/        # Schema y migraciones
│   └── README.md      # Guía específica del backend
├── docs/              # Documentación adicional
└── README.md          # Este archivo
```

## 🔥 Características Principales

### Backend (NestJS)
- ✅ **Autenticación JWT** completa con refresh tokens
- ✅ **Gestión de usuarios** con roles (Admin, User, Vendor)
- ✅ **Catálogo de productos** con inventario
- ✅ **Sistema de categorías** jerárquico
- ✅ **Carrito de compras** persistente
- ✅ **Gestión de pedidos** y pagos
- ✅ **API documentada** con Swagger
- ✅ **Testing** unitario y de integración

### Frontend (Next.js)
- ✅ **Diseño responsive** con Tailwind CSS
- ✅ **Estado global** con Zustand
- ✅ **Formularios** con React Hook Form + Zod
- ✅ **Autenticación** de usuarios
- ✅ **Catálogo de productos** con filtros
- ✅ **Carrito de compras** funcional
- ✅ **Proceso de checkout** multi-paso
- ✅ **Panel administrativo** básico

## 🔐 Usuarios por Defecto

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@ecommerce.com | admin123 |
| Usuario | user@ecommerce.com | user123 |

## 📚 Documentación

### Guías Específicas
- [**Backend Documentation**](./backend/README.md) - Guía completa del API
- [**Frontend Documentation**](./frontend/README.md) - Guía de desarrollo frontend
- [**Arquitectura del Sistema**](./ARQUITECTURA.md) - Diseño técnico detallado
- [**Estructura del Proyecto**](./ESTRUCTURA_PROYECTO.md) - Organización completa

### Endpoints Principales

#### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/register` - Registrarse
- `POST /api/v1/auth/refresh` - Refrescar token
- `GET /api/v1/auth/profile` - Obtener perfil

#### Productos
- `GET /api/v1/products` - Listar productos
- `POST /api/v1/products` - Crear producto (admin)
- `GET /api/v1/products/:id` - Detalle de producto
- `PATCH /api/v1/products/:id` - Actualizar producto

#### Carrito
- `GET /api/v1/cart` - Obtener carrito
- `POST /api/v1/cart/items` - Agregar item
- `PATCH /api/v1/cart/items/:id` - Actualizar cantidad
- `DELETE /api/v1/cart/items/:id` - Eliminar item

## 🛠️ Scripts Disponibles

### Backend
```bash
npm run start:dev    # Modo desarrollo
npm run build        # Compilar para producción
npm run start:prod   # Iniciar producción
npm run test         # Ejecutar tests
npm run test:e2e     # Tests e2e
npm run prisma:studio # UI de base de datos
```

### Frontend
```bash
npm run dev          # Modo desarrollo
npm run build        # Compilar para producción
npm run start        # Iniciar producción
npm run lint         # Análisis de código
npm run type-check   # Verificación de tipos
```

## 🎯 Estado Actual del Proyecto

### Backend (80% completado)
- ✅ Autenticación y autorización
- ✅ CRUD de usuarios y productos
- ✅ Gestión de carrito y pedidos
- ✅ Schema de base de datos completo
- ✅ API documentada con Swagger
- ✅ Testing básico implementado

### Frontend (40% completado)
- ✅ Estructura base configurada
- ✅ Sistema de diseño con Tailwind
- ✅ Estado global con Zustand
- ✅ Componentes UI básicos
- 🔄 Páginas principales en desarrollo
- 🔄 Integración con backend en progreso

## 🚀 Despliegue

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy en Vercel con GitHub integration
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Deploy en Railway con GitHub integration
```

### Variables de Entorno de Producción
```env
# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_URL=https://your-frontend-url.com
```

## 🧪 Testing

### Backend
```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:cov

# Tests e2e
npm run test:e2e
```

### Frontend
```bash
# Tests unitarios (cuando se implementen)
npm run test

# Tests e2e (cuando se implementen)
npm run test:e2e
```

## 🤝 Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
3. Commits descriptivos con formato convencional
4. Pull request con descripción detallada

### Estándares de Código
- **TypeScript**: Modo estricto
- **ESLint**: Configuración de Next.js/NestJS
- **Prettier**: Formato automático
- **Commits**: Conventional Commits

## 👥 Equipo

- **Brahian Garcés** - Desarrollador FullStack
- **Sebastián Yepes** - Desarrollador FullStack

## 📄 Licencia

Proyecto académico - Universidad IUSH

---

## 🎯 Próximos Pasos

1. **Completar frontend** - Finalizar páginas principales
2. **Implementar testing** - Cobertura >80%
3. **Optimizar rendimiento** - Imágenes y bundle
4. **Deploy producción** - Configuración completa
5. **Mejoras UX/UI** - Animaciones y microinteracciones

## 📞 Soporte

Para dudas o soporte técnico:
- Revisar la documentación específica de cada módulo
- Consultar los issues en GitHub
- Contactar al equipo de desarrollo

---

**Nota**: Este es un proyecto académico en desarrollo activo. Para ver el progreso detallado y próximos pasos, consultar las guías específicas de cada módulo.
