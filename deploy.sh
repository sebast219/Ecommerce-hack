#!/bin/bash

# Script de despliegue para Ecommerce Hack
# Despliega backend en Railway y frontend en Vercel

echo "🚀 Iniciando despliegue de Ecommerce Hack en la nube..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar herramientas necesarias
echo "📋 Verificando herramientas necesarias..."

if ! command_exists npm; then
    echo -e "${RED}❌ npm no está instalado. Por favor instala Node.js y npm.${NC}"
    exit 1
fi

if ! command_exists git; then
    echo -e "${RED}❌ git no está instalado. Por favor instala git.${NC}"
    exit 1
fi

if ! command_exists railway; then
    echo -e "${YELLOW}⚠️  Railway CLI no está instalado. Instalando...${NC}"
    npm install -g @railway/cli
fi

if ! command_exists vercel; then
    echo -e "${YELLOW}⚠️  Vercel CLI no está instalado. Instalando...${NC}"
    npm install -g vercel
fi

# Build del backend
echo "🔨 Build del backend..."
cd backend
npm ci
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el build del backend${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build del backend exitoso${NC}"

# Build del frontend
echo "🔨 Build del frontend..."
cd ../frontend
npm ci
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el build del frontend${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build del frontend exitoso${NC}"

cd ..

# Desplegar backend en Railway
echo "🚂 Desplegando backend en Railway..."
cd backend

# Verificar si está logueado en Railway
if ! railway whoami >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  No estás logueado en Railway. Por favor ejecuta 'railway login' primero.${NC}"
    echo "🔗 Abriendo login en navegador..."
    railway login
fi

# Crear proyecto si no existe
echo "📦 Creando/Verificando proyecto Railway..."
railway init --name ecommerce-hack-backend || echo "Proyecto ya existe"

# Desplegar
railway up
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el despliegue del backend${NC}"
    exit 1
fi

# Obtener URL del backend
BACKEND_URL=$(railway domains list | head -n 1 | awk '{print $1}')
echo -e "${GREEN}✅ Backend desplegado en: ${BACKEND_URL}${NC}"

cd ..

# Configurar variables de entorno para frontend
echo "⚙️  Configurando variables de entorno para frontend..."
cd frontend

# Actualizar .env.local con la URL del backend
echo "NEXT_PUBLIC_API_URL=https://${BACKEND_URL}" > .env.local

# Desplegar frontend en Vercel
echo "🌐 Desplegando frontend en Vercel..."

# Verificar si está logueado en Vercel
if ! vercel whoami >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  No estás logueado en Vercel. Por favor ejecuta 'vercel login' primero.${NC}"
    echo "🔗 Abriendo login en navegador..."
    vercel login
fi

# Desplegar
vercel --prod
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el despliegue del frontend${NC}"
    exit 1
fi

# Obtener URL del frontend
FRONTEND_URL=$(vercel ls --prod | grep ecommerce-hack | head -n 1 | awk '{print $2}')
echo -e "${GREEN}✅ Frontend desplegado en: ${FRONTEND_URL}${NC}"

cd ..

echo ""
echo "🎉 Despliegue completado!"
echo ""
echo "📱 URLs de acceso:"
echo -e "   Frontend: ${GREEN}${FRONTEND_URL}${NC}"
echo -e "   Backend:  ${GREEN}https://${BACKEND_URL}${NC}"
echo ""
echo "👤 Usuarios de prueba:"
echo "   Admin: admin@cybersec-store.com / admin123"
echo "   User:  hacker@pro.com / user123"
echo ""
echo "📝 Notas:"
echo "   - La base de datos PostgreSQL fue creada automáticamente por Railway"
echo "   - Los datos de prueba fueron cargados via seed script"
echo "   - Puede tomar hasta 5 minutos para que la aplicación esté completamente disponible"
