import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration for the Flask app."""
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key-change-in-production"
    JWT_SECRET = os.environ.get("JWT_SECRET") or "jwt-secret-key-change-in-production"

    MYSQL_HOST = os.environ.get("MYSQL_HOST") or "localhost"
    MYSQL_USER = os.environ.get("MYSQL_USER") or "root"
    MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD") or "root"
    MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE") or "ECommerce"

    # CORS Origins - Support for local dev and Vercel deployment
    # In production (Vercel), backend and frontend are on same domain via rewrites
    # so CORS is less restrictive. Use "*" to allow all origins in production.
    cors_origins_env = os.environ.get("CORS_ORIGINS")
    if cors_origins_env == "*":
        CORS_ORIGINS = "*"
    elif cors_origins_env:
        CORS_ORIGINS = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
    else:
        # Default: local development origins
        CORS_ORIGINS = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
        ]

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "server", "uploads")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
