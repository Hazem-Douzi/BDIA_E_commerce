# E-Commerce Application

A full-stack e-commerce platform built with React (frontend) and Flask/Python (backend) with MySQL database. This application supports three user roles: Admin, Seller, and Client, each with specific functionalities.

## 🚀 Features

### Admin Features
- View all clients, sellers, and products
- Manage user accounts and product listings
- Admin dashboard with comprehensive overview
- Manage categories and subcategories

### Seller Features
- Add, update, and manage products
- Upload product images
- View and manage product listings
- Seller profile management

### Client Features
- Browse and search products (with advanced filtering)
- Add items to cart and wishlist
- View product details with reviews and ratings
- User profile management
- Order history and payment card management
- Stripe payment integration

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Three.js / React Three Fiber** - 3D components

### Backend
- **Python 3** - Programming language
- **Flask** - Web framework
- **MySQL** - Database
- **mysql-connector-python** - Database driver
- **JWT** - Authentication
- **Stripe** - Payment processing
- **bcrypt** - Password hashing
- **Flask-CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BDIA_E_commerce
   ```

2. **Set up Python virtual environment**
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install backend dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

5. **Database Setup**
   - Create a MySQL database
   - Import the database schema:
     ```bash
     mysql -u root -p < E-Commerce-BD.sql
     ```

6. **Environment Variables**
   - Create a `.env` file in the root directory:
     ```env
     MYSQL_HOST=localhost
     MYSQL_USER=root
     MYSQL_PASSWORD=your_password
     MYSQL_DATABASE=ECommerce
     JWT_SECRET=your_jwt_secret_here
     STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
     STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
     STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
     FRONTEND_URL=http://localhost:5173
     ```

7. **Generate JWT Secret** (if needed)
   ```bash
   python generate_jwt_secret.py
   ```

8. **Create Admin User** (optional)
   ```bash
   python create_admin_user.py
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   python run.py
   ```
   The server will run on `http://127.0.0.1:8080`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

## Project Structure

```
BDIA_E_commerce/
├── backend/              # Flask backend
│   ├── controllers/      # Business logic
│   ├── database/         # Database connection and DAOs
│   ├── middleware/       # Auth middleware
│   ├── routes/          # API routes
│   └── config.py        # Configuration
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── config/      # Configuration
│   └── package.json
├── E-Commerce-BD.sql    # Database schema
├── requirements.txt     # Python dependencies
└── run.py              # Application entry point
```

## Database Models

The application uses the following main models:
- **users** - Clients, Sellers, and Admins
- **product** - Product listings with images
- **category** & **SubCategory** - Product categorization
- **cart** & **cart_item** - Shopping cart functionality
- **orders** & **order_item** - Order management
- **review** - Product reviews and ratings
- **wishlist** - User wishlists
- **payment** - Payment records
- **payment_card** - Stored payment cards
- **seller_profile** - Seller profiles

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Login/Register endpoints for clients and sellers
- Protected routes for user-specific functionality
- Role-based access control (Admin, Seller, Client)

## Payment Integration

The application uses Stripe for payment processing:
- Stripe Checkout integration
- Webhook support for payment status updates
- Support for multiple payment methods

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/product/All` - Get all products
- `GET /api/product/<id>` - Get product by ID
- `GET /api/product/search` - Search and filter products
- `POST /api/product/add` - Add product (seller/admin)
- `PUT /api/product/update/<id>` - Update product (seller/admin)
- `DELETE /api/product/delete/<id>` - Delete product (seller/admin)

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/item/<id>` - Update cart item
- `DELETE /api/cart/item/<id>` - Remove cart item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/order/` - Create order
- `GET /api/order/` - Get user's orders
- `GET /api/order/<id>` - Get order by ID

### Reviews
- `GET /api/review/product/<product_id>` - Get product reviews
- `POST /api/review/product/<product_id>` - Create review
- `PUT /api/review/<review_id>` - Update review
- `DELETE /api/review/<review_id>` - Delete review
- `GET /api/review/my-reviews` - Get user's reviews

### Wishlist
- `GET /api/wishlist/` - Get user's wishlist
- `POST /api/wishlist/<product_id>` - Add to wishlist
- `DELETE /api/wishlist/<product_id>` - Remove from wishlist
- `GET /api/wishlist/count` - Get wishlist count

### Payments
- `POST /api/payment/stripe/create-checkout` - Create Stripe checkout session
- `GET /api/payment/stripe/verify/<session_id>` - Verify payment
- `POST /api/payment/stripe/webhook` - Stripe webhook

## Development

### Code Structure
- Frontend follows React best practices with component-based architecture
- Backend uses Flask with DAO pattern for database access
- All filtering and searching is done via SQL queries (no ORM)
- Clean separation of concerns (controllers, routes, DAOs)

## License

This project is for educational purposes.
