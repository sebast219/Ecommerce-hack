// 🚂 RAILWAY-SERVER.JS INTEGRADO - Consumiendo Use Cases de NestJS
// PROPÓSITO: Servidor Express que consume Use Cases de NestJS (Clean Architecture)

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importar Use Cases de NestJS (compilados)
const { 
  LoginUseCase, 
  RegisterUseCase,
  RefreshTokenUseCase 
} = require('./dist/application/use-cases/auth/login.use-case');
const {
  GetProductsUseCase,
  GetProductUseCase
} = require('./dist/application/use-cases/products/get-products.use-case.real');
const {
  AddToCartUseCase,
  UpdateCartItemUseCase,
  RemoveFromCartUseCase,
  GetCartUseCase
} = require('./dist/application/use-cases/cart/manage-cart.use-case');

// Importar Repositories de NestJS
const {
  UserRepositoryImpl,
  ProductRepositoryImpl,
  CartRepositoryImpl,
  RefreshTokenRepositoryImpl
} = require('./dist/infrastructure/database/repositories');

// Importar Servicios de NestJS
const { PrismaService } = require('./dist/infrastructure/database/prisma.service');
const { JwtService } = require('@nestjs/jwt');
const { ConfigService } = require('@nestjs/config');

const app = express();

// Inicializar servicios
const prismaService = new PrismaService();
const configService = new ConfigService();
const jwtService = new JwtService(configService);

// Inicializar repositorios
const userRepository = new UserRepositoryImpl(prismaService);
const productRepository = new ProductRepositoryImpl(prismaService);
const cartRepository = new CartRepositoryImpl(prismaService);
const refreshTokenRepository = new RefreshTokenRepositoryImpl(prismaService);

// Inicializar Use Cases
const loginUseCase = new LoginUseCase(userRepository, refreshTokenRepository, jwtService, configService);
const registerUseCase = new RegisterUseCase(userRepository, userRepository, jwtService, configService);
const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, refreshTokenRepository, jwtService, configService);
const getProductsUseCase = new GetProductsUseCase(productRepository, productRepository);
const getProductUseCase = new GetProductUseCase(productRepository);
const addToCartUseCase = new AddToCartUseCase(cartRepository, cartItemRepository, productRepository);
const getCartUseCase = new GetCartUseCase(cartRepository);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de autenticación compartido
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token is required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ success: false, message: 'Token has expired' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ success: false, message: 'Invalid token' });
      } else {
        return res.status(403).json({ success: false, message: 'Token validation failed' });
      }
    }
    req.user = user;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    architecture: 'Dual Server - Railway + NestJS Use Cases'
  });
});

// 🔐 AUTENTICACIÓN (CONSUMIENDO USE CASES)
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const result = await loginUseCase.execute(req.body);
    res.json({
      success: true,
      data: result,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(error.status || 500).json({ 
      success: false, 
      message: error.message || 'Login failed' 
    });
  }
});

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const result = await registerUseCase.execute(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(error.status || 500).json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    });
  }
});

app.post('/api/v1/auth/refresh', async (req, res) => {
  try {
    const result = await refreshTokenUseCase.execute(req.body);
    res.json({
      success: true,
      data: result,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(error.status || 500).json({ 
      success: false, 
      message: error.message || 'Token refresh failed' 
    });
  }
});

// 📦 PRODUCTOS (CONSUMIENDO USE CASES)
app.get('/api/v1/products', async (req, res) => {
  try {
    const result = await getProductsUseCase.execute(req.query);
    res.json({
      success: true,
      data: result,
      message: 'Products retrieved successfully'
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(error.status || 500).json({ 
      success: false, 
      message: error.message || 'Failed to retrieve products' 
    });
  }
});

app.get('/api/v1/products/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    let request;
    if (identifier.length === 25 && identifier.startsWith('c')) {
      request = { id: identifier };
    } else if (identifier.includes('-')) {
      request = { slug: identifier };
    } else {
      request = { sku: identifier };
    }

    const result = await getProductUseCase.execute(request);
    res.json({
      success: true,
      data: result,
      message: 'Product retrieved successfully'
    });
  } catch (error) {
    console.error('Product error:', error);
    res.status(error.status || 500).json({ 
      success: false, 
      message: error.message || 'Failed to retrieve product' 
    });
  }
});

// 🛒 CARRITO (CONSUMIENDO USE CASES)
app.get('/api/v1/cart', authenticateToken, async (req, res) => {
  try {
    const request = {
      sessionId: req.query.sessionId,
      userId: req.user?.sub
    };
    
    const result = await getCartUseCase.execute(request);
    res.json({
      success: true,
      data: result.cart,
      message: result.cart ? 'Cart retrieved successfully' : 'Cart not found'
    });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(error.status || 500).json({ 
      success: false, 
      message: error.message || 'Failed to retrieve cart' 
    });
  }
});

app.post('/api/v1/cart/items', authenticateToken, async (req, res) => {
  try {
    const request = {
      ...req.body,
      userId: req.user?.sub
    };
    
    const result = await addToCartUseCase.execute(request);
    res.json({
      success: true,
      data: result.cart,
      message: result.message
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(error.status || 500).json({ 
      success: false, 
      message: error.message || 'Failed to add item to cart' 
    });
  }
});

// 📦 CATEGORÍAS (PLACEHOLDER - DEBE IMPLEMENTARSE)
app.get('/api/v1/categories', async (req, res) => {
  try {
    // TODO: Implementar GetCategoriesUseCase
    res.json({
      success: true,
      message: 'Categories endpoint - Implement GetCategoriesUseCase'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve categories' 
    });
  }
});

// 💳 STRIPE WEBHOOKS (MEJORADO)
app.post('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // TODO: Implementar verificación de firma con webhook secret
    event = JSON.parse(req.body);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('✅ Payment succeeded:', event.data.object.id);
        // TODO: Llamar a ProcessPaymentUseCase
        break;
        
      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', event.data.object.id);
        break;
        
      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }

    res.json({ received: true, processed: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ 
      error: 'Webhook handler failed',
      message: error.message 
    });
  }
});

// Middleware de manejo de errores compartido
const errorHandler = (error, req, res, next) => {
  console.error('🚨 Unhandled error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      details: {
        url: req.url,
        method: req.method,
        body: req.body
      }
    })
  });
};

// Handler para rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
    availableEndpoints: [
      'GET /health',
      'POST /api/v1/auth/login',
      'POST /api/v1/auth/register',
      'POST /api/v1/auth/refresh',
      'GET /api/v1/products',
      'GET /api/v1/products/:id',
      'GET /api/v1/cart',
      'POST /api/v1/cart/items',
      'GET /api/v1/categories',
      'POST /api/v1/webhooks/stripe'
    ]
  });
};

// Aplicar middleware
app.use(errorHandler);
app.use(notFoundHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('🚂 Railway Server (Integrated) running on port', PORT);
  console.log('📍 Environment:', process.env.NODE_ENV || 'development');
  console.log('🏗️  Architecture: Dual Server - Railway + NestJS Use Cases');
  console.log('🗄️  Database: Connected via Prisma');
  console.log('🔗  Integration: Consuming NestJS Use Cases');
  console.log('📊 Health Check: http://localhost:' + PORT + '/health');
});

module.exports = app;
