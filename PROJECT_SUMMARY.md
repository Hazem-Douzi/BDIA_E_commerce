# Project Summary - BDIA E-Commerce

## Overview

Flask backend + React frontend, using a MySQL schema defined in `database.sql`.
The backend now uses raw SQL (mysql-connector) with a clean MVC style layout.

## Backend Structure

- `backend/controllers/` request handling (business logic)
- `backend/routes/` Flask blueprints
- `backend/database/connection.py` database pool
- `backend/database/dao/` SQL data-access layer
- `backend/middleware/` JWT helpers

## Core Features

- JWT authentication
- Admin, seller, and client roles
- Products, categories, subcategories
- Carts, orders, payments
- Reviews and product ratings
- Image uploads (stored in `server/uploads`)

## Run Backend

```bash
pip install -r requirements.txt
mysql -u root -p < database.sql
python run.py
```
