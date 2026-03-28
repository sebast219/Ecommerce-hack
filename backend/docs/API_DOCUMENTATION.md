# 📚 API Documentation - Ecommerce Hak 6 Backend

## 🏗️ Architecture Overview

### Clean Architecture Implementation
```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Controllers   │  │     Guards      │  │   Decorators    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Use Cases     │  │     DTOs        │  │   Validation   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                   DOMAIN LAYER                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Entities      │  │   Repositories  │  │  Value Objects  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Repositories  │  │   Database      │  │   External      │  │
│  │   (Prisma)      │  │   (PostgreSQL)  │  │   Services      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Dual Server Architecture
```
Frontend → Railway-server.js → NestJS Use Cases → Repositories → Database
            ↓
         Shared Infrastructure (Middleware, DTOs, Validation)
```

---

## 🔐 Authentication

### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "StrongP@ssw0rd123!",
  "phone": "+1234567890",
  "role": "USER"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "createdAt": "2024-03-28T15:00:00.000Z",
      "updatedAt": "2024-03-28T15:00:00.000Z"
    }
  },
  "message": "User created successfully"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongP@ssw0rd123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-access-token",
    "refreshToken": "new-refresh-token"
  },
  "message": "Token refreshed successfully"
}
```

---

## 📦 Products

### Get Products List
```http
GET /api/v1/products?page=1&limit=20&search=WiFi&difficulty=INTERMEDIATE&minPrice=50&maxPrice=500&sortBy=name&sortOrder=asc
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `search` (string): Search term
- `categoryId` (string): Filter by category ID
- `difficulty` (string): Filter by difficulty (BEGINNER|INTERMEDIATE|ADVANCED|EXPERT)
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `sortBy` (string): Sort by field (name|price|createdAt)
- `sortOrder` (string): Sort order (asc|desc)
- `tags` (string[]): Filter by tags

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "wifi-pineapple-mark-vii",
        "name": "WiFi Pineapple Mark VII",
        "slug": "wifi-pineapple-mark-vii",
        "price": {
          "amount": 299.99,
          "currency": "USD"
        },
        "sku": "HAK5-WP007",
        "isActive": true,
        "images": ["https://example.com/image1.jpg"],
        "tags": ["wifi", "pentesting", "audit"],
        "difficulty": "INTERMEDIATE",
        "category": {
          "id": "wireless-attacks",
          "name": "Wireless Attacks",
          "slug": "wireless-attacks"
        },
        "createdAt": "2024-03-28T15:00:00.000Z",
        "updatedAt": "2024-03-28T15:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "totalPages": 1
    }
  },
  "message": "Products retrieved successfully"
}
```

### Get Product Details
```http
GET /api/v1/products/wifi-pineapple-mark-vii
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "wifi-pineapple-mark-vii",
      "name": "WiFi Pineapple Mark VII",
      "slug": "wifi-pineapple-mark-vii",
      "description": "Advanced WiFi auditing platform for penetration testing",
      "price": {
        "amount": 299.99,
        "currency": "USD"
      },
      "comparePrice": {
        "amount": 399.99,
        "currency": "USD"
      },
      "sku": "HAK5-WP007",
      "barcode": "1234567890123",
      "trackInventory": true,
      "isActive": true,
      "images": ["https://example.com/image1.jpg"],
      "tags": ["wifi", "pentesting", "audit"],
      "weight": 0.5,
      "dimensions": {
        "length": 10,
        "width": 5,
        "height": 2,
        "unit": "cm"
      },
      "seoTitle": "WiFi Pineapple Mark VII - Advanced WiFi Auditor",
      "seoDescription": "Professional WiFi auditing platform for cybersecurity professionals",
      "difficulty": "INTERMEDIATE",
      "licenseType": "commercial",
      "compatibility": ["windows", "linux", "mac"],
      "isPhysical": true,
      "createdAt": "2024-03-28T15:00:00.000Z",
      "updatedAt": "2024-03-28T15:00:00.000Z",
      "category": {
        "id": "wireless-attacks",
        "name": "Wireless Attacks",
        "slug": "wireless-attacks",
        "description": "Tools for wireless network security testing"
      },
      "inventory": {
        "id": "inventory-123",
        "quantity": 25,
        "lowStockThreshold": 5,
        "trackQuantity": true
      }
    }
  },
  "message": "Product retrieved successfully"
}
```

