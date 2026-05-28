# 🎨 Ecommerce Hak 6 Frontend - Next.js 14

Frontend especializado en herramientas de ciberseguridad construido con Next.js 14, TypeScript y Tailwind CSS.

## 🏗️ Arquitectura

### Stack Tecnológico
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript 5 (modo estricto)
- **Estilos**: Tailwind CSS 3 con diseño responsive
- **Estado**: Zustand para estado global
- **Forms**: React Hook Form + Zod para validación
- **HTTP Client**: Axios con interceptors
- **Iconos**: Lucide React
- **UI Components**: Componentes personalizados reutilizables

### Estructura del Proyecto
```
src/
├── app/               # App Router (Next.js 14)
│   ├── auth/          # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── cart/          # Carrito de compras
│   ├── categories/    # Categorías de ciberseguridad
│   ├── products/      # Catálogo de herramientas
│   ├── nosotros/      # Acerca de Hak 6
│   ├── page.tsx       # Homepage
│   ├── layout.tsx     # Layout principal
│   └── not-found.tsx  # Página 404
├── components/        # Componentes React
│   ├── ui/           # Componentes base reutilizables
│   ├── layout/       # Layout components (Header, Footer)
│   ├── auth/         # Componentes de autenticación
│   ├── product/      # Componentes de productos
│   ├── cart/         # Componentes de carrito
│   └── forms/        # Formularios reutilizables
├── hooks/            # Custom React hooks
├── store/            # Estado global (Zustand)
├── lib/              # Utilidades y configuración
├── types/            # Tipos TypeScript
└── styles/           # Estilos adicionales
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Backend API corriendo (puerto 3001)

### Instalación

1. **Clonar e instalar dependencias**
```bash
git clone <repository-url>
cd ecommerce-hack/frontend
npm install
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con las URLs correctas
```

3. **Iniciar aplicación**
```bash
# Modo desarrollo
npm run dev

# Verificar tipos
npm run type-check

# Análisis de código
npm run lint
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- API del Backend: http://localhost:3001

## 🔧 Variables de Entorno

### .env.local
```env
# API del Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Configuración adicional
NEXT_PUBLIC_APP_NAME="Ecommerce Hak 6"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_SPECIALIZATION="Ciberseguridad"
```

## 🎨 Sistema de Diseño

### Colores (Tailwind CSS)
```css
/* Primary Colors */
--color-primary: #3b82f6;     /* Blue 500 */
--color-secondary: #6b7280;   /* Gray 500 */
--color-accent: #10b981;       /* Emerald 500 */
--color-muted: #f3f4f6;       /* Gray 100 */

/* Semantic Colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

### Tipografía
- **Font**: Inter (Google Fonts)
- **Sizes**: `text-sm`, `text-base`, `text-lg`, `text-xl`
- **Weights**: `font-normal`, `font-medium`, `font-semibold`, `font-bold`

### Responsive Breakpoints
- **Mobile**: `< 768px` (`sm:`)
- **Tablet**: `768px - 1024px` (`md:`, `lg:`)
- **Desktop**: `> 1024px` (`xl:`, `2xl:`)

## 🔥 Características Principales

### ✅ Implementadas
- **Diseño Responsive**: Mobile-first approach
- **Estado Global**: Zustand para auth y carrito
- **Formularios**: Validación con React Hook Form + Zod
- **Autenticación**: Login, register y rutas protegidas
- **Componentes UI**: Biblioteca de componentes reutilizables
- **Type Safety**: TypeScript estricto en todo el proyecto
- **Catálogo Especializado**: Herramientas de pentesting, forense, redes
- **Carrito de Compras**: Gestión completa del carrito
- **Integración Backend**: API client con Axios funcionando
- **Filtros Técnicos**: Por categoría, nivel de habilidad, compatibilidad

### 🔄 En Desarrollo
- **Proceso de Checkout**: Multi-step checkout con Stripe
- **Panel Administrativo**: Dashboard básico
- **Testing**: Unit tests y e2e tests

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor con hot reload
npm run build            # Compilar para producción
npm run start            # Servidor producción
npm run type-check       # Verificación de tipos

# Calidad de código
npm run lint             # Análisis con ESLint
npm run lint:fix         # Corregir automáticamente
npm run format           # Formato con Prettier

# Testing (cuando se implemente)
npm run test             # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura
```

## 📱 Responsive Design

### Mobile First Approach
- **Header**: Colapsable con hamburger menu
- **Products**: Grid de 1 columna
- **Carrito**: Drawer desde el lado derecho
- **Forms**: Pantalla completa con validación

