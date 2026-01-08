from flask import Blueprint, request
from backend.controllers import wishlist_controller
from backend.middleware.auth_jwt import verify_token

bp = Blueprint('wishlist', __name__)

@bp.route('/', methods=['GET'])
@verify_token
def get_wishlist():
    """Récupère tous les produits de la wishlist du client connecté"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can view wishlist'}), 403
    client_id = user.get('id') or user.get('id_user')
    return wishlist_controller.get_client_wishlist(client_id)

@bp.route('/count', methods=['GET'])
@verify_token
def get_wishlist_count():
    """Récupère le nombre de produits dans la wishlist du client"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can view wishlist count'}), 403
    client_id = user.get('id') or user.get('id_user')
    return wishlist_controller.get_wishlist_count(client_id)

@bp.route('/<int:product_id>', methods=['POST'])
@verify_token
def add_product_to_wishlist(product_id):
    """Ajoute un produit à la wishlist du client"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can add to wishlist'}), 403
    client_id = user.get('id') or user.get('id_user')
    return wishlist_controller.add_to_wishlist(client_id, product_id)

@bp.route('/<int:product_id>', methods=['DELETE'])
@verify_token
def remove_product_from_wishlist(product_id):
    """Retire un produit de la wishlist du client"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can remove from wishlist'}), 403
    client_id = user.get('id') or user.get('id_user')
    return wishlist_controller.remove_from_wishlist(client_id, product_id)

@bp.route('/<int:product_id>/check', methods=['GET'])
@verify_token
def check_product_in_wishlist(product_id):
    """Vérifie si un produit est dans la wishlist du client"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can check wishlist'}), 403
    client_id = user.get('id') or user.get('id_user')
    return wishlist_controller.check_product_in_wishlist(client_id, product_id)
