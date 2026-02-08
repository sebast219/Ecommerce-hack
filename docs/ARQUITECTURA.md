# Arquitectura del Sistema - eCommerce Cybersecurity

## Visión General

Este proyecto implementa un **monolito modular** basado en **Clean Architecture** para un eCommerce especializado en componentes de ciberseguridad. La arquitectura está diseñada para ser mantenible, escalable y defendible en un contexto académico universitario.

## Diagrama de Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend     │    │    Backend     │    │  Infraestructura│
│ (Next.js 14)   │◄──►│   (NestJS)     │◄──►│  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components│    │   API Endpoints│    │   Database      │
│ (Shadcn/UI)     │    │  (Controllers)  │    │   Tables        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────┐
                    │ Business Logic  │
                    │ (Services)      │
                    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────┐
                    │ Data Access     │
                    │ (Repositories)  │
                    └─────────────────┘
```

## Clean Architecture - Capas Concéntricas

### 1. Capa de Entidades (Core)
**Ubicación:** `src/entities/` (implícito en Prisma models)

**Responsabilidades:**
- Definir reglas de negocio fundamentales
- Estructuras de datos puras
- Independencia total de frameworks

**Ejemplo:**
```typescript
// Definido en Prisma schema
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      Role     @default(USER)
  // ...
}
```

### 2. Capa de Casos de Uso (Services)
**Ubicación:** `src/{module}/{module}.service.ts`

**Responsabilidades:**
- Implementar lógica de negocio
- Coordinar entre entidades
- Validaciones y reglas específicas

**Ejemplo:**
```typescript
@Injectable()
export class OrdersService {
  async create(createOrderDto: CreateOrderDto, userId: string) {
    // Validaciones de negocio
    // Cálculos de totales
    // Coordinación con repositorios
  }
}
```

### 3. Capa de Adaptadores (Controllers)
**Ubicación:** `src/{module}/{module}.controller.ts`

**Responsabilidades:**
- Manejar requests HTTP
- Validar inputs
- Delegar a services
- Formatear respuestas

**Ejemplo:**
```typescript
@Controller('orders')
export class OrdersController {
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
}
```

### 4. Capa de Frameworks (Infrastructure)
**Ubicación:** `src/prisma/`, configuración externa

**Responsabilidades:**
- Conexión a base de datos
- Configuración de frameworks
- Detalles de implementación

## Módulos del Backend

### 1. Auth Module
**Propósito:** Autenticación y autorización
**Componentes:**
- `auth.controller.ts` - Endpoints de login/register
- `auth.service.ts` - Lógica de JWT y validación
- `auth.repository.ts` - Acceso a datos de usuarios
- `strategies/jwt.strategy.ts` - Estrategia Passport

**Flujo de Autenticación:**
```
Usuario → Login → Controller → Service → Repository → DB
         ↓
    JWT Token ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```

### 2. Users Module
**Propósito:** Gestión de usuarios y perfiles
**Componentes:**
- `users.controller.ts` - CRUD de usuarios
- `users.service.ts` - Lógica de gestión de usuarios
- `users.repository.ts` - Acceso a datos

### 3. Products Module
**Propósito:** Catálogo de productos
**Componentes:**
- `products.controller.ts` - Endpoints de productos
- `products.service.ts` - Lógica de inventario
- `products.repository.ts` - Acceso a datos

### 4. Orders Module
**Propósito:** Gestión de órdenes
**Componentes:**
- `orders.controller.ts` - Endpoints de órdenes
- `orders.service.ts` - Lógica de procesamiento
- `orders.repository.ts` - Acceso a datos

### 5. Payments Module
**Propósito:** Integración con Stripe
**Componentes:**
- `payments.controller.ts` - Webhooks y checkout
- `payments.service.ts` - Lógica de pagos
- `payments.repository.ts` - Acceso a datos

### 6. Admin Module
**Propósito:** Dashboard administrativo
**Componentes:**
- `admin.controller.ts` - Endpoints de admin
- `admin.service.ts` - Estadísticas y gestión

## Frontend Architecture

### 1. App Router Structure
```
app/
├── layout.tsx          # Layout global
├── page.tsx           # Home page
├── auth/              # Rutas de autenticación
├── products/          # Catálogo de productos
├── orders/            # Gestión de órdenes
├── admin/             # Dashboard admin
└── api/              # API routes (si necesario)
```

### 2. Component Architecture
**UI Components:** `components/ui/` (Shadcn/UI)
- Componentes reutilizables y accesibles
- Basados en Radix UI
- Estilizados con Tailwind CSS

**Feature Components:** `components/`
- Lógica de negocio específica
- Integración con API
- Estado local y global

### 3. State Management
**React Query:** Para server state
- Caching automático
- Refetching inteligente
- Optimistic updates

**Local State:** React hooks
- useState para estado simple
- useContext para estado compartido

## Base de Datos - Prisma Schema

### Diseño Relacional
```sql
Users ──(1:N)── Orders ──(1:N)── OrderItems ──(N:1)── Products
  │                    │
  └──(1:1)── Cart ───(1:N)── CartItems ───(N:1)── Products
                    │
                    └──(1:1)── Payments
