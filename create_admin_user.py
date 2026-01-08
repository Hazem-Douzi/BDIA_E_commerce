"""
Script to create an admin user in the database.
Run this script to create an admin account for accessing the admin interface.
"""

import bcrypt
import mysql.connector
from dotenv import load_dotenv
import os
import sys

# Load environment variables
load_dotenv()

def create_admin_user():
    """Create an admin user in the database."""
    
    # Database connection parameters
    db_config = {
        'host': os.getenv('MYSQL_HOST', 'localhost'),
        'user': os.getenv('MYSQL_USER', 'root'),
        'password': os.getenv('MYSQL_PASSWORD', 'mysql'),
        'database': os.getenv('MYSQL_DATABASE', 'ECommerce')
    }
    
    print("=" * 50)
    print("Admin User Creation Script")
    print("=" * 50)
    print()
    
    # Get admin credentials
    print("Enter admin user details:")
    admin_name = "mongi"
    admin_email = "mongi@gmail.com"
    admin_password = "123456Aa."
    
    # Confirm password
    confirm_password = input("Confirm Password: ").strip()
    if admin_password != confirm_password:
        print("❌ Passwords do not match!")
        sys.exit(1)
    
    if len(admin_password) < 6:
        print("❌ Password must be at least 6 characters!")
        sys.exit(1)
    
    try:
        # Connect to database
        print("\n📡 Connecting to database...")
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Check if admin already exists
        check_query = "SELECT id_user, email FROM users WHERE email = %s"
        cursor.execute(check_query, (admin_email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            print(f"\n⚠️  User with email '{admin_email}' already exists!")
            response = input("Do you want to update this user to admin? (yes/no): ").strip().lower()
            if response == 'yes':
                # Update existing user to admin
                update_query = """
                UPDATE users 
                SET full_name = %s, 
                    pass_word = %s, 
                    rolee = 'admin'
                WHERE email = %s
                """
                hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                cursor.execute(update_query, (admin_name, hashed_password, admin_email))
                conn.commit()
                print(f"✅ User '{admin_email}' updated to admin successfully!")
            else:
                print("❌ Operation cancelled.")
                sys.exit(0)
        else:
            # Hash password
            print("🔐 Hashing password...")
            hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Insert admin user
            insert_query = """
            INSERT INTO users (full_name, email, pass_word, rolee, phone, adress, createdAT)
            VALUES (%s, %s, %s, 'admin', '', '', NOW())
            """
            
            print("💾 Creating admin user...")
            cursor.execute(insert_query, (admin_name, admin_email, hashed_password))
            conn.commit()
            
            print("\n" + "=" * 50)
            print("✅ Admin user created successfully!")
            print("=" * 50)
            print(f"   Name: {admin_name}")
            print(f"   Email: {admin_email}")
            print(f"   Password: {admin_password}")
            print(f"   Role: admin")
            print("\n⚠️  IMPORTANT: Change the password after first login!")
            print("\n📝 Next steps:")
            print("   1. Start your backend server: python run.py")
            print("   2. Start your frontend server: cd client && npm run dev")
            print("   3. Go to http://localhost:5173")
            print("   4. Login with the credentials above")
            print("   5. You will be redirected to /Home_admin")
            print("=" * 50)
        
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"\n❌ Database Error: {err}")
        print("\nTroubleshooting:")
        print("  1. Check your .env file has correct MySQL credentials")
        print("  2. Ensure MySQL server is running")
        print("  3. Verify database 'ECommerce' exists")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        create_admin_user()
    except KeyboardInterrupt:
        print("\n\n❌ Operation cancelled by user.")
        sys.exit(0)

