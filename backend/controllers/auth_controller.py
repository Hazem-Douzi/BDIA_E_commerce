import jwt
import bcrypt
from flask import jsonify, current_app
from backend import db
from backend.models import User

def register_user(data):
    """Gère l'inscription d'un utilisateur (admin, client ou seller)"""
    email = data.get('email')
    full_name = data.get('fullName') or data.get('full_name')
    password = data.get('password')
    role = data.get('role') or data.get('rolee', 'client')
    phone = data.get('phone', '')
    address = data.get('address') or data.get('adress', '')
    
    if not email or not password or not full_name:
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Normaliser le rôle
    if role not in ['admin', 'client', 'seller']:
        return jsonify({'message': 'Invalid role. Must be admin, client, or seller'}), 400
    
    try:
        # Vérifier si l'email existe déjà
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'message': 'Email already exists'}), 400
        
        # Hasher le mot de passe
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(10)).decode('utf-8')
        
        # Créer l'utilisateur
        user = User(
            email=email,
            full_name=full_name,
            pass_word=hashed_password,
            rolee=role,
            phone=phone,
            adress=address
        )
        db.session.add(user)
        db.session.commit()
        
        # Si c'est un seller, créer un profil seller par défaut
        if role == 'seller':
            from backend.models import SellerProfile
            seller_profile = SellerProfile(
                id_user=user.id_user,
                shop_name=f"{full_name}'s Shop",
                shop_description="",
                verification_status="pending"
            )
            db.session.add(seller_profile)
            db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'userId': user.id_user,
            'role': user.rolee
        }), 201
        
    except Exception as error:
        db.session.rollback()
        return jsonify({'message': str(error)}), 500


def login_user(data):
    """Gère la connexion d'un utilisateur"""
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        # Chercher l'utilisateur
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Vérifier le mot de passe
        if not bcrypt.checkpw(password.encode('utf-8'), user.pass_word.encode('utf-8')):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Générer le token JWT
        from datetime import datetime, timedelta
        token = jwt.encode(
            {
                'id': user.id_user,
                'role': user.rolee,
                'email': user.email,
                'exp': datetime.utcnow() + timedelta(hours=24)
            },
            current_app.config['JWT_SECRET'],
            algorithm='HS256'
        )
        
        # jwt.encode retourne une string en Python 3
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'userId': user.id_user,
            'username': user.full_name,
            'email': user.email,
            'role': user.rolee
        }), 200
        
    except Exception as error:
        return jsonify({'message': str(error)}), 500
