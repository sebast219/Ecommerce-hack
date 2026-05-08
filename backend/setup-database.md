# Configuración de Base de Datos para Backend

## Opción 1: Railway (Gratis y simple)
1. Ve a https://railway.app
2. Crea cuenta con GitHub
3. Crea nuevo proyecto → PostgreSQL
4. Copia la URL de conexión

## Opción 2: Supabase (Gratis)
1. Ve a https://supabase.com
2. Crea proyecto nuevo
3. Ve a Settings → Database
4. Copia la Connection string

## Opción 3: Neon (Gratis)
1. Ve a https://neon.tech
2. Crea cuenta
3. Crea nuevo proyecto
4. Copia la Connection string

## Configurar .env
Una vez tengas la URL, actualiza tu .env:
```
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
```

## Ejecutar migraciones
```bash
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```
