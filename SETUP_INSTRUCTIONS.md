# Backend Setup (Flask + Raw SQL)

## Prerequisites

- Python 3.8+
- MySQL running locally

## Install

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` at repo root:
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=ECommerce
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET=jwt-secret-key-change-in-production
```

3. Create the database schema:
```bash
mysql -u root -p < database.sql
```

## Run

```bash
python run.py
```

Server: `http://127.0.0.1:8080`
