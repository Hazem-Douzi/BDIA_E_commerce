"""Database connection manager with connection pooling (mysql-connector)."""
from contextlib import contextmanager
from mysql.connector import pooling
from backend.config import Config


class DatabaseManager:
    """Manages database connections with connection pooling."""

    def __init__(self):
        config = Config()
        self._pool = pooling.MySQLConnectionPool(
            pool_name="bdia_pool",
            pool_size=5,
            pool_reset_session=True,
            host=config.MYSQL_HOST,
            user=config.MYSQL_USER,
            password=config.MYSQL_PASSWORD,
            database=config.MYSQL_DATABASE,
            charset="utf8mb4",
            collation="utf8mb4_unicode_ci",
        )

    def get_connection(self):
        """Get a database connection from the pool."""
        return self._pool.get_connection()

    @contextmanager
    def get_cursor(self, commit=False):
        """Context manager for database cursor with automatic cleanup."""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        try:
            yield cursor
            if commit:
                connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()

    def execute_query(self, query, params=None, fetch_one=False, fetch_all=False, commit=False):
        """Execute a SQL query and return results."""
        with self.get_cursor(commit=commit) as cursor:
            cursor.execute(query, params)
            if fetch_one:
                return cursor.fetchone()
            if fetch_all:
                return cursor.fetchall()
            return cursor.lastrowid if commit else None

    def execute_many(self, query, params_list, commit=False):
        """Execute a query multiple times with different parameters."""
        with self.get_cursor(commit=commit) as cursor:
            affected_rows = cursor.executemany(query, params_list)
            if commit:
                cursor.connection.commit()
            return affected_rows

    def close_connection(self):
        """No-op for pooled connections (kept for API compatibility)."""
        return None


_db_manager = None


def get_db_manager():
    """Get the global database manager instance."""
    global _db_manager
    if _db_manager is None:
        _db_manager = DatabaseManager()
    return _db_manager