### Search Products
```http
GET /api/v1/products/search/Pineapple
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "wifi-pineapple-mark-vii",
        "name": "WiFi Pineapple Mark VII",
        "slug": "wifi-pineapple-mark-vii",
        "price": {
          "amount": 299.99,
          "currency": "USD"
        },
        "images": ["https://example.com/image1.jpg"]
      }
    ]
  },
  "message": "Search results retrieved successfully"
}
```

---

## 🛒 Shopping Cart

### Get User Cart
```http
GET /api/v1/cart
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cart-123",
    "sessionId": "session-456",
    "items": [
      {
        "id": "item-789",
        "quantity": 2,
        "product": {
          "id": "wifi-pineapple-mark-vii",
          "name": "WiFi Pineapple Mark VII",
          "slug": "wifi-pineapple-mark-vii",
          "price": {
            "amount": 299.99,
            "currency": "USD"
          },
          "images": ["https://example.com/image1.jpg"],
          "isActive": true
        }
      }
    ],
    "createdAt": "2024-03-28T15:00:00.000Z",
    "updatedAt": "2024-03-28T15:00:00.000Z"
  }
}
```

### Add Item to Cart
```http
POST /api/v1/cart/items
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "productId": "wifi-pineapple-mark-vii",
  "quantity": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cart-123",
    "items": [
      {
        "id": "item-789",
        "quantity": 1,
        "product": {
          "id": "wifi-pineapple-mark-vii",
          "name": "WiFi Pineapple Mark VII"
        }
      }
    ]
  },
  "message": "Item added to cart successfully"
}
```

### Update Cart Item
```http
PATCH /api/v1/cart/items/item-789
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cart-123",
    "items": [
      {
        "id": "item-789",
        "quantity": 3,
        "product": {
          "id": "wifi-pineapple-mark-vii",
          "name": "WiFi Pineapple Mark VII"
        }
      }
    ]
  },
  "message": "Cart item updated successfully"
}
```

### Remove Item from Cart
```http
DELETE /api/v1/cart/items/item-789
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cart-123",
    "items": []
  },
  "message": "Item removed from cart successfully"
}
```

---

## 📦 Categories

### Get Categories
```http
GET /api/v1/categories
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "wireless-attacks",
      "name": "Wireless Attacks",
      "slug": "wireless-attacks",
      "description": "Tools for wireless network security testing",
      "image": "https://example.com/wireless.jpg",
      "isActive": true,
      "createdAt": "2024-03-28T15:00:00.000Z",
      "updatedAt": "2024-03-28T15:00:00.000Z",
      "_count": {
        "products": 3
      }
    },
    {
      "id": "usb-hacking",
      "name": "USB Hacking",
      "slug": "usb-hacking",
      "description": "USB-based security testing tools",
      "image": "https://example.com/usb.jpg",
      "isActive": true,
      "createdAt": "2024-03-28T15:00:00.000Z",
      "updatedAt": "2024-03-28T15:00:00.000Z",
      "_count": {
        "products": 4
      }
    }
  ]
}
```

---

## 💳 Webhooks

### Stripe Webhook
```http
POST /api/v1/webhooks/stripe
Content-Type: application/json
Stripe-Signature: stripe-signature
```

