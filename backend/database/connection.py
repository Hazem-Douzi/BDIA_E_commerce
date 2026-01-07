"""Database connection manager with connection pooling"""
import pymysql
from contextlib import contextmanager
from threading import local
from backend.config import Config

class DatabaseManager:
    """Manages database connections with connection pooling"""
    
    def __init__(self):
        self.config = Config()
        self._local = local()
    
    def get_connection(self):
        """Get a database connection from the pool"""
        if not hasattr(self._local, 'connection') or not self._local.connection.open:
            self._local.connection = pymysql.connect(
                host=self.config.MYSQL_HOST,
                user=self.config.MYSQL_USER,
                password=self.config.MYSQL_PASSWORD,
                database=self.config.MYSQL_DATABASE,
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor,
                autocommit=False
            )
        return self._local.connection
    
    @contextmanager
    def get_cursor(self, commit=False):
        """Context manager for database cursor with automatic cleanup"""
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            yield cursor
            if commit:
                conn.commit()
            else:
                conn.rollback()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
    
    def close_connection(self):
        """Close the current thread's database connection"""
        if hasattr(self._local, 'connection'):
            try:
                self._local.connection.close()
            except:
                pass
            delattr(self._local, 'connection')
    
    def execute_query(self, query, params=None, fetch_one=False, fetch_all=False, commit=False):
        """
        Execute a SQL query and return results
        
        Args:
            query: SQL query string
            params: Parameters for the query (tuple or dict)
            fetch_one: If True, return single row
            fetch_all: If True, return all rows
            commit: If True, commit the transaction
        
        Returns:
            Query results or None
        """
        with self.get_cursor(commit=commit) as cursor:
            cursor.execute(query, params)
            if fetch_one:
                return cursor.fetchone()
            elif fetch_all:
                return cursor.fetchall()
            return cursor.lastrowid if commit else None
    
    def execute_many(self, query, params_list, commit=False):
        """
        Execute a query multiple times with different parameters
        
        Args:
            query: SQL query string
            params_list: List of parameter tuples/dicts
            commit: If True, commit the transaction
        
        Returns:
            Number of affected rows
        """
        with self.get_cursor(commit=commit) as cursor:
            affected_rows = cursor.executemany(query, params_list)
            return affected_rows


# Global database manager instance
_db_manager = None

def get_db_manager():
    """Get the global database manager instance"""
    global _db_manager
    if _db_manager is None:
        _db_manager = DatabaseManager()
    return _db_manager

def get_db_connection():
    """Get a database connection (convenience function)"""
    return get_db_manager().get_connection()

