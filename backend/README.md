# Backend Flask - BDIA E-commerce

This Flask backend keeps the same API routes while using raw SQL with
`mysql-connector-python`.

## Project structure

```
backend/
  __init__.py          # Flask app factory
  config.py            # App config
  controllers/         # Request handling (business logic)
  routes/              # Flask blueprints (routing)
  middleware/          # JWT middleware
  database/
    connection.py      # DB connection pool
    dao/               # SQL data access layer
```

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file at repo root:
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=ECommerce
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET=jwt-secret-key-change-in-production
```

3. Create the MySQL database schema:
```bash
mysql -u root -p < database.sql
```

## Start

```bash
python run.py
```

Server runs on `http://127.0.0.1:8080`.
