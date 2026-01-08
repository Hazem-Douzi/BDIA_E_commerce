# ShopEase Backend API

A Node.js/Express backend API for the ShopEase e-commerce platform, specifically designed to support the Client Home page functionality.

## 🚀 Features

- **RESTful API** with consistent JSON responses
- **MongoDB integration** with Mongoose ODM
- **CORS support** for frontend integration
- **Error handling** middleware
- **Data validation** with express-validator
- **Pagination support** for performance
- **Category and Product management**

## 📋 API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals (recent products)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:categoryId` - Get products by category

### System
- `GET /health` - Health check endpoint

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd node_backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   - Copy `.env` file and update the values:
   ```bash
   cp .env .env.local
   ```
   - Update MongoDB URI if needed

4. **Start MongoDB:**
   Make sure MongoDB is running on your system

5. **Seed the database (optional):**
   Run the seed script to populate sample data:
   ```bash
   node scripts/seed.js
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📊 Data Models

### Category
```javascript
{
  _id: ObjectId,
  name: String (required, max 50 chars),
  imageUrl: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  name: String (required, max 100 chars),
  price: Number (required, min 0),
  description: String (required, max 500 chars),
  imageUrl: String (required),
  categoryId: ObjectId (ref: Category),
  isFeatured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 API Response Format

All API responses follow this consistent structure:

**Success Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

## 🧪 Testing the API

### Using cURL

**Get all categories:**
```bash
curl http://localhost:5000/api/categories
```

**Get featured products:**
```bash
curl http://localhost:5000/api/products/featured
```

**Get new arrivals:**
```bash
curl http://localhost:5000/api/products/new-arrivals
```

### Using JavaScript/fetch

```javascript
// Get categories
fetch('http://localhost:5000/api/categories')
  .then(res => res.json())
  .then(data => console.log(data));

// Get featured products
fetch('http://localhost:5000/api/products/featured')
  .then(res => res.json())
  .then(data => console.log(data));

// Get new arrivals
fetch('http://localhost:5000/api/products/new-arrivals')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 📁 Project Structure

```
node_backend/
├── middleware/
│   └── errorHandler.js
├── models/
│   ├── Category.js
│   └── Product.js
├── routes/
│   ├── categories.js
│   └── products.js
├── scripts/
│   └── seed.js
├── .env
├── package.json
├── server.js
└── README.md
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `MONGODB_URI` to your production database
3. Run `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.