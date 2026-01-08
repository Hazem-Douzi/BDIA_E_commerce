const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopease', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const categories = [
  {
    name: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'
  },
  {
    name: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
  },
  {
    name: 'Home & Garden',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
  },
  {
    name: 'Sports & Outdoors',
    imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400'
  },
  {
    name: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
  },
  {
    name: 'Beauty & Personal Care',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'
  }
];

const products = [
  // Electronics
  {
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    isFeatured: true
  },
  {
    name: 'Smart Watch Series 5',
    price: 299.99,
    description: 'Advanced smartwatch with health monitoring, GPS, and long battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    isFeatured: true
  },
  {
    name: '4K Ultra HD Monitor',
    price: 449.99,
    description: '27-inch 4K monitor perfect for gaming and professional work.',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    isFeatured: false
  },

  // Clothing
  {
    name: 'Classic Cotton T-Shirt',
    price: 24.99,
    description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    isFeatured: true
  },
  {
    name: 'Denim Jeans',
    price: 79.99,
    description: 'Premium quality denim jeans with perfect fit and durability.',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    isFeatured: false
  },

  // Home & Garden
  {
    name: 'Modern Coffee Table',
    price: 199.99,
    description: 'Elegant modern coffee table made from sustainable materials.',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    isFeatured: true
  },
  {
    name: 'Indoor Plant Set',
    price: 49.99,
    description: 'Beautiful set of 3 indoor plants to brighten up your home.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    isFeatured: false
  },

  // Sports & Outdoors
  {
    name: 'Yoga Mat Premium',
    price: 39.99,
    description: 'Non-slip yoga mat with excellent cushioning and durability.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    isFeatured: false
  },
  {
    name: 'Running Shoes',
    price: 129.99,
    description: 'Lightweight running shoes with advanced cushioning technology.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    isFeatured: true
  },

  // Books
  {
    name: 'The Art of Programming',
    price: 34.99,
    description: 'Comprehensive guide to modern programming practices and techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    isFeatured: false
  },

  // Beauty & Personal Care
  {
    name: 'Natural Skincare Set',
    price: 89.99,
    description: 'Complete skincare routine with natural ingredients.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    isFeatured: true
  }
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`${insertedCategories.length} categories inserted`);

    // Create products with category references
    const productsWithCategories = products.map((product, index) => ({
      ...product,
      categoryId: insertedCategories[index % insertedCategories.length]._id
    }));

    // Insert products
    const insertedProducts = await Product.insertMany(productsWithCategories);
    console.log(`${insertedProducts.length} products inserted`);

    console.log('✅ Data Import Success!');
    process.exit();
  } catch (error) {
    console.error('❌ Data Import Error:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('✅ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error('❌ Data Destroy Error:', error);
    process.exit(1);
  }
};

// Run based on command line arguments
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}