from flask import Blueprint, request
from backend.controllers import payment_controller
from backend.middleware.auth_jwt import verify_token, check_role

bp = Blueprint('payment', __name__)

admin_only = check_role(['admin'])

@bp.route('/order/<int:order_id>', methods=['POST'])
@verify_token
def create_payment(order_id):
    """Crée un paiement pour une commande (client only)"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can create payments'}), 403
    data = request.get_json() or {}
    client_id = user.get('id')
    return payment_controller.create_payment(order_id, client_id, data)

@bp.route('/order/<int:order_id>', methods=['GET'])
@verify_token
def get_order_payment(order_id):
    """Récupère le paiement d'une commande"""
    user = request.user
    client_id = None
    if user.get('role') == 'client':
        client_id = user.get('id')
    return payment_controller.get_order_payment(order_id, client_id)

@bp.route('/<int:payment_id>/status', methods=['PUT'])
@admin_only
def update_payment_status(payment_id):
    """Met à jour le statut d'un paiement (admin only)"""
    data = request.get_json()
    return payment_controller.update_payment_status(payment_id, data)

