from flask import Blueprint, request
from backend.controllers import seller_controller
from backend.middleware.auth_jwt import verify_token

bp = Blueprint('seller', __name__)

@bp.route('/profile', methods=['GET'])
@verify_token
def get_seller_profile():
    """Récupère le profil du vendeur connecté"""
    user = request.user
    if user.get('role') != 'seller':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only sellers can access this'}), 403
    seller_id = user.get('id')
    return seller_controller.get_seller_profile(seller_id)

@bp.route('/profile', methods=['PUT'])
@verify_token
def update_seller_profile():
    """Met à jour le profil du vendeur connecté"""
    user = request.user
    if user.get('role') != 'seller':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only sellers can update their profile'}), 403
    data = request.get_json()
    seller_id = user.get('id')
    return seller_controller.update_seller_profile(seller_id, data)

@bp.route('/orders', methods=['GET'])
@verify_token
def get_seller_orders():
    """Récupère les commandes du vendeur"""
    user = request.user
    if user.get('role') != 'seller':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only sellers can view orders'}), 403
    seller_id = user.get('id')
    return seller_controller.get_seller_orders(seller_id)

@bp.route('/stats', methods=['GET'])
@verify_token
def get_seller_stats():
    """Récupère les statistiques du vendeur"""
    user = request.user
    if user.get('role') != 'seller':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only sellers can view stats'}), 403
    seller_id = user.get('id')
    return seller_controller.get_seller_stats(seller_id)