```

### Entidades Principales

#### Users
- **ID:** UUID (PK)
- **Email:** Único, para login
- **Password:** Hasheado con bcrypt
- **Role:** USER/ADMIN (RBAC)

#### Products
- **ID:** UUID (PK)
- **Name:** Nombre del producto
- **Price:** Decimal (10,2)
- **Stock:** Integer para inventario
- **Category:** Para filtrado

#### Orders
- **ID:** UUID (PK)
- **UserID:** FK a Users
- **Total:** Decimal calculado
- **Status:** PENDING/PAID/SHIPPED/CANCELLED

#### Payments
- **ID:** UUID (PK)
- **OrderID:** FK a Orders
- **StripeSessionID:** Para integración
- **Status:** PENDING/SUCCESS/FAILED

## Seguridad

### 1. Autenticación
- **JWT Tokens:** Access y refresh tokens
- **Password Hashing:** bcrypt con salt rounds
- **Token Rotation:** Refresh automático

### 2. Autorización
- **Role-Based Access Control (RBAC)**
- **Guards:** JWT y roles en NestJS
- **Route Protection:** Middleware en frontend

### 3. Validación
- **DTOs:** class-validator en backend
- **Input Sanitization:** Prevenir XSS/SQLi
- **Type Safety:** TypeScript en todo el stack

## Flujo Completo de Compra

### 1. Exploración de Productos
```
Frontend → GET /products → Backend → Prisma → DB
         ← Product List ← ← ← ← ← ← ← ←
```

### 2. Proceso de Checkout
```
Frontend → POST /orders → Backend → Validación → DB
         ← Order Created ← ← ← ← ← ← ← ←
         ↓
Frontend → POST /payments/checkout → Stripe → Payment URL
         ← Stripe Session ← ← ← ← ← ← ← ←
```

### 3. Confirmación de Pago
```
Stripe → Webhook → Backend → Update Order Status → DB
         ↓
Frontend ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```

## Escalabilidad y Mantenimiento

### 1. Modularidad
- **Módulos independientes:** Desarrollo paralelo
- **Interfaces claras:** Contratos definidos
- **Bajo acoplamiento:** Cambios localizados

### 2. Testing Strategy
- **Unit Tests:** Lógica de negocio aislada
- **Integration Tests:** Flujo entre capas
- **E2E Tests:** Flujo completo del usuario

### 3. Performance
- **Database Indexing:** Queries optimizadas
- **Caching:** React Query y Redis opcional
- **Lazy Loading:** Componentes y datos bajo demanda

## Decisiones Arquitectónicas

### 1. Monolito vs Microservicios
**Decisión:** Monolito modular
**Justificación:**
- **Tiempo limitado:** 16 semanas académicas
- **Complejidad reducida:** Menos overhead de comunicación
- **Desarrollo más rápido:** Todo en un codebase
- **Testing simplificado:** Integración más fácil

### 2. NestJS vs Express
**Decisión:** NestJS
**Justificación:**
- **TypeScript nativo:** Type safety
- **Arquitectura modular:** Inyectable, testable
- **Decoradores:** Código limpio y declarativo
- **Ecosistema maduro:** Guards, pipes, interceptors

### 3. Prisma vs TypeORM
**Decisión:** Prisma
**Justificación:**
- **Type safety:** Autocompletado y validación
- **Migrations:** Control de versiones de DB
- **Performance:** Queries optimizadas
- **Developer Experience:** Prisma Studio

### 4. Next.js App Router vs Pages Router
**Decisión:** App Router
**Justificación:**
- **Server Components:** Mejor performance
- **Layouts anidados:** Estructura clara
- **Streaming:** Carga progresiva
- **Futuro-proof:** Dirección de React

## Métricas y Monitoreo

### 1. Backend Metrics
- **Response times:** Por endpoint
- **Error rates:** Por módulo
- **Database queries:** Tiempos y frecuencia
- **JWT tokens:** Refresh rate

### 2. Frontend Metrics
- **Core Web Vitals:** Performance
- **User interactions:** Event tracking
- **API calls:** Success/failure rates
- **Bundle size:** Optimización

## Futura Evolución

### 1. Microservicios (Opcional)
- **User Service:** Autenticación centralizada
- **Product Service:** Catálogo independiente
- **Order Service:** Procesamiento dedicado
- **Payment Service:** Gateway de pagos

### 2. Características Adicionales
- **Real-time notifications:** WebSockets
- **Analytics dashboard:** Métricas avanzadas
- **Mobile app:** React Native
- **API Gateway:** Rate limiting y caching

### 3. Infraestructura
- **Containerización:** Docker
- **Orquestación:** Kubernetes
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus + Grafana

---

Esta arquitectura proporciona una base sólida para el desarrollo académico y profesional, balanceando complejidad con mantenibilidad y escalabilidad futura.
