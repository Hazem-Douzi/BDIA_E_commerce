# Migration Guide (Express -> Flask + Raw SQL)

The Flask backend now uses raw SQL with `mysql-connector-python`. There is no
ORM or Flask-Migrate setup. Database schema changes should be applied directly
via SQL scripts (see `database.sql`).

## Key Points

- Controllers call DAO functions for SQL access.
- Database pool is managed in `backend/database/connection.py`.
- Use `.env` for MySQL credentials.
