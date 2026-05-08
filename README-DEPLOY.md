# 🚀 Guía de Despliegue en la Nube

Este documento explica cómo desplegar la aplicación Ecommerce Hack en la nube para que puedas probarla desde cualquier PC.

## 📋 Arquitectura de Despliegue

- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (NestJS + PostgreSQL)
- **Base de Datos**: PostgreSQL (provista por Railway)

## 🔧 Requisitos Previos

1. **Node.js** (v18 o superior)
2. **Git**
3. **Cuentas en los servicios:**
   - [Vercel](https://vercel.com) (gratuito con GitHub)
   - [Railway](https://railway.app) (gratuito con GitHub)

## 🚀 Despliegue Automatizado

### Opción 1: Usar el Script (Recomendado)

**Para Windows:**
```cmd
deploy.cmd
```

**Para macOS/Linux:**
```bash
./deploy.sh
```

El script automatizará:
- ✅ Build del backend y frontend
- ✅ Despliegue del backend en Railway
- ✅ Configuración de variables de entorno
- ✅ Despliegue del frontend en Vercel
- ✅ URLs de acceso

### Opción 2: Despliegue Manual

#### 1. Desplegar Backend en Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login en Railway
railway login

# Ir al directorio del backend
cd backend

# Inicializar proyecto
railway init --name ecommerce-hack-backend

# Desplegar
railway up

# Obtener URL del backend
railway domains list
```

#### 2. Configurar Variables de Entorno en Railway

En el dashboard de Railway, configura estas variables:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=tu-super-secreto-jwt-produccion
JWT_REFRESH_SECRET=tu-super-secreto-refresh-produccion
DATABASE_URL=postgresql://postgres:password@host:port/database
CORS_ORIGIN=https://ecommerce-hack.vercel.app
FRONTEND_URL=https://ecommerce-hack.vercel.app
```

#### 3. Desplegar Frontend en Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login en Vercel
vercel login

# Ir al directorio del frontend
cd frontend

# Configurar variables de entorno
echo "NEXT_PUBLIC_API_URL=https://tu-backend-url.railway.app" > .env.local

# Desplegar
vercel --prod
```

## 🔗 URLs de Acceso

Una vez completado el despliegue:

- **Frontend**: `https://ecommerce-hack.vercel.app`
- **Backend**: `https://tu-backend-url.railway.app`
- **API Docs**: `https://tu-backend-url.railway.app/api/docs`

## 👤 Usuarios de Prueba

La aplicación incluye usuarios preconfigurados:

| Rol | Email | Password |
|-----|-------|----------|
| Admin | `admin@cybersec-store.com` | `admin123` |
| User | `hacker@pro.com` | `user123` |

## 📊 Datos de Prueba

El script de seed incluye:
- 11 categorías de productos de ciberseguridad
- 40+ productos reales (Hak5, Flipper Zero, etc.)
- Inventario y precios configurados
- Imágenes y descripciones detalladas

## 🔧 Configuración Adicional

### Variables de Entorno del Frontend

```env
NEXT_PUBLIC_API_URL=https://tu-backend-url.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Variables de Entorno del Backend

```env
DATABASE_URL=postgresql://...
JWT_SECRET=super-secreto
JWT_REFRESH_SECRET=super-secreto-refresh
CORS_ORIGIN=https://ecommerce-hack.vercel.app
STRIPE_SECRET_KEY=sk_test_...
```

## 🐛 Solución de Problemas

### Backend no responde
1. Verifica los logs en Railway dashboard
2. Confirma que la base de datos PostgreSQL está corriendo
3. Revisa las variables de entorno

### Frontend no conecta con Backend
1. Verifica `NEXT_PUBLIC_API_URL` en Vercel
2. Confirma configuración CORS en el backend
3. Revisa que el backend esté corriendo

### Error de Build
1. Limpia caché: `npm cache clean --force`
2. Borra `node_modules` y reinstala
3. Verifica versiones de Node.js

## 📱 Prueba desde Otros Dispositivos

1. Abre la URL del frontend en cualquier navegador
2. Usa los usuarios de prueba para iniciar sesión
3. Prueba las funcionalidades principales:
   - Navegación de productos
   - Carrito de compras
   - Registro y login
   - Panel de administrador

## 💰 Costos Estimados

- **Vercel**: Gratuito (hobby tier)
- **Railway**: ~$5-20/mes (depende del uso)
- **Dominio personal**: Opcional (~$10/año)

## 🔄 Actualizaciones

Para actualizar la aplicación:

```bash
# Hacer cambios en el código
git add .
git commit -m "Update: descripción del cambio"
git push origin main

# Redesplegar automáticamente
cd backend && railway up
cd ../frontend && vercel --prod
```

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en Railway y Vercel
2. Verifica la configuración de CORS
3. Confirma las variables de entorno
4. Prueba localmente primero

---

**Nota**: Este despliegue es para desarrollo y pruebas. Para producción, considera configurar dominios personalizados, SSL adicional, y monitoreo.
