# 🎓 Guía de Aprendizaje - Backend NestJS

## 📋 Resumen del Proyecto

Has transformado tu backend generado por IA en **ejercicios prácticos de aprendizaje**. Cada archivo ahora contiene esqueletos con guías paso a paso para que escribas código real y aprendas haciendo.

## 🏗️ Arquitectura del Ejercicio

```
src/modules/
├── auth/
│   ├── auth.service.ts ✅ (Ejercicio completo)
│   ├── auth.controller.ts ✅ (Ejercicio completo)
│   └── dto/
│       ├── login.dto.ts ✅ (Mejorado)
│       └── register.dto.ts ✅ (Mejorado)
├── products/
│   ├── products.service.ts ✅ (Ejercicio completo)
│   ├── products.controller.ts ✅ (Ejercicio completo)
│   └── dto/
│       └── create-product.dto.ts ✅ (Mejorado)
└── [otros módulos por transformar]
```

## 🎯 Objetivos de Aprendizaje

### 1. **Services - Lógica de Negocio**
Aprenderás a:
- Escribir business logic real
- Usar Prisma ORM para operaciones CRUD
- Implementar validaciones y manejo de errores
- Usar transacciones para consistencia de datos

### 2. **Controllers - Endpoints RESTful**
Aprenderás a:
- Crear endpoints RESTful siguiendo convenciones
- Usar decorators de NestJS (@Get, @Post, @Patch, @Delete)
- Implementar autenticación y autorización
- Documentar APIs con Swagger

### 3. **DTOs - Validación de Datos**
Aprenderás a:
- Validar inputs con class-validator
- Sanitizar datos para seguridad
- Crear reglas de negocio complejas
- Transformar datos automáticamente

## 📚 Ruta de Aprendizaje Sugerida

### 🔥 Nivel 1: Básico (Empieza aquí)

#### 1.1 Implementar `products.service.ts`
```typescript
// Comienza con el método más simple: findOne()
async findOne(id: string) {
  // PASO 1: Busca el producto
  const product = await this.prisma.product.findUnique({
    where: { id },
    include: { category: true, inventory: true }
  });
  
  // PASO 2: Maneja el caso de no encontrado
  if (!product) {
    throw new NotFoundException('Product not found');
  }
  
  return product;
}
```

#### 1.2 Implementar `auth.service.ts`
```typescript
// Comienza con validateUser() - es el fundamento
async validateUser(email: string, password: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });
  
  if (user && await bcrypt.compare(password, user.password)) {
    const { password, ...result } = user;
    return result;
  }
  
  return null;
}
```

### 🚀 Nivel 2: Intermedio

#### 2.1 Operaciones CRUD completas
- Implementa `create()` en products.service.ts
- Aprende sobre validación de SKU único
- Crea inventario inicial automáticamente

#### 2.2 Autenticación completa
- Implementa `login()` y `register()`
- Genera JWT tokens
- Maneja refresh tokens

### 🔥 Nivel 3: Avanzado

#### 3.1 Transacciones y Concurrencia
- Implementa `decreaseInventory()` con transacciones
- Aprende sobre race conditions
- Maneja consistencia de datos

#### 3.2 Queries complejas
- Implementa `findAll()` con filtros avanzados
- Aprende sobre paginación
- Optimiza queries con Prisma

## 🛠️ Herramientas y Conceptos

### **Prisma ORM**
```typescript
// Búsqueda básica
await this.prisma.product.findUnique({ where: { id } });

// Búsqueda con relaciones
await this.prisma.product.findMany({
  include: { category: true, inventory: true }
});

// Transacciones
await this.prisma.$transaction(async (tx) => {
  // Operaciones atómicas
});
```

### **NestJS Decorators**
```typescript
@Controller('products')           // Define el controller
@Get(':id')                       // Endpoint GET /products/:id
@Post()                           // Endpoint POST /products
@Body() dto                       // Valida y parsea el body
@Param('id') id                   // Extrae parámetro de URL
@UseGuards(JwtAuthGuard)          // Middleware de autenticación
```

### **Manejo de Errores**
```typescript
// Errores HTTP específicos
throw new NotFoundException('Product not found');
throw new ConflictException('SKU already exists');
throw new UnauthorizedException('Invalid credentials');
```

### **JWT Tokens**
```typescript
// Generar token
const payload = { email: user.email, sub: user.id, role: user.role };
const token = this.jwtService.sign(payload);

// Verificar token
const decoded = this.jwtService.verify(token);
```

