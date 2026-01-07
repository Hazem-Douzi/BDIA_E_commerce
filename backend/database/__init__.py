"""Database package for connection management and data access layer"""
from backend.database.connection import DatabaseManager, get_db_connection

__all__ = ['DatabaseManager', 'get_db_connection']

