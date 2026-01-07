#!/usr/bin/env python3
"""
Script to create an admin user in the E-Commerce database
Usage: python create_admin.py [full_name] [email] [password] [phone] [address]
"""
import bcrypt
import mysql.connector
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_admin_user(full_name, email, password, phone="", address=""):
    """Create an admin user in the database"""

    # Get database configuration from .env
    db_config = {
        'host': os.getenv('MYSQL_HOST', 'localhost'),
        'user': os.getenv('MYSQL_USER', 'root'),
        'password': os.getenv('MYSQL_PASSWORD', ''),
        'database': os.getenv('MYSQL_DATABASE', 'ECommerce')
    }

    try:
        # Connect to database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Check if admin already exists
        cursor.execute("SELECT id_user FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            print(f"❌ Admin user with email {email} already exists!")
            return

        # Hash the password
        hashed_password = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(10)
        ).decode('utf-8')

        # Insert admin user
        insert_query = """
        INSERT INTO users (full_name, email, pass_word, rolee, phone, adress, createdAT)
        VALUES (%s, %s, %s, 'admin', %s, %s, NOW())
        """

        cursor.execute(insert_query, (
            full_name,
            email,
            hashed_password,
            phone,
            address
        ))

        conn.commit()

        print("✓ Admin user created successfully!")
        print(f"Name: {full_name}")
        print(f"Email: {email}")
        print("Role: admin")

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python create_admin.py <full_name> <email> <password> [phone] [address]")
        print("Example: python create_admin.py 'Admin User' admin@example.com mypassword123")
        sys.exit(1)

    full_name = sys.argv[1]
    email = sys.argv[2]
    password = sys.argv[3]
    phone = sys.argv[4] if len(sys.argv) > 4 else ""
    address = sys.argv[5] if len(sys.argv) > 5 else ""

    create_admin_user(full_name, email, password, phone, address)