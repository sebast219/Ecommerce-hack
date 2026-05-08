# 🚀 Guía de Configuración para Render

Este documento explica cómo configurar el backend de Ecommerce Hack en Render.com.

## 📋 Requisitos Previos

1. **Cuenta en Render.com** (gratuito)
2. **Repositorio en GitHub** con el código del backend
3. **Node.js 18+** configurado en el proyecto

## 🔧 Configuración Previa

Ya he preparado los siguientes archivos:

### 1. `backend/render.yaml`
```yaml
services:
  - type: web
    name: ecommerce-hack-backend
    env: node
    buildCommand: npm ci && npm run build
    startCommand: npm run render:start
    healthCheckPath: /health/ready
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: ecommerce-hack-db
          property: connectionString
      - key: CORS_ORIGIN
        value: https://ecommerce-hack-sage.vercel.app
      - key: FRONTEND_URL
        value: https://ecommerce-hack-sage.vercel.app

  - type: pserv
    name: ecommerce-hack-db
    database:
      postgresqlVersion: "15"
```

### 2. `backend/render-start.sh`
Script personalizado para iniciar la aplicación en Render.

## 🚀 Pasos para Desplegar en Render

### Paso 1: Crear Cuenta en Render

1. Ve a [Render.com](https://render.com)
2. Regístrate con tu cuenta de GitHub
3. Verifica tu email

### Paso 2: Conectar Repositorio

1. En el dashboard de Render, haz clic en **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio GitHub: `sebast219/Ecommerce-hack`
4. Selecciona el branch `main`

### Paso 3: Configurar el Web Service

**Basic Settings:**
- **Name**: `ecommerce-hack-backend`
- **Environment**: `Node`
- **Root Directory**: `backend`
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run render:start`

**Advanced Settings:**
- **Health Check Path**: `/health/ready`
- **Auto-Deploy**: ✅ Activado

### Paso 4: Configurar Variables de Entorno

Agrega estas variables de entorno:

```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://ecommerce-hack-sage.vercel.app
FRONTEND_URL=https://ecommerce-hack-sage.vercel.app
```

Render generará automáticamente:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET` 
- `DATABASE_URL` (cuando crees la base de datos)

### Paso 5: Crear Base de Datos PostgreSQL

1. En el dashboard de Render, haz clic en **"New +"**
2. Selecciona **"PostgreSQL"**
3. **Name**: `ecommerce-hack-db`
4. **Database Name**: `ecommerce`
5. **User**: `postgres`
6. **Version**: `PostgreSQL 15`
7. Haz clic en **"Create Database"**

### Paso 6: Conectar Base de Datos al Backend

1. Ve a tu web service `ecommerce-hack-backend`
2. Haz clic en **"Environment"**
3. Agrega la variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Selecciona `ecommerce-hack-db` de la lista desplegable

### Paso 7: Desplegar

1. Haz commit y push de los cambios:
   ```bash
   git add .
   git commit -m "feat: agregar configuración para Render"
   git push origin main
   ```

2. Render detectará los cambios y comenzará el despliegue automáticamente

### Paso 8: Verificar Despliegue

Una vez completado el despliegue:

1. **URL del Backend**: `https://ecommerce-hack-backend.onrender.com`
2. **Health Check**: `https://ecommerce-hack-backend.onrender.com/health/ready`
3. **API Docs**: `https://ecommerce-hack-backend.onrender.com/api/docs`

## 🔄 Actualizar Frontend

Una vez que el backend esté funcionando:

1. Actualiza la variable en Vercel:
   ```env
   NEXT_PUBLIC_API_URL=https://ecommerce-hack-backend.onrender.com
   ```

2. Redespliega el frontend:
   ```bash
   cd frontend
   vercel --prod
   ```

## 🐛 Solución de Problemas

### Error: Build Failed
- Revisa los logs en Render
- Verifica que `package.json` tenga el script `render:start`

### Error: Database Connection
- Confirma que `DATABASE_URL` esté configurada correctamente
- Verifica que la base de datos esté en estado "Available"

### Error: CORS
- Confirma que `CORS_ORIGIN` incluya la URL del frontend
- Revisa los logs del backend para errores de CORS

### Error: Health Check Failed
- Verifica que el endpoint `/health/ready` exista
- Confirma que el puerto sea `3001`

## 📱 URLs Finales

- **Frontend**: `https://ecommerce-hack-sage.vercel.app`
- **Backend**: `https://ecommerce-hack-backend.onrender.com`
- **Base de Datos**: PostgreSQL en Render

## 👤 Usuarios de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | `admin@cybersec-store.com` | `admin123` |
| User | `hacker@pro.com` | `user123` |

## 💰 Costos

- **Render Web Service**: Gratuito (limitado a 750 horas/mes)
- **PostgreSQL**: Gratuito (limitado a 90 días)
- **Total**: Gratuito para desarrollo y pruebas

---

**Nota**: Render tiene un plan gratuito muy generoso que es perfecto para desarrollo y pruebas de esta aplicación.
