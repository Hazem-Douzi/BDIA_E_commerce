# E-Commerce Application
<<<<<<< HEAD

A full-stack e-commerce platform built with React (frontend) and Node.js/Express (backend) with MySQL database. This application supports three user roles: Admin, Seller, and Client, each with specific functionalities.

## 🚀 Features

### Admin Features
- View all clients, sellers, and products
- Manage user accounts and product listings
- Admin dashboard with comprehensive overview

### Seller Features
- Add, update, and manage products
- Upload product images
- View and manage product listings
- Seller profile management

### Client Features
- Browse and search products
- Add items to cart
- View product details
- User profile management
- Product search and filtering

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router DOM *** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL2** - Database driver
- **Sequelize** - ORM
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Getting Started


### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerceApplication
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Database Setup**
   - Create a MySQL database named `ecomerceDB`
   - Update database configuration in `server/database-models/config.js`:
     ```javascript
     module.exports = {
         dbName: "ecomerceDB",
         username: "your_username",
         password: "your_password",
         host: "localhost",
         dialect: "mysql"
     }
     

5. **Environment Variables**
   - Create a `.env` file in the `server` directory
   - Added JWT secret:

### Running the Application

1. **Start the backend server**
   npm start
   The server will run on `http://localhost:8080`

2. **Start the frontend development server**

   npm run dev
   The client will run on `http://localhost:5173` (or the next available port)


##  Database Models

The application uses the following main models:
- **Users** (Clients and Sellers)
- **Products** - Product listings with images
- **Cart** - Shopping cart functionality
- **Comments** - Product reviews and comments

##  Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Login/Register endpoints for both clients and sellers
- Protected routes for user-specific functionality
- Role-based access control (Admin, Seller, Client)
=======

A full-stack e-commerce platform built with React (frontend) and Node.js/Express (backend) with MySQL database. This application supports three user roles: Admin, Seller, and Client, each with specific functionalities.

## 🚀 Features

### Admin Features
- View all clients, sellers, and products
- Manage user accounts and product listings
- Admin dashboard with comprehensive overview

### Seller Features
- Add, update, and manage products
- Upload product images
- View and manage product listings
- Seller profile management

### Client Features
- Browse and search products
- Add items to cart
- View product details
- User profile management
- Product search and filtering

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router DOM *** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL2** - Database driver
- **Sequelize** - ORM
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Getting Started


### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerceApplication
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Database Setup**
   - Create a MySQL database named `ecomerceDB`
   - Update database configuration in `server/database-models/config.js`:
     ```javascript
     module.exports = {
         dbName: "ecomerceDB",
         username: "your_username",
         password: "your_password",
         host: "localhost",
         dialect: "mysql"
     }
     

5. **Environment Variables**
   - Create a `.env` file in the `server` directory
   - Added JWT secret:

### Running the Application

1. **Start the backend server**
   npm start
   The server will run on `http://localhost:8080`

2. **Start the frontend development server**

   npm run dev
   The client will run on `http://localhost:5173` (or the next available port)


##  Database Models

The application uses the following main models:
- **Users** (Clients and Sellers)
- **Products** - Product listings with images
- **Cart** - Shopping cart functionality
- **Comments** - Product reviews and comments

##  Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Login/Register endpoints for both clients and sellers
- Protected routes for user-specific functionality
- Role-based access control (Admin, Seller, Client)



>>>>>>> e9045af250062a1bf8c4cd317db6befc74da755d

