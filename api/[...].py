"""
Catch-all route handler for Flask on Vercel
This file handles all API routes using Vercel's catch-all syntax [...]
"""
import sys
import os

# Add parent directory to path to allow imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import create_app

# Create the Flask app
app = create_app()

# Vercel will automatically use this as the WSGI application