**Event: payment_intent.succeeded**
```json
{
  "id": "evt_1234567890",
  "object": {
    "id": "pi_1234567890",
    "object": "payment_intent",
    "amount": 29999,
    "currency": "usd",
    "status": "succeeded",
    "metadata": {
      "order_id": "order-123"
    }
  },
  "type": "payment_intent.succeeded"
}
```

**Response (200):**
```json
{
  "received": true,
  "processed": true
}
```

---

## 🔍 Health Check

### System Health
```http
GET /health
```

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-03-28T15:00:00.000Z",
  "architecture": "Dual Server - Railway + NestJS Use Cases"
}
```

---

## 🚨 Error Responses

### Validation Errors (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters",
      "value": "weak"
    }
  ]
}
```

### Authentication Errors (401)
```json
{
  "success": false,
  "message": "Access token is required"
}
```

### Authorization Errors (403)
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### Not Found Errors (404)
```json
{
  "success": false,
  "message": "Product not found"
}
```

### Server Errors (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "details": {
    "url": "/api/v1/products",
    "method": "GET",
    "timestamp": "2024-03-28T15:00:00.000Z"
  },
  "stack": "Error: Database connection failed..."
}
```

---

## 🔄 Rate Limiting

### Rate Limits
- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Search endpoints**: 20 requests per minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1711645200
```

---

## 📝 Response Format Standards

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "details": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "message": "Data retrieved successfully"
}
```

---

## 🔐 Security Headers

All API responses include security headers:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 📊 Monitoring & Logging

### Log Categories
- **AUTH**: Authentication events
- **USER**: User actions
- **PRODUCT**: Product operations
- **ORDER**: Order management
- **CART**: Cart operations
- **PAYMENT**: Payment processing
- **DATABASE**: Database operations
- **API**: HTTP requests/responses
- **PERFORMANCE**: Performance metrics
- **SECURITY**: Security events

### Log Levels
- **ERROR**: Critical errors
- **WARN**: Warning messages
- **INFO**: General information
- **DEBUG**: Debug information
- **TRACE**: Detailed tracing

---

## 🚀 Performance Tips

### Caching
- Products: 10 minutes TTL
- Categories: 30 minutes TTL
- Search results: 1 minute TTL
- User carts: 5 minutes TTL

### Database Optimization
- Use specific field selection
- Implement pagination
- Add appropriate indexes
- Use connection pooling

### Response Optimization
- Compress responses > 1KB
- Use CDN for static assets
- Implement HTTP caching headers

---

## 📚 SDK Examples

### JavaScript/TypeScript
```typescript
// API Client Setup
const API_BASE_URL = 'http://localhost:3001/api/v1';

class EcommerceAPI {
  private headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: this.headers,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProducts(params?: any) {
    const query = new URLSearchParams(params);
    return this.request(`/products?${query}`);
  }

  async addToCart(productId: string, quantity: number, token: string) {
    return this.request('/cart/items', {
      method: 'POST',
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
  }
}

// Usage
const api = new EcommerceAPI();

// Login
const loginResult = await api.login('user@example.com', 'password');
const token = loginResult.data.accessToken;

// Get products
const products = await api.getProducts({
  search: 'WiFi',
  limit: 10,
});

// Add to cart
await api.addToCart('wifi-pineapple-mark-vii', 1, token);
```

### cURL Examples
```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"StrongP@ssw0rd123!"}'

# Get products
curl -X GET "http://localhost:3001/api/v1/products?page=1&limit=10"

# Add to cart
curl -X POST http://localhost:3001/api/v1/cart/items \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"productId":"wifi-pineapple-mark-vii","quantity":1}'
```

---

## 🔧 Development Setup

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Run database migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Run tests
npm run test

# Build for production
npm run build
```

### Environment Variables
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://localhost:5432/ecommerce_hack
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:3000
```

---

## 📞 Support

For API support and documentation updates:
- Check the API documentation at `/api/v1/docs`
- Review the error logs for detailed information
- Contact the development team for assistance

---

*Last updated: March 28, 2024*
