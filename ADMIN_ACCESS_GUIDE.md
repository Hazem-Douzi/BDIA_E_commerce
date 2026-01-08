# 🔐 Admin Interface Access Guide

Complete guide on how to access and use the admin interface.

## 📋 Prerequisites

1. **Backend server running** on `http://localhost:8080`
2. **Frontend server running** on `http://localhost:5173` (or next available port)
3. **MySQL database** set up and running
4. **Admin user account** created in the database

---

## 🚀 Quick Access Steps

### Step 1: Create an Admin User

You need to create an admin user in the database. You have **two options**:

#### **Option A: Using MySQL Command Line (Recommended)**

1. **Open MySQL command line:**
   ```bash
   mysql -u root -p
   ```
   Enter your MySQL password when prompted.

2. **Select the database:**
   ```sql
   USE ECommerce;
   ```

3. **Create an admin user:**
   ```sql
   INSERT INTO users (full_name, email, pass_word, rolee, phone, adress, createdAT)
   VALUES (
     'Admin User',
     'admin@example.com',
     '$2b$10$YourHashedPasswordHere',
     'admin',
     '',
     '',
     NOW()
   );
   ```

   **⚠️ Important:** You need to hash the password first. Use Python to generate a bcrypt hash:

   ```python
   import bcrypt
   password = "your_admin_password"
   hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
   print(hashed.decode('utf-8'))
   ```

   Copy the output and use it in the SQL INSERT statement above.

#### **Option B: Using Python Script (Easier)**

Create a file `create_admin.py` in the project root:

```python
import bcrypt
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

# Database connection
conn = mysql.connector.connect(
    host=os.getenv('MYSQL_HOST', 'localhost'),
    user=os.getenv('MYSQL_USER', 'root'),
    password=os.getenv('MYSQL_PASSWORD', ''),
    database=os.getenv('MYSQL_DATABASE', 'ECommerce')
)

cursor = conn.cursor()

# Admin credentials
admin_email = 'admin@example.com'
admin_password = 'admin123'  # Change this to a secure password
admin_name = 'Admin User'

# Hash password
hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Insert admin user
query = """
INSERT INTO users (full_name, email, pass_word, rolee, phone, adress, createdAT)
VALUES (%s, %s, %s, 'admin', '', '', NOW())
"""

try:
    cursor.execute(query, (admin_name, admin_email, hashed_password))
    conn.commit()
    print(f"✅ Admin user created successfully!")
    print(f"   Email: {admin_email}")
    print(f"   Password: {admin_password}")
    print(f"   ⚠️  Please change the password after first login!")
except mysql.connector.IntegrityError:
    print("❌ Admin user already exists with this email.")
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    cursor.close()
    conn.close()
```

Run the script:
```bash
python create_admin.py
```

---

### Step 2: Start the Servers

**Terminal 1 - Backend:**
```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Linux/Mac

# Start Flask server
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

---

### Step 3: Log In as Admin

1. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

2. **Enter admin credentials:**
   - **Email:** `admin@example.com` (or the email you used)
   - **Password:** The password you set

3. **Click "Sign In"**

4. **Automatic Redirect:**
   - If the login is successful and your role is `admin`, you will be automatically redirected to:
   ```
   http://localhost:5173/Home_admin
   ```

---

## 🎯 Admin Interface Routes

Once logged in as admin, you can access:

| Route | Description |
|-------|-------------|
| `/Home_admin` | Main admin dashboard with statistics |
| `/Home_admin/All_client` | View and manage all clients |
| `/Home_admin/All_seller` | View and manage all sellers |
| `/Home_admin/All_prod` | View and manage all products |

---

## 🛠️ Admin Features

### Dashboard (`/Home_admin`)
- **Statistics Overview:**
  - Total Users
  - Total Clients
  - Total Sellers
  - Total Products
  - Total Orders
  - Pending Orders
  - Categories
  - Pending Seller Verifications

- **Quick Actions:**
  - Navigate to All Clients
  - Navigate to All Sellers
  - Navigate to All Products

### All Clients (`/Home_admin/All_client`)
- View all registered clients
- Manage client accounts

### All Sellers (`/Home_admin/All_seller`)
- View all registered sellers
- Manage seller accounts
- Handle seller verifications

### All Products (`/Home_admin/All_prod`)
- View all products in the system
- Approve, edit, or delete products
- Manage product listings

---

## 🔧 Troubleshooting

### Issue: "Login failed" or "Invalid credentials"

**Solutions:**
1. **Verify admin user exists:**
   ```sql
   SELECT * FROM users WHERE rolee = 'admin';
   ```

2. **Check password hash:**
   - Make sure the password was hashed correctly using bcrypt
   - Try creating a new admin user with a known password

3. **Verify backend is running:**
   - Check `http://localhost:8080/api/auth/login` is accessible
   - Check backend terminal for errors

