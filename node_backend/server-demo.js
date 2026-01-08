const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Mock data for demonstration
const mockCategories = [
  {
    _id: '1',
    name: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Home & Garden',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    name: 'Sports & Outdoors',
    imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockProducts = [
  {
    _id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    categoryId: '1',
    isFeatured: true,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    category: { name: 'Electronics' }
  },
  {
    _id: '2',
    name: 'Smart Watch Series 5',
    price: 299.99,
    description: 'Advanced smartwatch with health monitoring, GPS, and long battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    categoryId: '1',
    isFeatured: true,
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    category: { name: 'Electronics' }
  },
  {
    _id: '3',
    name: 'Classic Cotton T-Shirt',
    price: 24.99,
    description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    categoryId: '2',
    isFeatured: true,
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    category: { name: 'Clothing' }
  },
  {
    _id: '4',
    name: 'Modern Coffee Table',
    price: 199.99,
    description: 'Elegant modern coffee table made from sustainable materials.',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    categoryId: '3',
    isFeatured: true,
    createdAt: new Date(Date.now() - 345600000), // 4 days ago
    category: { name: 'Home & Garden' }
  },
  {
    _id: '5',
    name: 'Running Shoes',
    price: 129.99,
    description: 'Lightweight running shoes with advanced cushioning technology.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    categoryId: '4',
    isFeatured: true,
    createdAt: new Date(Date.now() - 432000000), // 5 days ago
    category: { name: 'Sports & Outdoors' }
  },
  {
    _id: '6',
    name: '4K Ultra HD Monitor',
    price: 449.99,
    description: '27-inch 4K monitor perfect for gaming and professional work.',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    categoryId: '1',
    isFeatured: false,
    createdAt: new Date(Date.now() - 518400000), // 6 days ago
    category: { name: 'Electronics' }
  },
  {
    _id: '7',
    name: 'Denim Jeans',
    price: 79.99,
    description: 'Premium quality denim jeans with perfect fit and durability.',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    categoryId: '2',
    isFeatured: false,
    createdAt: new Date(Date.now() - 604800000), // 7 days ago
    category: { name: 'Clothing' }
  },
  {
    _id: '8',
    name: 'Indoor Plant Set',
    price: 49.99,
    description: 'Beautiful set of 3 indoor plants to brighten up your home.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    categoryId: '3',
    isFeatured: false,
    createdAt: new Date(Date.now() - 691200000), // 8 days ago
    category: { name: 'Home & Garden' }
  }
];

// Initialize Express app
const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176',
    'http://127.0.0.1:5177'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ShopEase API is running (Demo Mode - No Database)',
    timestamp: new Date().toISOString()
  });
});

// Categories routes
app.get('/api/categories', (req, res) => {
  res.status(200).json({
    success: true,
    count: mockCategories.length,
    data: mockCategories
  });
});

app.get('/api/categories/:id', (req, res) => {
  const category = mockCategories.find(cat => cat._id === req.params.id);
  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }
  res.status(200).json({
    success: true,
    data: category
  });
});

// Products routes
app.get('/api/products/featured', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const featuredProducts = mockProducts
    .filter(product => product.isFeatured)
    .slice(0, limit);

  res.status(200).json({
    success: true,
    count: featuredProducts.length,
    data: featuredProducts
  });
});

app.get('/api/products/new-arrivals', (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const newArrivals = [...mockProducts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

  res.status(200).json({
    success: true,
    count: newArrivals.length,
    data: newArrivals
  });
});

app.get('/api/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const paginatedProducts = mockProducts.slice(skip, skip + limit);

  res.status(200).json({
    success: true,
    count: paginatedProducts.length,
    pagination: {
      page,
      limit,
      total: mockProducts.length,
      pages: Math.ceil(mockProducts.length / limit)
    },
    data: paginatedProducts
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = mockProducts.find(prod => prod._id === req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  res.status(200).json({
    success: true,
    data: product
  });
});

app.get('/api/products/category/:categoryId', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const categoryProducts = mockProducts.filter(prod => prod.categoryId === req.params.categoryId);
  const paginatedProducts = categoryProducts.slice(skip, skip + limit);

  res.status(200).json({
    success: true,
    count: paginatedProducts.length,
    pagination: {
      page,
      limit,
      total: categoryProducts.length,
      pages: Math.ceil(categoryProducts.length / limit)
    },
    data: paginatedProducts
  });
});

// 404 handler for undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 ShopEase Backend API Server Started! (Demo Mode)
📍 Running on: http://localhost:${PORT}
🌍 Environment: Demo (No Database Required)
📊 Health Check: http://localhost:${PORT}/health

📋 Available Endpoints:
   GET  /api/categories              - Get all categories
   GET  /api/products/featured       - Get featured products
   GET  /api/products/new-arrivals   - Get new arrivals
   GET  /api/products                - Get all products (paginated)
   GET  /api/products/:id            - Get single product
   GET  /api/products/category/:id   - Get products by category
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;