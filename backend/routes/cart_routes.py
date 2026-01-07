from flask import Blueprint, request
from backend.controllers import cart_controller
from backend.middleware.auth_jwt import verify_token

bp = Blueprint('cart', __name__)

@bp.route('/', methods=['GET'])
@verify_token
def get_cart():
    """Récupère le panier du client connecté"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can access cart'}), 403
    client_id = user.get('id')
    return cart_controller.get_cart(client_id)

@bp.route('/add', methods=['POST'])
@verify_token
def add_to_cart():
    """Ajoute un produit au panier"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can add to cart'}), 403
    data = request.get_json()
    client_id = user.get('id')
    return cart_controller.add_to_cart(client_id, data)

@bp.route('/item/<int:cart_item_id>', methods=['PUT'])
@verify_token
def update_cart_item(cart_item_id):
    """Met à jour un article du panier"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can update cart'}), 403
    data = request.get_json()
    client_id = user.get('id')
    return cart_controller.update_cart_item(cart_item_id, client_id, data)

@bp.route('/item/<int:cart_item_id>', methods=['DELETE'])
@verify_token
def remove_from_cart(cart_item_id):
    """Supprime un article du panier"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can remove from cart'}), 403
    client_id = user.get('id')
    return cart_controller.remove_from_cart(cart_item_id, client_id)

@bp.route('/clear', methods=['DELETE'])
@verify_token
def clear_cart():
    """Vide le panier"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can clear cart'}), 403
    client_id = user.get('id')
    return cart_controller.clear_cart(client_id)