## 🎯 Ejercicios Prácticos

### **Ejercicio 1: Crear Producto**
**Archivo:** `products.service.ts` - método `create()`

**Objetivo:** Aprender a crear recursos con validación

```typescript
async create(createProductDto: CreateProductDto) {
  // 1. Verificar SKU único
  const existing = await this.prisma.product.findUnique({
    where: { sku: createProductDto.sku }
  });
  
  if (existing) {
    throw new ConflictException('SKU already exists');
  }
  
  // 2. Crear producto con inventario
  const product = await this.prisma.product.create({
    data: {
      ...createProductDto,
      inventory: {
        create: { quantity: 0, lowStock: 5 }
      }
    }
  });
  
  return product;
}
```

### **Ejercicio 2: Login con JWT**
**Archivo:** `auth.service.ts` - método `login()`

**Objetivo:** Aprender autenticación con tokens

```typescript
async login(loginDto: LoginDto) {
  // 1. Validar credenciales
  const user = await this.validateUser(loginDto.email, loginDto.password);
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }
  
  // 2. Generar tokens
  const payload = { email: user.email, sub: user.id, role: user.role };
  const accessToken = this.jwtService.sign(payload);
  const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
  
  // 3. Retornar respuesta
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user
  };
}
```

### **Ejercicio 3: Filtros Avanzados**
**Archivo:** `products.service.ts` - método `findAll()`

**Objetivo:** Aprender queries dinámicas

```typescript
async findAll(filterDto: FilterProductDto) {
  const { page = 1, limit = 10, search, minPrice, maxPrice } = filterDto;
  const skip = (page - 1) * limit;
  
  // Construir where dinámico
  const where: any = { isActive: true };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }
  
  // Ejecutar queries en paralelo
  const [products, total] = await Promise.all([
    this.prisma.product.findMany({ where, skip, take: limit }),
    this.prisma.product.count({ where })
  ]);
  
  return { products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}
```

## 🔍 Tips de Aprendizaje

### **1. Lee los comentarios guía**
Cada método tiene comentarios detallados explicando:
- **Qué hacer** (el objetivo)
- **Por qué** (el concepto técnico)
- **Cómo** (ejemplos de código)

### **2. Implementa paso a paso**
No intentes implementar todo de una vez:
1. Comienza con la lógica básica
2. Agrega validaciones
3. Maneja errores
4. Optimiza

### **3. Usa console.log()**
Los ejercicios incluyen console.log() para que veas qué se ejecuta:
```typescript
console.log('Implementar create - SKU:', createProductDto.sku);
```

### **4. Prueba cada método**
Usa Swagger UI (http://localhost:3001/api/v1/docs) para probar:
- Los endpoints que implementes
- Diferentes casos (éxito, error, validación)

### **5. Aprende de los errores**
Los errores de validación y negocio son parte del aprendizaje:
- 400 Bad Request = Validación falló
- 401 Unauthorized = No autenticado
- 404 Not Found = Recurso no existe
- 409 Conflict = Conflicto de negocio

## 📈 Próximos Pasos

### **Cuando termines los ejercicios actuales:**

1. **Transforma otros módulos:**
   - `users.service.ts` y `users.controller.ts`
   - `categories.service.ts` y `categories.controller.ts`

2. **Agrega funcionalidades avanzadas:**
   - File upload para imágenes de productos
   - Email notifications
   - Caching con Redis

3. **Implementa testing:**
   - Unit tests para services
   - Integration tests para controllers

4. **Optimización:**
   - Database indexes
   - Query optimization
   - Performance monitoring

## 🎓 Evaluación

### **Para saber si dominas un concepto:**

✅ **Básico:** Puedes implementar CRUD simple  
✅ **Intermedio:** Puedes manejar validaciones y errores  
✅ **Avanzado:** Puedes implementar transacciones y optimización  

### **Proyecto Final:**
Cuando completes todos los ejercicios, tendrás:
- Un backend funcional que escribiste 100%
- Comprensión sólida de NestJS y Prisma
- Experiencia real con autenticación JWT
- Portafolio impresionante para mostrar

---

**¡Recuerda:** El objetivo es aprender, no solo copiar. Tómate tu tiempo, experimenta, y no temas cometer errores. ¡Eso es parte del proceso de aprendizaje! 🚀