### Desktop Adaptations
- **Header**: Navegación horizontal completa
- **Products**: Grid de 3-4 columnas
- **Carrito**: Sidebar persistente
- **Forms**: Layout centrado con anchura máxima

## 🔐 Autenticación

### Flujo de Autenticación
1. **Login/Register** → Token JWT → Estado global
2. **Protected Routes** → Verificación token → Acceso permitido/denegado
3. **Session Management** → Auto-refresh de tokens
4. **Logout** → Limpieza de estado y tokens

### Auth Store (Zustand)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

### Rutas Protegidas
```typescript
// components/auth/auth-guard.tsx
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth/login" />;
  
  return <>{children}</>;
}
```

## 🛒 Carrito de Compras

### Cart Store (Zustand)
```typescript
interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  syncWithServer: () => Promise<void>;
}
```

### Componentes del Carrito
- **CartDrawer**: Carrito lateral con animación
- **CartItem**: Item individual con controles de cantidad
- **CartSummary**: Resumen con subtotal y total
- **AddToCart**: Botón para agregar productos

## 🎯 Componentes UI

### Componentes Base (`components/ui/`)
```typescript
// Button con variants
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

// Input con validación
interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
}

// Card component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}
```

### Layout Components
- **Header**: Navegación principal con carrito
- **Footer**: Información del sitio y links
- **Sidebar**: Navegación secundaria (dashboard)
- **Breadcrumb**: Navegación jerárquica

## 📡 API Integration

### HTTP Client (Axios)
```typescript
// lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor para auth
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor para refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshAuthToken();
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Custom Hooks
```typescript
// hooks/use-products.ts
export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts(filters)
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [filters]);

  return { products, loading, error };
}
```

## 🧪 Testing (Próximamente)

### Estructura de Tests
```
__tests__/
├── components/         # Tests de componentes
├── hooks/            # Tests de hooks personalizados
├── utils/            # Tests de utilidades
└── e2e/              # Tests end-to-end
```

### Configuración de Testing
```bash
# Instalar dependencias de testing
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev jest jest-environment-jsdom
npm install --save-dev @types/jest
```

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Variables de entorno en Vercel
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_APP_URL production
```

### Netlify
```bash
# Build para Netlify
npm run build

# Deploy con Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

### Variables de Entorno de Producción
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_URL=https://your-frontend-url.com
NEXT_PUBLIC_APP_NAME="Ecommerce Universitario"
```

## 🎨 Guía de Estilo

### Component Design Principles
1. **Consistencia**: Usar siempre los mismos patrones
2. **Reusabilidad**: Componentes pequeños y específicos
3. **Accessibility**: Siempre incluir ARIA labels
4. **Performance**: Optimizar renders con React.memo

### CSS Organization
```css
/* Component-specific styles */
.product-card {
  /* Base styles */
}

.product-card--hover {
  /* State variants */
}

.product-card__title {
  /* Element styles */
}

/* Utility classes */
.text-center { text-align: center; }
.mb-4 { margin-bottom: 1rem; }
```

## 🔧 Optimización de Performance

### Code Splitting
```typescript
// Lazy loading de componentes
const ProductDetail = lazy(() => import('./components/product/ProductDetail'));
const CartDrawer = lazy(() => import('./components/cart/CartDrawer'));

// Suspense boundary
<Suspense fallback={<LoadingSpinner />}>
  <ProductDetail />
</Suspense>
```

### Image Optimization
```typescript
// Next.js Image component
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={200}
  className="object-cover rounded"
  priority={index < 4} // Priorizar primeras imágenes
/>
```

### Bundle Analysis
```bash
# Analizar bundle size
npm install --save-dev @next/bundle-analyzer
npx next build --analyze
```

## 🤝 Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
3. Seguir convenciones de código
4. Tests unitarios para nuevos componentes
5. Pull request con descripción detallada

### Code Style
- **TypeScript**: Modo estricto
- **ESLint**: Configuración de Next.js
- **Prettier**: Formato automático
- **Component Naming**: PascalCase para componentes
- **File Naming**: kebab-case para archivos

### Commit Convention
```
feat: add product search functionality
fix: resolve cart total calculation issue
docs: update API integration guide
style: improve button component design
refactor: optimize product list performance
test: add unit tests for auth store
```

## 📚 Documentación Adicional

- [Documentación Principal](../README.md)
- [Guía de Desarrollo](../GUIA_DESARROLLO.md)
- [Backend API Documentation](../backend/README.md)
- [Arquitectura del Sistema](../ARQUITECTURA.md)

---

**Desarrollado con ❤️ y TypeScript para Ecommerce Hak 6**
