# �️ Ecommerce Hak 6 - Plataforma de Ciberseguridad

Plataforma de comercio electrónico especializada en herramientas de ciberseguridad con arquitectura Clean Architecture basada en principios de diseño moderno.

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + Zustand
- **Backend**: NestJS + TypeScript + Prisma ORM + PostgreSQL
- **Arquitectura**: Clean Architecture (Domain, Application, Infrastructure, Presentation)
- **Autenticación**: JWT con refresh tokens
- **Pagos**: Integración con Stripe (modo prueba)
- **Especialización**: Herramientas de ciberseguridad (pentesting, forense, redes)

### Flujo de Datos
```
Frontend (Next.js) ↔ API REST (NestJS) ↔ PostgreSQL (Prisma)
```

## 🎨 Decisiones de Diseño y Arquitectura

### 🎯 Propósito y Visión del Proyecto

**¿Por qué una plataforma de ciberseguridad?**
- **Nicho especializado**: El mercado de herramientas de ciberseguridad está en crecimiento constante
- **Público objetivo**: Profesionales de pentesting, investigadores de seguridad, estudiantes de ciberseguridad
- **Diferenciación**: Enfocarse exclusivamente en herramientas técnicas con especificaciones detalladas

### 🏗️ Arquitectura Clean Architecture

**¿Por qué Clean Architecture?**
- **Separación de responsabilidades**: Cada capa tiene un propósito definido y no depende de otras
- **Testabilidad**: La lógica de negocio está completamente aislada de infraestructura
- **Mantenimiento**: Cambios en base de datos o APIs no afectan el core del negocio
- **Escalabilidad**: Permite agregar nuevas funcionalidades sin romper código existente

**Capas implementadas:**
1. **Domain**: Entidades puras (User, Product, Order) sin dependencias externas
2. **Application**: Casos de uso y lógica de negocio
3. **Infrastructure**: Base de datos (Prisma), APIs externas
4. **Presentation**: Controllers, middleware y API REST

### 🎨 Diseño Visual y UX/UI

