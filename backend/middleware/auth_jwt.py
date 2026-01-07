import jwt
from functools import wraps
from flask import request, jsonify, current_app

def verify_token(f):
    """Décorateur pour vérifier le token JWT"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'message': 'Access denied'}), 401
        
        try:
            token = auth_header.split(' ')[1]  # Format: "Bearer <token>"
        except IndexError:
            return jsonify({'message': 'Token missing'}), 401
        
        if not token:
            return jsonify({'message': 'Token missing'}), 401
        
        try:
            decoded = jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=['HS256'])
            request.user = decoded
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    
    return decorated


def check_role(allowed_roles):
    """Décorateur pour vérifier le rôle de l'utilisateur"""
    def decorator(f):
        @wraps(f)
        @verify_token
        def decorated(*args, **kwargs):
            if not hasattr(request, 'user') or request.user.get('role') not in allowed_roles:
                return jsonify({'message': 'Access denied: Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

