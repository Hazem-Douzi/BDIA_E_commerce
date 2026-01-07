from flask import Blueprint, request
from backend.controllers import auth_controller
from backend.middleware.auth_jwt import verify_token

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    """Route pour l'inscription"""
    data = request.get_json()
    return auth_controller.register_user(data)

@bp.route('/login', methods=['POST'])
def login():
    """Route pour la connexion"""
    data = request.get_json()
    return auth_controller.login_user(data)

@bp.route('/', methods=['GET'])
@verify_token
def protected_route():
    """Route protégée qui nécessite une authentification"""
    from flask import jsonify
    return jsonify({'message': 'Protected route accessed'}), 200

