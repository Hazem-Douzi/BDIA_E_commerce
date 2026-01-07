# ⚡ Quick Start Guide

A condensed version for experienced developers who just need the commands.

## 🚀 Installation (One-Time Setup)

```bash
# 1. Clone repository
git clone <repository-url>
cd BDIA_E_commerce

# 2. Install Frontend dependencies
cd client
npm install
cd ..

# 3. Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# 4. Install Backend dependencies
pip install -r requirements.txt

# 5. Set up database
mysql -u root -p < E-Commerce-BD.sql

# 6. Create .env file (copy from .flaskenv and update credentials)
cp .flaskenv .env
# Edit .env with your MySQL password and generate JWT_SECRET
python generate_jwt_secret.py
```

## ▶️ Running the Application

### Terminal 1 - Backend:
```bash
# Activate venv (if not already)
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Linux/Mac

python run.py
```

### Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

## 📍 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080

## 🔑 Essential Commands

```bash
# Frontend
cd client
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production

# Backend
python run.py        # Start Flask server
pip install -r requirements.txt  # Install Python packages

# Database
mysql -u root -p < E-Commerce-BD.sql  # Import database
```

## 📋 Dependencies Summary

**Frontend (client/package.json):**
- React 19.1.0
- React Router DOM 7.7.1
- Tailwind CSS 3.4.19
- React Three Fiber 9.5.0 (3D components)
- Lucide React 0.562.0 (icons)
- Axios 1.11.0
- Vite 5.4.21

**Backend (requirements.txt):**
- Flask 3.0.0
- Flask-CORS 4.0.0
- mysql-connector-python 8.3.0
- PyJWT 2.8.0
- bcrypt 4.1.2

---

For detailed instructions, see [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)

