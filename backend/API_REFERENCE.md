# 📚 API Reference - eCommerce Backend

## 🔗 Base URL

```
Development: http://localhost:3001/api/v1
Production: https://your-domain.com/api/v1
```

## 🔐 Autenticación

### Headers requeridos para endpoints protegidos:
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 📝 Endpoints

### 🔑 Autenticación (`/auth`)

#### POST `/auth/login`
Inicia sesión de usuario.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

**Errors:**
- `401 Unauthorized` - Credenciales inválidas

---

#### POST `/auth/register`
Registra un nuevo usuario.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "new_user_id",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "USER"
  }
}
```

**Errors:**
- `409 Conflict` - Email ya existe
- `400 Bad Request` - Validación falló

---

#### POST `/auth/refresh`
Renueva el access token usando refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "access_token": "new_access_token",
  "refresh_token": "new_refresh_token"
}
```

---

#### GET `/auth/profile`
Obtiene el perfil del usuario autenticado.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### POST `/auth/logout`
Cierra la sesión del usuario.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### 📦 Productos (`/products`)

#### GET `/products`
Lista productos con filtros y paginación.

**Query Parameters:**
- `page` (number, default: 1) - Número de página
- `limit` (number, default: 10) - Items por página
- `search` (string) - Búsqueda por nombre/descripción
- `categoryId` (string) - Filtrar por categoría
- `minPrice` (number) - Precio mínimo
- `maxPrice` (number) - Precio máximo
- `isActive` (boolean, default: true) - Productos activos

**Example:** `GET /products?page=1&limit=20&search=laptop&minPrice=1000`

**Response (200):**
```json
{
  "products": [
    {
      "id": "product_id",
      "name": "Laptop Pro",
      "slug": "laptop-pro",
      "description": "High-performance laptop",
      "price": 1299.99,
      "sku": "LAPTOP-001",
      "categoryId": "category_id",
      "category": {
        "id": "category_id",
        "name": "Electronics",
        "slug": "electronics"
      },
      "inventory": {
        "quantity": 50,
        "lowStock": 5,
        "track": true
      },
      "images": ["/images/laptop-1.jpg"],
      "tags": ["laptop", "computer"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

#### GET `/products/:id`
Obtiene detalles de un producto específico.

**Response (200):**
```json
{
  "id": "product_id",
  "name": "Laptop Pro",
  "slug": "laptop-pro",
  "description": "High-performance laptop with 15-inch display",
  "price": 1299.99,
  "sku": "LAPTOP-001",
  "categoryId": "category_id",
  "category": {
    "id": "category_id",
    "name": "Electronics",
    "slug": "electronics"
  },
  "inventory": {
    "quantity": 50,
    "lowStock": 5,
    "track": true
  },
  "images": ["/images/laptop-1.jpg", "/images/laptop-2.jpg"],
  "tags": ["laptop", "computer"],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `404 Not Found` - Producto no existe

---

#### POST `/products`
Crea un nuevo producto (requiere rol ADMIN/VENDOR).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Product",
  "slug": "new-product",
  "description": "Product description",
  "price": 99.99,
  "sku": "PRODUCT-001",
  "categoryId": "category_id",
  "images": ["/images/product-1.jpg"],
  "tags": ["tag1", "tag2"],
  "isActive": true
}
```

**Response (201):**
```json
{
  "id": "new_product_id",
  "name": "New Product",
  "slug": "new-product",
  "description": "Product description",
  "price": 99.99,
  "sku": "PRODUCT-001",
  "categoryId": "category_id",
  "images": ["/images/product-1.jpg"],
  "tags": ["tag1", "tag2"],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `409 Conflict` - SKU ya existe
- `400 Bad Request` - Validación falló

---

#### PATCH `/products/:id`
Actualiza un producto existente (requiere rol ADMIN/VENDOR).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 149.99,
  "isActive": false
}
```

**Response (200):**
```json
{
  "id": "product_id",
  "name": "Updated Product Name",
  "price": 149.99,
  "isActive": false,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### DELETE `/products/:id`
Elimina un producto (requiere rol ADMIN).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

### 📂 Categorías (`/categories`)

#### GET `/categories`
Lista todas las categorías.

**Response (200):**
```json
[
  {
    "id": "category_id",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and accessories",
    "image": "/images/electronics.jpg",
    "isActive": true,
    "parentId": null,
    "children": [
      {
        "id": "subcategory_id",
        "name": "Laptops",
        "slug": "laptops",
        "parentId": "category_id"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### POST `/categories`
Crea una nueva categoría (requiere rol ADMIN).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description",
  "parentId": "parent_category_id"
}
```

---

### 🛒 Carrito (`/cart`)

#### GET `/cart`
Obtiene el carrito del usuario autenticado.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "cart_id",
  "items": [
    {
      "id": "cart_item_id",
      "quantity": 2,
      "price": 1299.99,
      "product": {
        "id": "product_id",
        "name": "Laptop Pro",
        "slug": "laptop-pro",
        "price": 1299.99,
        "images": ["/images/laptop-1.jpg"]
      },
      "addedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "subtotal": 2599.98,
  "taxes": 207.99,
  "total": 2807.97,
  "itemCount": 2
}
```

---

#### POST `/cart/items`
Agrega un producto al carrito.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

**Response (201):**
```json
{
  "id": "cart_item_id",
  "quantity": 1,
  "price": 1299.99,
  "product": {
    "id": "product_id",
    "name": "Laptop Pro",
    "slug": "laptop-pro"
  }
}
```

---

#### PATCH `/cart/items/:id`
Actualiza la cantidad de un item en el carrito.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 3
}
```

---

#### DELETE `/cart/items/:id`
Elimina un item del carrito.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Item removed from cart"
}
```

---

## 🔒 Códigos de Error

| Código | Descripción | Ejemplo |
|--------|-------------|----------|
| 200 | OK | Request exitoso |
| 201 | Created | Recurso creado |
| 400 | Bad Request | Validación falló |
| 401 | Unauthorized | No autenticado o token inválido |
| 403 | Forbidden | Sin permisos suficientes |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Conflicto de negocio (email duplicado, SKU duplicado) |
| 422 | Unprocessable Entity | Error de validación |
| 500 | Internal Server Error | Error del servidor |

---

## 📝 Modelos de Datos

### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'USER' | 'ADMIN' | 'VENDOR';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  sku: string;
  categoryId: string;
  images: string[];
  tags: string[];
  isActive: boolean;
  inventory?: {
    quantity: number;
    lowStock: number;
    track: boolean;
  };
  createdAt: string;
  updatedAt: string;
}
```

### CartItem
```typescript
interface CartItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
  addedAt: string;
}
```

---

## 🧪 Testing

Para probar los endpoints:

1. **Inicia el backend:**
```bash
npm run start:dev
```

2. **Accede a Swagger UI:**
```
http://localhost:3001/api/v1/docs
```

3. **Usa curl o Postman:**
```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@ecommerce.com","password":"user123"}'

# Obtener productos
curl -X GET http://localhost:3001/api/v1/products
```

---

## 📊 Usuarios por Defecto

| Email | Contraseña | Rol |
|-------|------------|------|
| admin@ecommerce.com | admin123 | ADMIN |
| user@ecommerce.com | user123 | USER |

---

**Nota:** Esta API está en desarrollo. Algunos endpoints pueden retornar datos de prueba mientras se implementa la lógica completa.
