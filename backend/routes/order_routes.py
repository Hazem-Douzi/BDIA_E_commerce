from flask import Blueprint, request
from backend.controllers import order_controller
from backend.middleware.auth_jwt import verify_token

bp = Blueprint('order', __name__)

@bp.route('/', methods=['POST'])
@verify_token
def create_order():
    """Crée une commande à partir du panier"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can create orders'}), 403
    data = request.get_json() or {}
    client_id = user.get('id') or user.get('id_user')
    return order_controller.create_order(client_id, data)

@bp.route('/', methods=['GET'])
@verify_token
def get_client_orders():
    """Récupère toutes les commandes du client connecté"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can view orders'}), 403
    client_id = user.get('id') or user.get('id_user')
    return order_controller.get_client_orders(client_id)

@bp.route('/<int:order_id>', methods=['GET'])
@verify_token
def get_order(order_id):
    """Récupère une commande par ID"""
    user = request.user
    client_id = None
    if user.get('role') == 'client':
        client_id = user.get('id') or user.get('id_user')
    return order_controller.get_order(order_id, client_id)

@bp.route('/<int:order_id>/cancel', methods=['PUT'])
@verify_token
def cancel_order(order_id):
    """Annule une commande"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can cancel orders'}), 403
    client_id = user.get('id') or user.get('id_user')
    return order_controller.cancel_order(order_id, client_id)

