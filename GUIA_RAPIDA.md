# 🚀 Guía Rápida de Inicio

## ⚡ Setup en 5 Minutos

### 1. Clonar y Configurar
```bash
git clone <repository-url>
cd ecommerce-hack
```

### 2. Backend (NestJS + PostgreSQL)
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tu DATABASE_URL
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```
📍 **Backend corriendo en**: http://localhost:3001

### 3. Frontend (Next.js)
```bash
cd ../frontend
npm install
cp .env.example .env.local
# Editar .env.local con NEXT_PUBLIC_API_URL
npm run dev
```
📍 **Frontend corriendo en**: http://localhost:3000

---

## 🔑 Acceso por Defecto

| Rol | Email | Contraseña | Acceso |
|-----|-------|------------|--------|
| Admin | admin@cybersec-store.com | admin123 | Panel completo |
| User | hacker@pro.com | user123 | Compras |

---

## 🎯 URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Documentación API**: http://localhost:3001/api/v1/docs
- **Prisma Studio**: http://localhost:5555

---

## 🛠️ Comandos Esenciales

### Backend
```bash
npm run start:dev    # Desarrollo
npm run build        # Compilar
npm run test         # Tests
npm run prisma:studio # DB UI
```

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Compilar
npm run lint         # Linting
npm run type-check   # Tipado
```

---

## 📦 Productos Pre-cargados

### Herramientas de Ciberseguridad
- **USB Rubber Ducky** - $45.99
- **WiFi Pineapple** - $299.99
- **Bash Bunny** - $79.99
- **Flipper Zero** - $169.99
- **LAN Turtle** - $49.99
- **Packet Squirrel** - $129.99

---

## 🔧 Problemas Comunes

### Database Connection
```bash
# Verificar PostgreSQL
psql -h localhost -U postgres -d ecommerce

# Resetear base de datos
npm run prisma:migrate:reset
npm run prisma:seed
```

### Port Issues
```bash
# Matar proceso en puerto 3000
npx kill-port 3000

# Matar proceso en puerto 3001
npx kill-port 3001
```

---

## 🚀 Deploy Rápido

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Conectar repo a Vercel
```

### Backend (Railway)
```bash
cd backend
npm run build
# Conectar repo a Railway
```

---

## 📞 Ayuda Rápida

- **Docs Completas**: [DOCUMENTACION_TECNICA.md](./DOCUMENTACION_TECNICA.md)
- **API Docs**: http://localhost:3001/api/v1/docs
- **Issues**: GitHub Issues
- **Soporte**: Discord del proyecto

---

**¡Listo! 🎉 Tu plataforma de ciberseguridad está funcionando.**
