from flask import Blueprint, request
from backend.controllers import client_controller
from backend.middleware.auth_jwt import verify_token

bp = Blueprint('client', __name__)

@bp.route('/profile', methods=['GET'])
@verify_token
def get_client_profile():
    """Récupère le profil du client connecté"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can access this'}), 403
    client_id = user.get('id')
    return client_controller.get_client_profile(client_id)

@bp.route('/profile', methods=['PUT'])
@verify_token
def update_client_profile():
    """Met à jour le profil du client connecté"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can update their profile'}), 403
    data = request.get_json()
    client_id = user.get('id')
    return client_controller.update_client_profile(client_id, data)
