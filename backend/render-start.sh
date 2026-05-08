#!/bin/bash

# Script de inicio para Render
# Esperar a que la base de datos esté disponible antes de iniciar la aplicación

echo "🚀 Iniciando backend de Ecommerce Hack en Render..."

# Esperar a que PostgreSQL esté disponible
echo "⏳ Esperando a que PostgreSQL esté disponible..."
until nc -z $DATABASE_HOST $DATABASE_PORT; do
  echo "PostgreSQL no está disponible aún - esperando..."
  sleep 2
done

echo "✅ PostgreSQL está disponible!"

# Generar Prisma Client
echo "🔧 Generando Prisma Client..."
npx prisma generate

# Ejecutar migraciones (solo en producción)
if [ "$NODE_ENV" = "production" ]; then
  echo "🗄️  Ejecutando migraciones de base de datos..."
  npx prisma migrate deploy
fi

# Seed de datos (solo si no hay datos)
echo "🌱 Verificando si se necesita seed de datos..."
USER_COUNT=$(npx prisma db execute --stdin --schema=./prisma/schema.prisma <<EOF
SELECT COUNT(*) as count FROM "User";
EOF
 | grep -o '[0-9]\+' | head -1)

if [ "$USER_COUNT" -eq 0 ]; then
  echo "🌱 Ejecutando seed de datos..."
  npm run prisma:seed
else
  echo "✅ Base de datos ya contiene datos"
fi

# Iniciar la aplicación
echo "🎯 Iniciando aplicación..."
npm run start:prod
