@echo off
REM Script de despliegue para Ecommerce Hack en Windows
REM Despliega backend en Railway y frontend en Vercel

echo 🚀 Iniciando despliegue de Ecommerce Hack en la nube...

REM Verificar herramientas necesarias
echo 📋 Verificando herramientas necesarias...

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado. Por favor instala Node.js y npm.
    exit /b 1
)

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ git no está instalado. Por favor instala git.
    exit /b 1
)

where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Railway CLI no está instalado. Instalando...
    npm install -g @railway/cli
)

where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Vercel CLI no está instalado. Instalando...
    npm install -g vercel
)

REM Build del backend
echo 🔨 Build del backend...
cd backend
call npm ci
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del backend
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo ❌ Error en el build del backend
    exit /b 1
)
echo ✅ Build del backend exitoso

REM Build del frontend
echo 🔨 Build del frontend...
cd ..\frontend
call npm ci
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del frontend
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo ❌ Error en el build del frontend
    exit /b 1
)
echo ✅ Build del frontend exitoso

cd ..

REM Desplegar backend en Railway
echo 🚂 Desplegando backend en Railway...
cd backend

REM Verificar si está logueado en Railway
railway whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  No estás logueado en Railway. Por favor ejecuta 'railway login' primero.
    echo 🔗 Abriendo login en navegador...
    railway login
)

REM Crear proyecto si no existe
echo 📦 Creando/Verificando proyecto Railway...
railway init --name ecommerce-hack-backend || echo Proyecto ya existe

REM Desplegar
railway up
if %errorlevel% neq 0 (
    echo ❌ Error en el despliegue del backend
    exit /b 1
)

REM Obtener URL del backend
for /f "tokens=1" %%i in ('railway domains list') do set BACKEND_URL=%%i
echo ✅ Backend desplegado en: https://%BACKEND_URL%

cd ..

REM Configurar variables de entorno para frontend
echo ⚙️  Configurando variables de entorno para frontend...
cd frontend

REM Actualizar .env.local con la URL del backend
echo NEXT_PUBLIC_API_URL=https://%BACKEND_URL% > .env.local

REM Desplegar frontend en Vercel
echo 🌐 Desplegando frontend en Vercel...

REM Verificar si está logueado en Vercel
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  No estás logueado en Vercel. Por favor ejecuta 'vercel login' primero.
    echo 🔗 Abriendo login en navegador...
    vercel login
)

REM Desplegar
vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Error en el despliegue del frontend
    exit /b 1
)

echo.
echo 🎉 Despliegue completado!
echo.
echo 📱 URLs de acceso:
echo    Frontend: https://ecommerce-hack.vercel.app
echo    Backend:  https://%BACKEND_URL%
echo.
echo 👤 Usuarios de prueba:
echo    Admin: admin@cybersec-store.com / admin123
echo    User:  hacker@pro.com / user123
echo.
echo 📝 Notas:
echo    - La base de datos PostgreSQL fue creada automáticamente por Railway
echo    - Los datos de prueba fueron cargados via seed script
echo    - Puede tomar hasta 5 minutos para que la aplicación esté completamente disponible

pause
