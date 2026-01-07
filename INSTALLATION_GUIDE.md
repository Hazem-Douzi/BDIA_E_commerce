# 📦 Installation Guide - E-Commerce Application

Complete step-by-step guide for installing all packages and dependencies.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Required Software:
- **Git** - [Download Git](https://git-scm.com/downloads)
- **Node.js 16+** and **npm** - [Download Node.js](https://nodejs.org/) (npm comes with Node.js)
- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **MySQL Server** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)

### Verify Installation:
```bash
git --version
node --version    # Should be v16 or higher
npm --version
python --version  # Should be 3.8 or higher
mysql --version
```

---

## 🚀 Step-by-Step Installation

### Step 1: Clone the Repository

```bash
# Clone the repository from GitHub
git clone <your-repository-url>
cd BDIA_E_commerce
```

Replace `<your-repository-url>` with your actual GitHub repository URL.

---

### Step 2: Install Frontend Dependencies (React Client)

1. **Navigate to the client folder:**
   ```bash
   cd client
   ```

2. **Install all npm packages:**
   ```bash
   npm install
   ```

   This will install all dependencies listed in `package.json`, including:
   - React 19.1.0
   - React Router DOM
   - Tailwind CSS
   - React Three Fiber (for 3D components)
   - Lucide React (for icons)
   - Axios (for API calls)
   - And all other dependencies...

3. **Expected Output:**
   ```
   added 401 packages, and audited 401 packages
   ```

4. **Return to project root:**
   ```bash
   cd ..
   ```

---

### Step 3: Install Backend Dependencies (Python Flask)

1. **Create a Python Virtual Environment** (Recommended)

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

   You should see `(venv)` in your terminal prompt after activation.

2. **Install Python packages:**
   ```bash
   pip install -r requirements.txt
   ```

   This will install:
   - Flask 3.0.0
   - Flask-CORS 4.0.0
   - mysql-connector-python 8.3.0
   - PyJWT 2.8.0
   - bcrypt 4.1.2
   - And other dependencies...

3. **Expected Output:**
   ```
   Successfully installed Flask-3.0.0 Flask-CORS-4.0.0 ...
   ```

---

### Step 4: Set Up MySQL Database

1. **Start MySQL Server**
   - Make sure MySQL service is running on your system
   - **Windows:** Check Services or run `net start MySQL`
   - **Linux:** `sudo systemctl start mysql`
   - **Mac:** `brew services start mysql`

2. **Create the Database**

   **Option A: Using MySQL Command Line**
   ```bash
   mysql -u root -p < E-Commerce-BD.sql
   ```
   Enter your MySQL root password when prompted.

   **Option B: Using MySQL Workbench**
   - Open MySQL Workbench
   - Connect to your MySQL server
   - File → Open SQL Script → Select `E-Commerce-BD.sql`
   - Execute the script (⚡ icon)

   **Option C: Using Python Script**
   ```bash
   python init_db.py
   ```

3. **Verify Database Creation**
   ```bash
   mysql -u root -p -e "SHOW DATABASES LIKE 'ECommerce';"
   ```

---

### Step 5: Configure Environment Variables

1. **Create a `.env` file** in the project root directory (same level as `run.py`)

2. **Copy the following template** and update with your values:

   ```env
   # MySQL Database Configuration
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=ECommerce

   # Flask Configuration
   FLASK_APP=run.py
   FLASK_ENV=development

   # Secret Keys
   SECRET_KEY=dev-secret-key-change-in-production
   JWT_SECRET=your-jwt-secret-key-here
   ```

3. **Generate a Secure JWT Secret:**
   ```bash
   python generate_jwt_secret.py
   ```
   Copy the generated secret and paste it as `JWT_SECRET` in your `.env` file.

   **OR** manually generate one:
   ```python
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

4. **Update `MYSQL_PASSWORD`** with your actual MySQL root password.

---

### Step 6: Verify Installation

**Check Frontend:**
```bash
cd client
npm list --depth=0  # Should show all installed packages
cd ..
```

**Check Backend:**
```bash
# Make sure virtual environment is activated
pip list  # Should show Flask, mysql-connector-python, etc.
```

---

## ▶️ Running the Application

### Start the Backend Server (Terminal 1)

1. **Activate virtual environment** (if not already activated):
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

2. **Run the Flask server:**
   ```bash
   python run.py
   ```

   The server should start on `http://localhost:8080`

   You should see:
   ```
   * Running on http://127.0.0.1:8080
   ```

### Start the Frontend Server (Terminal 2)

1. **Navigate to client folder:**
   ```bash
   cd client
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend should start on `http://localhost:5173` (or next available port)

   You should see:
   ```
   VITE v5.4.21  ready in 254 ms
   ➜  Local:   http://localhost:5173/
   ```

---

## 🔧 Troubleshooting

### Common Issues:

1. **"npm install" fails or takes too long:**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`, then run `npm install` again
   - Check your internet connection
   - Try using a different registry: `npm install --registry https://registry.npmjs.org/`

2. **"pip install" fails:**
   - Upgrade pip: `python -m pip install --upgrade pip`
   - Make sure virtual environment is activated
   - On Windows, you might need: `python -m pip install -r requirements.txt`

3. **MySQL connection errors:**
   - Verify MySQL server is running
   - Check `.env` file has correct MySQL credentials
   - Verify database `ECommerce` exists: `mysql -u root -p -e "SHOW DATABASES;"`

4. **Port already in use:**
   - Backend (8080): Change port in `run.py` or kill the process using that port
   - Frontend (5173): Vite will automatically use the next available port

5. **Module not found errors:**
   - Make sure you ran `npm install` in the `client` folder
   - Make sure you activated the virtual environment and ran `pip install -r requirements.txt`

6. **Tailwind CSS not working:**
   - Verify `tailwind.config.js` exists in `client` folder
   - Check `postcss.config.js` exists in `client` folder
   - Make sure `@tailwind` directives are in `client/src/index.css`

---

## 📁 Project Structure

After installation, your project should look like this:

```
BDIA_E_commerce/
├── .env                      # Environment variables (create this)
├── .flaskenv                 # Flask environment config
├── requirements.txt          # Python dependencies
├── run.py                    # Flask application entry point
├── E-Commerce-BD.sql         # Database schema
│
├── client/                   # React Frontend
│   ├── node_modules/         # (created after npm install)
│   ├── package.json          # Frontend dependencies
│   ├── tailwind.config.js    # Tailwind CSS config
│   ├── postcss.config.js     # PostCSS config
│   ├── vite.config.js        # Vite config
│   └── src/
│       ├── components/       # React components
│       ├── login.jsx         # Login page
│       └── ...
│
├── backend/                  # Python Flask Backend
│   ├── routes/               # API routes
│   ├── controllers/          # Business logic
│   ├── database/             # Database models
│   └── ...
│
└── venv/                     # Python virtual environment (create this)
```

---

## ✅ Quick Checklist

Before starting development, verify:

- [ ] Git repository cloned
- [ ] Node.js and npm installed
- [ ] Python 3.8+ installed
- [ ] MySQL server installed and running
- [ ] Frontend dependencies installed (`npm install` in `client` folder)
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Virtual environment created and activated
- [ ] Database created (`ECommerce`)
- [ ] `.env` file created with correct credentials
- [ ] Backend server runs successfully (`python run.py`)
- [ ] Frontend server runs successfully (`npm run dev` in `client` folder)

---

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Check that all environment variables are set correctly in `.env`
4. Ensure MySQL server is running
5. Check terminal/console for specific error messages
6. Contact the team lead or check project documentation

---

## 📝 Notes

- **Virtual Environment:** Always activate the virtual environment before running the backend server
- **Node Modules:** Don't commit `node_modules` folder to Git (it's in `.gitignore`)
- **Environment Variables:** Never commit `.env` file to Git (it contains sensitive information)
- **Database:** Make sure MySQL server is running before starting the backend

---

**Happy Coding! 🚀**

