# Diseño Arquitectónico - eCommerce Universitario

## 1. Diagrama General en Texto

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend     │    │    Backend      │    │   Database      │
│   Next.js      │◄──►│    NestJS       │◄──►│  PostgreSQL     │
│                │    │                 │    │                 │
│ - UI/UX        │    │ - API REST      │    │ - Users         │
│ - State Mgmt   │    │ - Business Logic│    │ - Products      │
│ - Client Auth  │    │ - JWT Auth      │    │ - Orders        │
│ - Routing      │    │ - Validation    │    │ - Cart          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │     Prisma      │              │
         └──────────────►│     ORM         │◄─────────────┘
                        │                 │
                        │ - Schema        │
                        │ - Migrations    │
                        │ - Type Safety   │
                        └─────────────────┘
```

## 2. Capas del Sistema

### Frontend (Next.js)
```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │   Pages     │ │    Components       │ │
│  │             │ │                     │ │
│  │ - Products  │ │ - UI Elements       │ │
│  │ - Cart      │ │ - Forms             │ │
│  │ - Checkout  │ │ - Layouts           │ │
│  │ - Profile   │ │ - Business Logic    │ │
│  └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│            Business Layer                │
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │   Hooks     │ │      Store          │ │
│  │             │ │                     │ │
│  │ - API Calls │ │ - Global State      │ │
│  │ - Auth      │ │ - Cart State        │ │
│  │ - Cart      │ │ - User Session      │ │
│  └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│            Data Access Layer             │
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │   API       │ │    HTTP Client      │ │
│  │   Client    │ │                     │ │
│  │             │ │ - Axios/Fetch       │ │
│  │ - Endpoints │ │ - Interceptors      │ │
│  │ - Auth      │ │ - Error Handling    │ │
│  └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────┘
```

### Backend (NestJS)
```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │ Controllers │ │   Middleware        │ │
│  │             │ │                     │ │
│  │ - HTTP      │ │ - Auth Guard        │ │
│  │ - Routes    │ │ - Validation        │ │
│  │ - DTOs      │ │ - CORS              │ │
│  └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│            Business Layer                │
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │   Services  │ │    Modules          │ │
│  │             │ │                     │ │
│  │ - Logic     │ │ - Auth Module       │ │
│  │ - Rules     │ │ - Product Module    │ │
│  │ - Validation│ │ - Order Module      │ │
│  └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│            Data Access Layer             │
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │  Repositories│ │      Prisma         │ │
│  │             │ │                     │ │
│  │ - Queries   │ │ - Database Client   │ │
│  │ - CRUD      │ │ - Models            │ │
│  │ - Relations │ │ - Migrations        │ │
│  └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────┘
```

## 3. Módulos del Backend

```
src/modules/
├── auth/
│   ├── auth.controller.ts     # Login, Register, Refresh
│   ├── auth.service.ts        # JWT logic, password hashing
│   ├── auth.module.ts         # Module configuration
│   ├── dto/                   # Data Transfer Objects
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   └── strategies/            # Passport strategies
│       └── jwt.strategy.ts
├── users/
│   ├── users.controller.ts    # User CRUD
│   ├── users.service.ts       # User business logic
│   ├── users.module.ts
│   └── entities/
│       └── user.entity.ts
├── products/
│   ├── products.controller.ts # Product CRUD
│   ├── products.service.ts    # Product logic
│   ├── products.module.ts
│   └── dto/
│       ├── create-product.dto.ts
│       └── update-product.dto.ts
├── categories/
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
├── cart/
│   ├── cart.controller.ts     # Cart operations
│   ├── cart.service.ts        # Cart business logic
│   └── cart.module.ts
├── orders/
│   ├── orders.controller.ts   # Order management
│   ├── orders.service.ts      # Order processing
│   └── dto/
│       └── create-order.dto.ts
└── payments/
    ├── payments.controller.ts # Payment processing
    ├── payments.service.ts    # Payment logic
    └── webhook.controller.ts  # Payment webhooks
```

## 4. Flujo Frontend-Backend

```
Usuario Frontend Backend Database
  │        │         │          │
  ├─ Login ─┤         │          │
  │        ├─ POST /auth/login ─┤
  │        │         ├─ Validate user ─┤
  │        │         │         ├─ Query user
  │        │         │         │         │
  │        ◄─ JWT Token ─┤         │
  │        │         │         │
  ├─ View Products ─┤          │
  │        ├─ GET /products ─┤
  │        │         ├─ Get products ─┤
  │        │         │         ├─ Query with filters
  │        │         │         │         │
  │        ◄─ Product List ─┤          │
  │        │         │         │
  ├─ Add to Cart ─┤          │
  │        ├─ POST /cart/items ─┤
  │        │         ├─ Validate product ─┤
  │        │         │         ├─ Check stock
  │        │         │         │         │
  │        ◄─ Updated Cart ─┤          │
  │        │         │         │
  ├─ Checkout ─┤          │
  │        ├─ POST /orders ─┤
  │        │         ├─ Process order ─┤
  │        │         │         ├─ Create order
  │        │         │         ├─ Update stock
  │        │         │         ├─ Clear cart
  │        │         │         │         │
  │        ◄─ Order Confirmation ─┤       │
```

## 5. Justificación Técnica

### Next.js (Frontend)
- **SSR/SSG**: Mejor SEO para productos
- **App Router**: Estructura de carpetas intuitiva
- **TypeScript**: Type safety end-to-end
- **Optimización**: Bundle splitting automático
- **Ecosistema**: Integración nativa con React

### NestJS (Backend)
- **Arquitectura Modular**: Escalabilidad y mantenibilidad
- **TypeScript**: Consistencia de tipos con frontend
- **Decoradores**: Código declarativo y legible
- **Inyección de Dependencias**: Testing fácil
- **Ecosistema**: Guards, Pipes, Interceptors listos

### PostgreSQL + Prisma
- **ACID**: Integridad de datos transaccionales
- **Relaciones**: Complejidad de eCommerce (orders, items, users)
- **Prisma**: Type-safe database access
- **Migrations**: Control de versiones de schema
- **Performance**: Queries optimizadas

### JWT Authentication
- **Stateless**: Escalabilidad horizontal
- **Seguridad**: Firmas criptográficas
- **Standard**: Amplio soporte
- **Flexibilidad**: Refresh tokens, scopes

### Monolito Modular
- **Simplicidad**: Deploy único
- **Performance**: Comunicación en memoria
- **Costos**: Menos infraestructura
- **Mantenimiento**: Código base unificado
- **Escalabilidad**: Módulos independientes
