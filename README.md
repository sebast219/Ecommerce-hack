# eCommerce de Componentes de Ciberseguridad

Proyecto académico universitario de 4 meses para un sistema de eCommerce especializado en componentes de ciberseguridad, inspirado en tiendas como Hak5.

## Arquitectura

**Monolito Modular** basado en Clean Architecture:
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS + Shadcn/UI
- **Backend**: NestJS + TypeScript + Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT con refresh tokens
- **Pagos**: Stripe integration
- **Despliegue**: Frontend en Vercel, Backend en Railway/Neon

## Estructura del Proyecto

```
Ecommerce hak6/
├── frontend/          # Next.js App Router
├── backend/           # NestJS monolito modular
├── docs/              # Documentación técnica
└── README.md
```

## Características Principales

- 🛒 Catálogo de productos de ciberseguridad (USB Rubber Ducky, WiFi Pineapple, etc.)
- 🔐 Autenticación segura con JWT y roles (user/admin)
- 📦 Gestión de carrito y órdenes
- 💳 Integración con Stripe para pagos
- 📊 Dashboard administrativo
- 📱 UI responsive y moderna
- 🧪 Testing integrado
- 📚 Documentación completa

## Tecnologías Obligatorias

- **React con Next.js**: Framework frontend moderno
- **NestJS**: Backend con arquitectura modular
- **Prisma**: ORM type-safe
- **PostgreSQL**: Base de datos relacional
- **TypeScript**: Type safety en todo el stack

## Quick Start

```bash
# Clonar repositorio
git clone <repository-url>
cd Ecommerce-hak6

# Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# Configurar variables de entorno
# Backend: DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY
# Frontend: NEXT_PUBLIC_API_URL

# Ejecutar migraciones de base de datos
cd backend && npx prisma migrate dev

# Iniciar desarrollo
npm run dev:backend    # Backend en http://localhost:3001
npm run dev:frontend   # Frontend en http://localhost:3000
```

## Documentación Académica

Este proyecto está diseñado para ser defendible ante un jurado universitario:

- **Justificación de Arquitectura**: Monolito modular vs microservicios
- **Clean Architecture**: Separación de responsabilidades
- **Testing**: Unitarios, integración y E2E
- **Documentación**: Diagramas, flujos y guías técnicas
- **Escalabilidad**: Diseño preparado para evolución

## Módulos Principales

### Backend (NestJS)
- `auth/`: Autenticación y autorización
- `users/`: Gestión de usuarios
- `products/`: Catálogo de productos
- `orders/`: Gestión de órdenes
- `payments/`: Integración Stripe
- `admin/`: Dashboard administrativo

### Frontend (Next.js)
- `app/`: Rutas con App Router
- `components/`: Componentes reutilizables
- `lib/`: Utilidades y configuración
- `hooks/`: Custom hooks React

## Contribución

Proyecto desarrollado para el semestre universitario. Enfoque en buenas prácticas, código limpio y aprendizaje.

## Licencia

Proyecto educativo - Uso académico
