# 🎯 PLAN DE ACCIÓN - RECONSTRUCCIÓN REAL

## 📋 SITUACIÓN ACTUAL
- **100% del código fue generado por IA**
- **0% lo escribiste tú**
- **Necesitas aprender desde cero**

## 🚀 OBJETIVO
Convertirte en un desarrollador real que entiende y escribe su propio código.

---

## 📅 SEMANA 1: FUNDAMENTOS FRONTEND

### Día 1-2: Componente ProductCard
**Archivo**: `frontend/src/components/product/product-card.tsx`

#### Tareas:
1. **PASO 1 - ESTRUCTURA BÁSICA**
   ```typescript
   // Implementar el layout responsive
   className={viewMode === 'grid' ? 'w-full' : 'flex gap-4'}
   ```

2. **PASO 2 - IMAGEN DEL PRODUCTO**
   ```typescript
   <img
     src={product.images[0] || '/placeholder.jpg'}
     alt={product.name}
     className="w-full h-48 object-cover rounded"
   />
   ```

3. **PASO 3 - INFORMACIÓN**
   ```typescript
   // Mostrar name, description truncada, price formateado
   <p className="line-clamp-2">{product.description}</p>
   <p>${product.price.toFixed(2)}</p>
   ```

4. **PASO 4 - ESTADO INVENTARIO**
   ```typescript
   {product.inventory?.quantity > 0 ? (
     <span className="text-green-600">En stock</span>
   ) : (
     <span className="text-red-600">Agotado</span>
   )}
   ```

5. **PASO 5 - BOTÓN CARRITO**
   ```typescript
   const { addItem } = useCartStore();
   const handleAddToCart = () => addItem(product, 1);
   ```

### Día 3-4: Cart Store
**Archivo**: `frontend/src/store/cart-store.ts`

#### Implementar:
1. **addItem con lógica de duplicados**
2. **removeItem con filter**
3. **updateQuantity con validación**
4. **getTotal con reduce**
5. **getItemCount con reduce**

### Día 5-7: Custom Hook
**Archivo**: `frontend/src/hooks/use-products.ts`

#### Implementar:
1. **fetchProducts con fetch nativo**
2. **Manejo de estados loading/error**
3. **URLSearchParams para filtros**
4. **useEffect para carga inicial**

---

## 📅 SEMANA 2: FUNDAMENTOS BACKEND

### Día 1-3: Products Service
**Archivo**: `backend/src/modules/products/products.service.ts`

#### Implementar:
1. **create con validación SKU**
2. **findAll con filtros dinámicos**
3. **findOne con relaciones**
4. **update con validación**

#### Conceptos a aprender:
- Prisma queries básicas
- Manejo de excepciones
- Soft delete vs hard delete

### Día 4-5: Transacciones
**Archivo**: `backend/src/modules/products/products.service.ts`

#### Implementar:
1. **decreaseInventory con $transaction**
2. **increaseInventory con validación**
3. **Manejo de concurrencia**

### Día 6-7: DTOs y Validación
**Archivos**: `backend/src/modules/products/dto/`

#### Crear:
1. **create-product.dto.ts con validaciones**
2. **update-product.dto.ts con partial**
3. **filter-product.dto.ts con tipos opcionales**

---

## 📅 SEMANA 3: INTEGRACIÓN

### Día 1-3: Conectar Frontend-Backend
**Tareas**:
1. **Configurar API client real**
2. **Conectar use-products con backend**
3. **Manejar errores reales**
4. **Implementar loading states**

### Día 4-5: Testing Básico
**Tareas**:
1. **Unit test para cart store**
2. **Unit test para products service**
3. **Integration test para API**

### Día 6-7: Optimización
**Tareas**:
1. **React.memo para ProductCard**
2. **useCallback para handlers**
3. **Query optimization en Prisma**

---

## 🎯 METAS DE APRENDIZAJE

### Semana 1:
- ✅ Entender React hooks
- ✅ Manejar estado con Zustand
- ✅ Component composition
- ✅ Tailwind CSS

### Semana 2:
- ✅ NestJS architecture
- ✅ Prisma ORM
- ✅ Business logic
- ✅ Error handling

### Semana 3:
- ✅ API integration
- ✅ Testing fundamentals
- ✅ Performance basics

---

## 🔥 EJERCICIOS PRÁCTICOS

### Ejercicio 1: "Romper y Arreglar"
1. **Intencionalmente rompe** el ProductCard
2. **Arregla sin ayuda de IA**
3. **Aprende a debuggear**

### Ejercicio 2: "Feature desde Cero"
1. **Implementa sistema de favoritos**
2. **Crea el store desde cero**
3. **Conecta con backend**

### Ejercicio 3: "Optimización Real"
1. **Identifica cuellos de botella**
2. **Implementa memoización**
3. **Mide mejoras**

---

## 📚 RECURSOS DE APRENDIZAJE

### Documentación Oficial:
- [React Docs](https://react.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)

### Conceptos Clave:
- **React**: useState, useEffect, useCallback, useMemo
- **TypeScript**: Interfaces, Generics, Utility Types
- **NestJS**: Dependency Injection, Modules, Controllers
- **Prisma**: Queries, Relations, Transactions

---

## ⚠️ REGLAS DE ORO

### 1. NO USES IA PARA ESCRIBIR CÓDIGO
- Usa IA solo para **explicar conceptos**
- Usa IA solo para **debuggear errores específicos**
- **NUNCA** para generar código completo

### 2. ESCRIBE CADA LÍNEA
- **Escribe tú mismo** cada función
- **Entiende** cada línea que escribes
- **Explica con tus palabras** lo que hace

### 3. ROMPE COSAS INTENCIONALMENTE
- **Borra código** y reescríbelo
- **Crea errores** y arréglalos
- **Experimenta** sin miedo

### 4. MIDE TU PROGRESO
- **Antes**: No podías escribir un componente
- **Después**: Puedes construir features completas
- **Documenta** tu aprendizaje

---

## 🎉 RESULTADO ESPERADO

**Después de 3 semanas:**
- ✅ **Escribes código React real**
- ✅ **Entiendes NestJS architecture**
- ✅ **Manejas estado global**
- ✅ **Construyes APIs REST**
- ✅ **Debuggeas problemas reales**
- ✅ **Tienes un proyecto funcional que YOU built**

**Este será TU primer proyecto real.** No de plantillas, no de copiar-pegar. **TUYO.**

---

## 🚀 EMPIEZA AHORA

**Tu primera tarea:**
1. Abre `product-card.tsx`
2. Borra todo el código que no son comentarios
3. Implementa el PASO 1: estructura básica
4. No uses IA, no busques en Google
5. **Usa solo tu cerebro**

**¿Listo para convertirte en un desarrollador de verdad?**
