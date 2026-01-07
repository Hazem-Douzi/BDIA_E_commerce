# Complete Setup Guide - E-Commerce Application

This guide will walk you through setting up the entire e-commerce application step by step.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** and **npm** - [Download Node.js](https://nodejs.org/)
- **MySQL Server** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **Git** (optional) - [Download Git](https://git-scm.com/downloads)

## 🚀 Step-by-Step Setup

### Step 1: Clone/Navigate to the Project

If you haven't already, navigate to the project directory:

```bash
cd BDIA_E_commerce
```

### Step 2: Set Up MySQL Database

1. **Start MySQL Server**
   - Make sure MySQL is running on your system
   - On Windows: Check Services or run `net start MySQL` (if installed as a service)
   - On Linux/Mac: `sudo systemctl start mysql` or `brew services start mysql`

2. **Create the Database**
   
   **Option A: Using MySQL Command Line**
   ```bash
   mysql -u root -p < E-Commerce-BD.sql
   ```
   When prompted, enter your MySQL root password.

   **Option B: Using MySQL Workbench or phpMyAdmin**
   - Open MySQL Workbench or phpMyAdmin
   - Connect to your MySQL server
   - Open the file `E-Commerce-BD.sql`
   - Execute the entire script

   **Option C: Using Python Script**
   ```bash
   python init_db.py
   ```
   Note: This script may need adjustment based on your MySQL setup.

3. **Verify Database Creation**
   ```bash
   mysql -u root -p -e "SHOW DATABASES LIKE 'ECommerce';"
   ```

### Step 3: Configure Environment Variables

1. **Create a `.env` file** in the project root directory (same level as `run.py`)

2. **Add the following content** to `.env`:

```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=ECommerce

# Flask Secret Keys
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET=your-jwt-secret-key-here
```

**Important Notes:**
- Replace `your_mysql_password` with your actual MySQL root password
- Replace `your-jwt-secret-key-here` with a secure random string
- For production, use strong, randomly generated secrets

**Generate a Secure JWT Secret:**
```python
# Run this in Python to generate a secure JWT secret
import secrets
print(secrets.token_urlsafe(32))
```

Or using Node.js:
```javascript
require('crypto').randomBytes(32).toString('hex')
```

### Step 4: Set Up Python Backend

1. **Create a Virtual Environment** (Recommended)
   
   **Windows:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
   
   **Linux/Mac:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify Backend Configuration**
   - Check that `backend/config.py` exists and reads from `.env`
   - The uploads folder will be created automatically when the server starts

### Step 5: Set Up React Frontend

1. **Navigate to the client directory**
   ```bash
   cd client
   ```

2. **Install Node Dependencies**
   ```bash
   npm install
   ```

3. **Return to project root**
   ```bash
   cd ..
   ```

### Step 6: Verify File Structure

Make sure your project structure looks like this:
```
BDIA_E_commerce/
├── .env                    # ← You created this
├── backend/
├── client/
├── server/                 # ← Old Node.js backend (can be ignored)
├── requirements.txt
├── run.py
└── E-Commerce-BD.sql
```

### Step 7: Run the Application

You need to run both the backend and frontend servers.

#### Terminal 1: Start Backend Server

```bash
# Make sure you're in the project root
python run.py
```

The backend should start on `http://127.0.0.1:8080`

You should see output like:
```
 * Running on http://127.0.0.1:8080
 * Debug mode: on
```

#### Terminal 2: Start Frontend Server

```bash
# Navigate to client directory
cd client
npm run dev
```

The frontend should start on `http://localhost:5173`

You should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 8: Access the Application

1. Open your web browser
2. Navigate to `http://localhost:5173`
3. You should see the e-commerce application

## ✅ Verification Checklist

- [ ] MySQL server is running
- [ ] Database `ECommerce` is created
- [ ] `.env` file exists with correct credentials
- [ ] Python virtual environment is activated (if used)
- [ ] Python dependencies are installed
- [ ] Node.js dependencies are installed
- [ ] Backend server is running on port 8080
- [ ] Frontend server is running on port 5173
- [ ] Application loads in browser

## 🔧 Troubleshooting

### Database Connection Issues

**Error: "Access denied for user"**
- Check your MySQL username and password in `.env`
- Verify MySQL server is running
- Try connecting manually: `mysql -u root -p`

**Error: "Unknown database 'ECommerce'"**
- Run the SQL script again: `mysql -u root -p < E-Commerce-BD.sql`
- Verify database name matches in `.env` (case-sensitive)

### Backend Issues

**Error: "Module not found"**
- Make sure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

**Error: "Port 8080 already in use"**
- Change port in `run.py` or stop the process using port 8080
- On Windows: `netstat -ano | findstr :8080` then `taskkill /PID <pid> /F`

### Frontend Issues

**Error: "Cannot connect to backend"**
- Verify backend is running on port 8080
- Check CORS settings in `backend/config.py`
- Verify API endpoints match in frontend code

**Error: "npm install fails"**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall
- Check Node.js version: `node --version` (should be 16+)

### JWT Token Issues

**Error: "Invalid token"**
- Verify `JWT_SECRET` in `.env` matches what was used to create tokens
- If starting fresh, generate a new JWT_SECRET (users will need to re-login)

## 📝 Additional Notes

### About the Old Node.js Server

The `server/` directory contains an old Node.js/Express backend. This project now uses the Flask backend in `backend/`. You can ignore the `server/` directory unless you need to migrate data or compare implementations.

### Development vs Production

- **Development**: Uses default secrets and debug mode
- **Production**: 
  - Change all secret keys in `.env`
  - Set `debug=False` in `run.py`
  - Use environment variables for sensitive data
  - Configure proper CORS origins
  - Use a production WSGI server (e.g., Gunicorn)

### File Uploads

Uploaded files are stored in `server/uploads/` directory. Make sure this directory exists and has write permissions.

## 🆘 Getting Help

If you encounter issues not covered here:

1. Check the error messages in the terminal
2. Verify all prerequisites are installed correctly
3. Check that all configuration files are set up properly
4. Review the `MIGRATION_GUIDE.md` for migration-specific issues
5. Check `TROUVER_JWT_SECRET.md` for JWT secret configuration

## 🎉 Next Steps

Once everything is running:

1. Register a new user account
2. Test different user roles (Admin, Seller, Client)
3. Explore the features of the application
4. Start developing your customizations!

---

**Happy Coding! 🚀**

