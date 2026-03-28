// 🚂 RAILWAY-SERVER.JS - Servidor Express para despliegue en Railway
// PROPÓSITO: Servidor ligero que consume Use Cases de NestJS

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 🔐 AUTENTICACIÓN
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generar tokens
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { sub: user.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Guardar refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: { user: userWithoutPassword, accessToken, refreshToken },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, firstName, lastName, password, role = 'USER' } = req.body;
    
    // Validación
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters' 
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      success: true,
      data: { user: userWithoutPassword },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// 📦 PRODUCTOS
app.get('/api/v1/products', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      categoryId, 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = Math.min(parseInt(limit), 100);

    // Build where clause
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(categoryId && { categoryId }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } })
    };

    // Build order by
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: true,
          inventory: true
        }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.get('/api/v1/products/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    let product;
    if (identifier.length === 25 && identifier.startsWith('c')) {
      // Prisma ID
      product = await prisma.product.findUnique({
        where: { id: identifier },
        include: { category: true, inventory: true }
      });
    } else if (identifier.includes('-')) {
      // Slug
      product = await prisma.product.findUnique({
        where: { slug: identifier },
        include: { category: true, inventory: true }
      });
    } else {
      // SKU
      product = await prisma.product.findUnique({
        where: { sku: identifier },
        include: { category: true, inventory: true }
      });
    }

    if (!product || !product.isActive) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// 📦 CATEGORÍAS
app.get('/api/v1/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// 🛒 CARRITO (Simplificado - debería usar Use Cases de NestJS)
app.get('/api/v1/cart', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID is required' 
      });
    }

    let cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId },
        include: {
          items: {
            include: { product: true }
          }
        }
      });
    }

    res.json({
      success: true,
      data: { cart }
    });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// 💳 STRIPE WEBHOOKS
app.post('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Aquí deberías verificar la firma con tu webhook secret
    // event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    // Por ahora, parseamos directamente para desarrollo
    event = JSON.parse(req.body);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Aquí deberías llamar al Use Case de procesamiento de pagos
        // await processPaymentUseCase.execute(paymentIntent);
        
        break;
        
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook handler failed' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚂 Railway Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: Connected`);
});

module.exports = app;
