# Ecommerce Frontend - Next.js

Frontend para el eCommerce Universitario construido con Next.js 14, TypeScript y Tailwind CSS.

## 🚀 Características

- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos modernos
- **Zustand** para estado global
- **Axios** para llamadas a API
- **Lucide React** para iconos
- **React Hook Form** para formularios
- **Diseño Responsive** para todos los dispositivos

## 📋 Prerrequisitos

- Node.js 18+
- npm o yarn

## 🛠️ Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

## 🏃‍♂️ Ejecutar la aplicación

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm run build
npm run start
```

## 📂 Estructura del Proyecto

```
src/
├── app/                    # App Router
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Home
│   ├── auth/             # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── products/         # Catálogo de productos
│   ├── cart/             # Carrito de compras
│   └── profile/          # Perfil de usuario
├── components/              # Componentes reutilizables
│   ├── ui/               # Componentes base
│   ├── layout/           # Layout components
│   ├── forms/            # Formularios
│   ├── product/          # Componentes de productos
│   ├── cart/             # Componentes de carrito
│   └── auth/             # Componentes de auth
├── store/                    # Estado global (Zustand)
│   ├── auth-store.ts     # Estado de autenticación
│   └── cart-store.ts     # Estado del carrito
├── lib/                      # Utilidades
│   ├── api.ts            # Cliente HTTP
│   └── utils.ts          # Funciones helper
├── types/                    # Tipos TypeScript
│   ├── auth.ts           # Tipos de autenticación
│   └── cart.ts           # Tipos de carrito
└── styles/                   # Estilos adicionales
```

## 🎨 Componentes Principales

### Layout
- **Header**: Navegación principal con carrito
- **Footer**: Pie de página con enlaces
- **Hero**: Sección hero de la home

### Autenticación
- **Login Form**: Formulario de inicio de sesión
- **Register Form**: Formulario de registro
- **Auth Guards**: Protección de rutas

### Productos
- **Product Card**: Tarjeta de producto
- **Product List**: Lista de productos (grid/list)
- **Product Filter**: Filtros de búsqueda
- **Product Details**: Vista detallada

### Carrito
- **Cart Drawer**: Carrito lateral deslizable
- **Cart Item**: Item individual del carrito
- **Cart Summary**: Resumen del pedido

## 🔄 Gestión de Estado

### Auth Store
- Usuario autenticado
- Token JWT
- Refresh token
- Funciones de login/logout

### Cart Store
- Items del carrito
- Total del carrito
- Persistencia en localStorage

## 🎨 Diseño

### Sistema de Diseño
- **Colores Primarios**: Azul primario, grises neutrales
- **Tipografía**: Inter font family
- **Espaciado**: Sistema consistente
- **Responsive**: Mobile-first approach

### Componentes UI
- **Button**: Variants (primary, secondary, outline)
- **Input**: Con validación y estados
- **Card**: Para contenido estructurado

## 📱 Responsive

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptaciones
- **Header**: Colapsable en mobile
- **Productos**: Grid adaptable
- **Carrito**: Drawer en mobile, sidebar en desktop

## 🔐 Autenticación

### Flujo
1. Login → Token JWT → Dashboard
2. Register → Token JWT → Dashboard
3. Protected Routes → Verificación de token

### Persistencia
- Tokens en localStorage
- Estado global con Zustand
- Auto-refresh de tokens

## 📡 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Compilación para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Análisis de código
- `npm run type-check` - Verificación de tipos

## 🌐 Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎯 Próximos Pasos

1. **Instalar dependencias**: `npm install`
2. **Configurar backend**: Asegurar API disponible
3. **Conectar stores**: Integrar con backend real
4. **Testing**: Probar flujo completo
5. **Deploy**: Preparar para producción

## 📱 Características Adicionales

- **Dark Mode**: Soporte para tema oscuro
- **Internacionalización**: Soporte multi-idioma
- **Accesibilidad**: WCAG compliance
- **Performance**: Optimización de imágenes
- **SEO**: Meta tags optimizadas

## 🔧 Desarrollo

### Hot Reload
- Recarga automática en desarrollo
- Preservación de estado del carrito
- Recarga de sesión de usuario

### Code Quality
- TypeScript estricto
- ESLint configurado
- Prettier para formato
- Componentes reutilizables

## 📚 Documentación

- Componentes documentados con JSDoc
- Tipos TypeScript descriptivos
- Guías de uso en comentarios
- Ejemplos de implementación