#### **Esquema de Colores**
- **Primario (#1F2937 - Gris Oscuro)**: Transmite seriedad y profesionalismo técnico
- **Acento (#10B981 - Verde Esmeralda)**: Representa seguridad, confianza y éxito
- **Secundario (#3B82F6 - Azul)**: Tecnología, confianza y estabilidad
- **Neutros (#F9FAFB, #E5E7EB)**: Fondo limpio y legibilidad óptima

**¿Por qué estos colores?**
- **Grises oscuros**: Asociados con interfaces técnicas y herramientas de desarrollo
- **Verde esmeralda**: Color universalmente reconocido como "seguro" en sistemas informáticos
- **Azul tecnológico**: Evoca innovación y confiabilidad en productos digitales
- **Alto contraste**: Garantiza accesibilidad y legibilidad en diferentes dispositivos

#### **Tipografía**
- **Inter**: Fuente moderna y legible optimizada para interfaces digitales
- **Jerarquía clara**: Diferenciación visual entre títulos, subtítulos y contenido
- **Consistencia**: Sistema de espaciado basado en múltiplos de 4px

### 🛍️ Funcionalidades Específicas

#### **Catálogo de Productos Técnico**
**¿Por qué filtros especializados?**
- **Categorías por tipo de ataque**: Wireless, USB, Red Team, Forense
- **Filtros técnicos**: Nivel de dificultad, compatibilidad, requerimientos
- **Especificaciones detalladas**: Cada producto incluye specs técnicas relevantes

#### **Sistema de Autenticación Robusto**
**¿Por qué JWT con refresh tokens?**
- **Stateless**: Escalabilidad horizontal sin sesiones en servidor
- **Refresh tokens**: Balance entre seguridad y experiencia de usuario
- **Roles y permisos**: Jerarquía de acceso (Admin, User, Vendor)

#### **Carrito Persistente**
**¿Por qué carrito en base de datos?**
- **Multi-dispositivo**: Usuarios pueden continuar compras en diferentes dispositivos
- **Recuperación**: Carritos abandonados pueden ser recuperados
- **Análisis**: Datos para entender comportamiento de compra

### � Decisiones Técnicas y Mejores Prácticas

#### **Stack Tecnológico Seleccionado**

**Frontend - Next.js 14**
- **¿Por qué Next.js?**: Renderizado híbrido, optimización automática, routing file-based
- **App Router**: Estructura intuitiva y mejor performance
- **TypeScript**: Seguridad de tipos y mejor experiencia de desarrollo
- **Tailwind CSS**: Diseño utility-first, consistencia y mantenibilidad

**Backend - NestJS**
- **¿Por qué NestJS?**: Arquitectura modular, inyección de dependencias, TypeScript nativo
- **Decorators**: Código declarativo y auto-documentación
- **Middleware pipeline**: Control granular de requests
- **Testing integrado**: Soporte nativo para unit y e2e tests

**Base de Datos - PostgreSQL + Prisma**
- **PostgreSQL**: Robustez, transacciones ACID, soporte para JSON
- **Prisma ORM**: Type-safe queries, migrations automáticas, excelente DX
- **Relaciones optimizadas**: Estructura normalizada para performance

#### **Estado Global - Zustand**

**¿Por qué Zustand sobre Redux?**
- **Simplicidad**: Menos boilerplate y curva de aprendizaje más suave
- **TypeScript-first**: Inferencia de tipos automática
- **Performance**: Re-renderizados optimizados por defecto
- **Bundle size**: Más ligero que alternativas complejas

#### **Validación de Formularios - React Hook Form + Zod**

**¿Por qué esta combinación?**
- **React Hook Form**: Performance óptima, re-renderizados mínimos
- **Zod**: Validación type-safe, inferencia automática de tipos
- **Integración perfecta**: Compatibilidad nativa entre ambas librerías
- **Experiencia de usuario**: Validación en tiempo real sin afectar performance

### 🎨 Componentes y Patrones de Diseño

#### **Diseño Atómico**
- **Atoms**: Botones, inputs, badges (elementos básicos)
- **Molecules**: Cards de productos, formularios de búsqueda
- **Organisms**: Header con navegación, grids de productos
- **Templates**: Layouts de página, estructura de checkout
- **Pages**: Implementaciones específicas con datos reales

#### **Responsive Design**
- **Mobile-first**: Diseño optimizado para móviles primero
- **Breakpoints consistentes**: sm(640px), md(768px), lg(1024px), xl(1280px)
- **Grid system**: Basado en CSS Grid y Flexbox
- **Touch-friendly**: Tamaños de click mínimos de 44px

#### **Accesibilidad (a11y)**
- **Semantic HTML**: Uso correcto de elementos header, nav, main, section
- **ARIA labels**: Descriptivos para screen readers
- **Keyboard navigation**: Navegación completa sin mouse
- **Color contrast**: Ratio mínimo de 4.5:1 para WCAG AA

### � Consideraciones de Seguridad y Negocio

#### **Seguridad Implementada**

**Autenticación y Autorización**
- **JWT con RS256**: Firmas asimétricas para mayor seguridad
- **Refresh tokens rotativos**: Previene token reuse attacks
- **Rate limiting**: Protección contra brute force
- **Password hashing**: bcrypt con salt rounds configurables
- **CORS configurado**: Restricción de dominios permitidos

**Validación y Sanitización**
- **Input validation**: Zod schemas en todos los endpoints
- **SQL injection prevention**: Prisma ORM con parameterized queries
- **XSS protection**: Content Security Policy headers
- **File upload security**: Validación de tipos y tamaños

#### **Decisiones de Negocio**

**Modelo de SaaS Especializado**
- **B2B focus**: Empresas de ciberseguridad como clientes principales
- **Suscripciones**: Modelo recurrente para herramientas y actualizaciones
- **Marketplace**: Plataforma para vendedores verificados
- **Certificaciones**: Integración con programas de certificación técnica

**Experiencia de Usuario Técnica**
- **Especificaciones detalladas**: Fichas técnicas completas para cada producto
- **Comparativas**: Side-by-side de herramientas similares
- **Reviews técnicos**: Validación por profesionales certificados
- **Tutoriales integrados**: Guías de uso y mejores prácticas

#### **Escalabilidad y Performance**

**Frontend Optimization**
- **Code splitting**: Carga dinámica por ruta
- **Image optimization**: Next.js Image component con lazy loading
- **Bundle analysis**: Optimización continua del tamaño del bundle
- **CDN integration**: Distribución global de assets

**Backend Performance**
- **Database indexing**: Índices optimizados para queries frecuentes
- **Caching strategy**: Redis para sesiones y datos cacheables
- **Connection pooling**: Gestión eficiente de conexiones a BD
- **API rate limiting**: Protección y distribución equitativa de recursos

### �🚀 Inicio Rápido

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

## Estructura del Proyecto

```
ecommerce-hack/
├── frontend/          # Next.js App Router
│   ├── src/
│   │   ├── app/       # Rutas: auth/, cart/, categories/, products/
│   │   ├── components/ # Componentes React
│   │   ├── hooks/     # Custom hooks
│   │   ├── store/     # Estado global (Zustand)
│   │   ├── lib/       # Utilidades y API client
│   │   └── types/     # Tipos TypeScript
│   └── README.md      # Guía específica del frontend
├── backend/           # NestJS con Clean Architecture
│   ├── src/
│   │   ├── domain/       # Entidades y reglas de negocio
│   │   ├── application/   # Casos de uso y DTOs
│   │   ├── infrastructure/ # Implementaciones concretas
│   │   ├── presentation/  # Controllers y API
│   │   └── shared/        # Utilidades compartidas
│   ├── prisma/        # Schema y migraciones
│   └── README.md      # Guía específica del backend
├── docs/              # Documentación adicional
└── README.md          # Este archivo
```

## Características Principales
## 🔥 Características Principales

### Backend (NestJS + Clean Architecture)
- ✅ **Clean Architecture** con 4 capas bien definidas
- ✅ **Autenticación JWT** completa con refresh tokens
- ✅ **Gestión de usuarios** con roles (Admin, User, Vendor)
- ✅ **Catálogo especializado** en herramientas de ciberseguridad
- ✅ **Sistema de categorías** jerárquico
- ✅ **Carrito de compras** persistente
- ✅ **Gestión de pedidos** y pagos
- ✅ **API documentada** con Swagger
- ✅ **Testing** unitario y de integración

### Frontend (Next.js)
- ✅ **Especializado** en herramientas de ciberseguridad
- ✅ **Diseño responsive** con Tailwind CSS
- ✅ **Estado global** con Zustand
- ✅ **Formularios** con React Hook Form + Zod
- ✅ **Autenticación** de usuarios
- ✅ **Catálogo técnico** con filtros especializados
- ✅ **Carrito de compras** funcional
- ✅ **Proceso de checkout** multi-paso
- ✅ **Panel administrativo** básico

## 🔐 Usuarios por Defecto

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@cybersec-store.com | admin123 |
| Usuario | hacker@pro.com | user123 |

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

### Backend (90% completado - Clean Architecture)
- ✅ Estructura Clean Architecture implementada
- ✅ Entidades de dominio completas
- ✅ Configuración de Prisma y PostgreSQL
- ✅ Todos los casos de uso implementados
- ✅ Repositories completos
- ✅ Controllers API funcionales
- ✅ Autenticación JWT con refresh tokens
- ✅ Gestión de usuarios con roles
- ✅ Catálogo de productos especializado
- ✅ Sistema de categorías jerárquico
- ✅ Carrito de compras persistente
- ✅ Gestión de pedidos y pagos
- ✅ API documentada con Swagger
- ✅ CORS configurado
- ✅ Testing unitario 

### Frontend (85% completado)
- ✅ Estructura base configurada
- ✅ Metadata actualizada a "Ecommerce Hak 6"
- ✅ Sistema de diseño con Tailwind
- ✅ Estado global con Zustand
- ✅ Rutas implementadas: auth, cart, categories, products
- ✅ Componentes UI reutilizables
- ✅ Integración con backend funcionando
- ✅ Autenticación de usuarios
- ✅ Catálogo técnico con filtros
- ✅ Carrito de compras funcional
- ✅ Formularios con validación
- ✅ Panel administrativo en desarrollo
- ✅ Testing
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

sebastian yepes padilla
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