### Issue: Login succeeds but doesn't redirect to admin page

**Solutions:**
1. **Check user role in database:**
   ```sql
   SELECT email, rolee FROM users WHERE email = 'admin@example.com';
   ```
   Make sure `rolee` is exactly `'admin'` (lowercase)

2. **Check browser console:**
   - Open Developer Tools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab to see if the login request succeeded

3. **Verify localStorage:**
   - After login, check browser localStorage:
   ```javascript
   // In browser console
   console.log(localStorage.getItem('user'));
   ```
   Should show: `{"id":...,"username":"...","role":"admin"}`

### Issue: "Cannot access admin routes"

**Solutions:**
1. **Check authentication token:**
   - Verify token is stored: `localStorage.getItem('token')`
   - Token should be present after successful login

2. **Check backend admin routes:**
   - Verify admin routes are protected and working
   - Check backend logs for authentication errors

3. **Manual navigation:**
   - Try navigating directly to: `http://localhost:5173/Home_admin`
   - If you're logged in as admin, it should work

---

## 🔒 Security Notes

1. **Change Default Password:**
   - Always change the default admin password after first login
   - Use a strong, unique password

2. **Admin Account Creation:**
   - Admin accounts should NOT be created through the public registration form
   - Always create admin accounts directly in the database or through a secure script

3. **Environment Variables:**
   - Keep your `.env` file secure
   - Never commit admin credentials to Git

4. **JWT Secret:**
   - Use a strong, randomly generated JWT secret
   - Run: `python generate_jwt_secret.py`

---

## 📝 Quick Reference

### Default Admin Credentials (if using the Python script)
```
Email: admin@example.com
Password: admin123
```

**⚠️ Change these immediately after first login!**

### Direct Admin URL
```
http://localhost:5173/Home_admin
```

### Backend Admin API Endpoints
```
GET  /api/admin/stats          - Get dashboard statistics
GET  /api/admin/users           - Get all users
GET  /api/admin/clients         - Get all clients
GET  /api/admin/sellers         - Get all sellers
GET  /api/admin/products        - Get all products
```

---

## ✅ Verification Checklist

Before accessing admin interface, verify:

- [ ] Backend server is running (`http://localhost:8080`)
- [ ] Frontend server is running (`http://localhost:5173`)
- [ ] MySQL database is running
- [ ] Admin user exists in database with `rolee = 'admin'`
- [ ] Admin password is correctly hashed
- [ ] Can access login page (`http://localhost:5173`)
- [ ] Can log in with admin credentials
- [ ] Redirects to `/Home_admin` after login
- [ ] Dashboard loads with statistics

---

## 🆘 Need Help?

If you're still having issues:

1. Check backend terminal for error messages
2. Check browser console (F12) for JavaScript errors
3. Verify database connection in `.env` file
4. Ensure all dependencies are installed
5. Check that the database schema is correct

---

**Happy Admin Managing! 🚀**

