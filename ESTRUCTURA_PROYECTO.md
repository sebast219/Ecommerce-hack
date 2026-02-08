# Estructura Completa del Proyecto

## 📁 Árbol de Archivos

```
ecommerce-universitario/
├── README.md
├── .gitignore
├── docker-compose.yml
│
├── frontend/                          # Next.js 14 App Router
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── .env.local
│   ├── .env.example
│   ├── .gitignore
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   └── images/
│   │       ├── placeholder-product.jpg
│   │       └── banner-hero.jpg
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   │
│   │   │   ├── (auth)/                 # Grupo de rutas de auth
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── forgot-password/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── (dashboard)/            # Panel administrativo
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── analytics/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── products/               # Catálogo público
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── category/
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── cart/                   # Carrito de compras
│   │   │   │   ├── page.tsx
│   │   │   │   └── success/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── checkout/               # Proceso de pago
│   │   │   │   ├── page.tsx
│   │   │   │   ├── shipping/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── payment/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── confirmation/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── profile/                # Perfil de usuario
│   │   │   │   ├── page.tsx
│   │   │   │   ├── orders/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── addresses/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── search/                 # Búsqueda
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── api/                    # API Routes de Next.js
│   │   │       ├── auth/
│   │   │       │   └── [...nextauth]/
│   │   │       │       └── route.ts
│   │   │       └── webhook/
│   │   │           └── route.ts
│   │   │
│   │   ├── components/                 # Componentes reutilizables
│   │   │   ├── ui/                     # Componentes base
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── modal.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── layout/                 # Layout components
│   │   │   │   ├── header.tsx
│   │   │   │   ├── footer.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── navigation.tsx
│   │   │   │   └── breadcrumb.tsx
│   │   │   │
│   │   │   ├── forms/                  # Componentes de formularios
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   ├── product-form.tsx
│   │   │   │   ├── checkout-form.tsx
│   │   │   │   └── search-form.tsx
│   │   │   │
│   │   │   ├── product/                # Componentes de productos
│   │   │   │   ├── product-card.tsx
│   │   │   │   ├── product-list.tsx
│   │   │   │   ├── product-details.tsx
│   │   │   │   ├── product-filter.tsx
│   │   │   │   └── product-search.tsx
│   │   │   │
│   │   │   ├── cart/                   # Componentes de carrito
│   │   │   │   ├── cart-item.tsx
│   │   │   │   ├── cart-summary.tsx
│   │   │   │   ├── cart-drawer.tsx
│   │   │   │   └── add-to-cart.tsx
│   │   │   │
│   │   │   └── auth/                   # Componentes de auth
│   │   │       ├── auth-guard.tsx
│   │   │       ├── auth-provider.tsx
│   │   │       └── protected-route.tsx
│   │   │
│   │   ├── hooks/                      # Custom hooks
│   │   │   ├── use-auth.ts
│   │   │   ├── use-cart.ts
│   │   │   ├── use-products.ts
│   │   │   ├── use-orders.ts
│   │   │   ├── use-search.ts
│   │   │   └── use-local-storage.ts
│   │   │
│   │   ├── lib/                        # Utilidades y configuración
│   │   │   ├── api.ts                  # Cliente HTTP
│   │   │   ├── auth.ts                 # Configuración de auth
│   │   │   ├── utils.ts                # Utilidades generales
│   │   │   ├── constants.ts            # Constantes
│   │   │   ├── validations.ts          # Validaciones
│   │   │   ├── formatters.ts           # Formato de datos
│   │   │   └── env.ts                  # Variables de entorno
│   │   │
│   │   ├── store/                      # Estado global
│   │   │   ├── index.ts                # Configuración principal
│   │   │   ├── auth-store.ts           # Estado de autenticación
│   │   │   ├── cart-store.ts           # Estado del carrito
│   │   │   ├── product-store.ts        # Estado de productos
│   │   │   └── ui-store.ts             # Estado de UI
│   │   │
│   │   ├── types/                      # Tipos TypeScript
│   │   │   ├── auth.ts
│   │   │   ├── product.ts
│   │   │   ├── cart.ts
│   │   │   ├── order.ts
│   │   │   ├── user.ts
│   │   │   ├── api.ts
│   │   │   └── index.ts
│   │   │
│   │   └── styles/                     # Estilos adicionales
│   │       ├── components.css
│   │       └── animations.css
│   │
│   └── docs/                           # Documentación frontend
│       ├── README.md
│       └── API.md
│
├── backend/                           # NestJS API
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── nest-cli.json
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   │
│   ├── src/
│   │   ├── main.ts                    # Punto de entrada
│   │   ├── app.module.ts              # Módulo raíz
│   │   │
│   │   ├── common/                    # Elementos compartidos
│   │   │   ├── decorators/
│   │   │   │   ├── auth-user.decorator.ts
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── public.decorator.ts
│   │   │   │
│   │   │   ├── filters/
│   │   │   │   ├── http-exception.filter.ts
│   │   │   │   └── validation.filter.ts
│   │   │   │
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   │   └── throttle.guard.ts
│   │   │   │
│   │   │   ├── interceptors/
│   │   │   │   ├── logging.interceptor.ts
│   │   │   │   ├── transform.interceptor.ts
│   │   │   │   └── cache.interceptor.ts
│   │   │   │
│   │   │   ├── pipes/
│   │   │   │   ├── validation.pipe.ts
│   │   │   │   └── parse-uuid.pipe.ts
│   │   │   │
│   │   │   └── interfaces/
│   │   │       ├── response.interface.ts
│   │   │       └── pagination.interface.ts
│   │   │
│   │   ├── config/                    # Configuración
│   │   │   ├── configuration.ts
│   │   │   ├── database.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   └── app.config.ts
│   │   │
│   │   ├── database/                  # Configuración de DB
│   │   │   ├── prisma.service.ts
│   │   │   └── database.module.ts
│   │   │
│   │   ├── modules/                   # Módulos funcionales
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── local.strategy.ts
│   │   │   │   └── dto/
│   │   │   │       ├── login.dto.ts
│   │   │   │       ├── register.dto.ts
│   │   │   │       └── reset-password.dto.ts
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── user.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-user.dto.ts
│   │   │   │       └── update-user.dto.ts
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── products.controller.ts
│   │   │   │   ├── products.service.ts
│   │   │   │   ├── products.module.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── product.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-product.dto.ts
│   │   │   │       ├── update-product.dto.ts
│   │   │   │       └── filter-product.dto.ts
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   ├── categories.controller.ts
│   │   │   │   ├── categories.service.ts
│   │   │   │   ├── categories.module.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── category.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-category.dto.ts
│   │   │   │       └── update-category.dto.ts
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── cart.controller.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── cart.module.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── cart.entity.ts
│   │   │   │   │   └── cart-item.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── add-to-cart.dto.ts
│   │   │   │       └── update-cart.dto.ts
│   │   │   │
│   │   │   ├── orders/
│   │   │   │   ├── orders.controller.ts
│   │   │   │   ├── orders.service.ts
│   │   │   │   ├── orders.module.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── order.entity.ts
│   │   │   │   │   └── order-item.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-order.dto.ts
│   │   │   │       └── update-order.dto.ts
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   ├── payments.controller.ts
│   │   │   │   ├── payments.service.ts
│   │   │   │   ├── payments.module.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── payment.entity.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-payment.dto.ts
│   │   │   │   │   └── webhook.dto.ts
│   │   │   │   └── webhook/
│   │   │   │       └── webhook.controller.ts
│   │   │   │
│   │   │   └── notifications/
│   │   │       ├── notifications.controller.ts
│   │   │       ├── notifications.service.ts
│   │   │       ├── notifications.module.ts
│   │   │       └── entities/
│   │   │           └── notification.entity.ts
│   │   │
│   │   └── utils/                     # Utilidades
│   │       ├── bcrypt.util.ts
│   │       ├── jwt.util.ts
│   │       ├── email.util.ts
│   │       ├── file.util.ts
│   │       └── validation.util.ts
│   │
│   ├── prisma/                        # Prisma ORM
│   │   ├── schema.prisma              # Esquema de base de datos
│   │   ├── migrations/                # Migraciones
│   │   └── seed.ts                    # Datos iniciales
│   │
│   ├── test/                          # Testing
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │       ├── app.e2e-spec.ts
│   │       └── jest-e2e.config.js
│   │
│   └── docs/                          # Documentación backend
│       ├── README.md
│       ├── API.md
│       └── DEPLOYMENT.md
│
├── database/                         # Configuración de DB
│   ├── init.sql
│   └── backup/
│
├── docs/                             # Documentación general
│   ├── README.md
│   ├── CONTRIBUTING.md
│   ├── DEPLOYMENT.md
│   └── CHANGELOG.md
│
└── scripts/                          # Scripts de desarrollo
    ├── setup.sh
    ├── dev.sh
    ├── build.sh
    ├── deploy.sh
    └── backup.sh
```

## 📝 Archivos de Configuración Clave

### Frontend - package.json (dependencies)
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "lucide-react": "^0.292.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

### Backend - package.json (dependencies)
```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/jwt": "^10.1.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/throttler": "^5.0.0",
    "@nestjs/swagger": "^7.1.0",
    "@prisma/client": "^5.5.0",
    "prisma": "^5.5.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "bcrypt": "^5.1.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "swagger-ui-express": "^5.0.0"
  }
}
```

## 🚀 Scripts de Desarrollo

### Frontend Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### Backend Scripts
```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

## 🌍 Variables de Entorno

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
```

Esta estructura proporciona una base sólida y escalable para tu eCommerce universitario.
