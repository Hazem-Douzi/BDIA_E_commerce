import jwt
import bcrypt
import logging
from flask import jsonify, current_app
from backend.database.dao import users as users_dao
from backend.database.dao import seller_profiles as seller_profiles_dao


def register_user(data):
    """Handle user registration."""
    email = data.get("email")
    full_name = data.get("fullName") or data.get("full_name")
    password = data.get("password") or data.get("pass_word")  # Support both formats
    role = data.get("role") or data.get("rolee", "client")
    phone = data.get("phone", "")
    address = data.get("address") or data.get("adress", "")

    if not email or not password or not full_name:
        return jsonify({"message": "Missing required fields"}), 400

    if role not in ["admin", "client", "seller"]:
        return jsonify({"message": "Invalid role. Must be admin, client, or seller"}), 400

    try:
        existing_user = users_dao.get_user_by_email(email)
        if existing_user:
            return jsonify({"message": "Email already exists"}), 400

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(10)).decode("utf-8")
        user_id = users_dao.create_user(full_name, email, hashed_password, role, phone, address)

        if role == "seller":
            seller_profiles_dao.create_profile(
                user_id,
                f"{full_name}'s Shop",
                "",
                "pending",
            )

        return jsonify({
            "message": "User registered successfully",
            "userId": user_id,
            "role": role,
        }), 201
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def login_user(data):
    """Handle user login."""
    if not data:
        return jsonify({"message": "Request body is required"}), 400
    
    email = data.get("email") or data.get("Email")
    password = data.get("password") or data.get("Password")

    if not email or not password:
        return jsonify({"message": "Missing required fields: email and password are required"}), 400

    try:
        user = users_dao.get_user_by_email(email)
        if not user:
            return jsonify({"message": "Account does not exist"}), 404

        try:
            password_ok = bcrypt.checkpw(
                password.encode("utf-8"),
                user["pass_word"].encode("utf-8"),
            )
        except Exception:
            logging.getLogger(__name__).exception("Password verification failed")
            return jsonify({"message": "Authentication error"}), 500

        if not password_ok:
            return jsonify({"message": "Invalid credentials"}), 401

        from datetime import datetime, timedelta
        token = jwt.encode(
            {
                "id": user["id_user"],
                "role": user["rolee"],
                "email": user["email"],
                "exp": datetime.utcnow() + timedelta(hours=24),
            },
            current_app.config["JWT_SECRET"],
            algorithm="HS256",
        )

        if isinstance(token, bytes):
            token = token.decode("utf-8")

        return jsonify({
            "message": "Login successful",
            "token": token,
            "userId": user["id_user"],
            "username": user["full_name"],
            "email": user["email"],
            "role": user["rolee"],
        }), 200
    except Exception as error:
        logging.getLogger(__name__).exception("Login failed")
        return jsonify({"message": str(error)}), 500
