# 🛍️ E-commerce Cybersecurity Store - Monorepo

Plataforma de comercio electrónico especializada en herramientas de ciberseguridad con arquitectura monorepo limpia.

## 📁 Estructura del Proyecto

```
ecommerce-hack/
├── 📄 README.md                 # Documentación principal del monorepo
├── 📄 diagrama-flujo-datos.md    # Diagramas de flujo del sistema
├── 📄 DOCUMENTACION_TECNICA.md   # Documentación técnica detallada
├── 📄 GUIA_RAPIDA.md            # Guía rápida de inicio
├── 📄 ENTREGA-3-RESUMEN.md      # Resumen de la entrega 3
├── 📄 vercel.json               # Configuración de despliegue
├── 📄 .gitignore                # Ignorar archivos
├── 📁 .github/                  # Workflows de GitHub
├── 📁 frontend/                 # Aplicación Next.js
│   ├── 📄 package.json
│   ├── 📄 next.config.js
│   ├── 📄 tsconfig.json
│   ├── 📄 tailwind.config.ts
│   ├── 📄 .env.local
│   └── 📁 src/
│       ├── 📁 app/
│       ├── 📁 components/
│       └── 📁 lib/
└── 📁 backend/                  # Aplicación NestJS
    ├── 📄 package.json
    ├── 📄 nest-cli.json
    ├── 📄 tsconfig.json
    ├── 📄 .env
    ├── 📁 src/
    │   ├── 📁 domain/
    │   ├── 📁 application/
    │   ├── 📁 infrastructure/
    │   └── 📁 presentation/
    └── 📁 prisma/
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- PostgreSQL
- Git

### Instalación y Ejecución

1. **Clonar el repositorio**
```bash
git clone https://github.com/sebast219/Ecommerce-hack.git
cd Ecommerce-hack
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Configurar variables de entorno del backend**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. **Ejecutar migraciones de base de datos**
```bash
npx prisma migrate dev
```

5. **Crear usuarios administradores**
```bash
npx ts-node create-admin.ts
```

6. **Iniciar backend**
```bash
npm run start:dev
```

7. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

8. **Configurar variables de entorno del frontend**
```bash
cp .env.local.example .env.local
# Editar .env.local con la URL del backend
```

9. **Iniciar frontend**
```bash
npm run dev
```

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **Documentación API**: http://localhost:3001/api/v1/docs

## 👤 Usuarios de Prueba

### Administrador
- **Email**: admin@cybersec-store.com
- **Contraseña**: admin123

### Usuario Regular
- **Email**: hacker@pro.com
- **Contraseña**: user123

## 🏗️ Arquitectura

### Stack Tecnológico
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + Zustand
- **Backend**: NestJS + TypeScript + Prisma ORM + PostgreSQL
- **Arquitectura**: Clean Architecture (Domain, Application, Infrastructure, Presentation)
- **Autenticación**: JWT con refresh tokens
- **Pagos**: Integración con Stripe

### Clean Architecture
1. **Domain**: Entidades puras sin dependencias externas
2. **Application**: Casos de uso y lógica de negocio
3. **Infrastructure**: Base de datos, APIs externas
4. **Presentation**: Controllers, middleware y API REST

## 🔧 Scripts Útiles

### Backend
```bash
npm run start:dev      # Iniciar en modo desarrollo
npm run build         # Compilar para producción
npm run test          # Ejecutar tests
npx prisma studio     # Abrir Prisma Studio
```

### Frontend
```bash
npm run dev           # Iniciar en modo desarrollo
npm run build         # Compilar para producción
npm run start         # Iniciar producción
npm run lint          # Ejecutar linter
```

## 📚 Documentación

- **[Diagrama de Flujo](./diagrama-flujo-datos.md)**: Flujo de datos del sistema
- **[Documentación Técnica](./DOCUMENTACION_TECNICA.md)**: Detalles técnicos
- **[Guía Rápida](./GUIA_RAPIDA.md)**: Guía de inicio rápido
- **[Resumen Entrega 3](./ENTREGA-3-RESUMEN.md)**: Resumen de la entrega final

## 🚀 Despliegue

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
npm start
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.
