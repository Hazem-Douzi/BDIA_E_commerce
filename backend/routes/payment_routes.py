from flask import Blueprint, request
from backend.controllers import payment_controller
from backend.controllers import stripe_controller
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
    client_id = user.get('id') or user.get('id_user')
    return payment_controller.create_payment(order_id, client_id, data)

@bp.route('/order/<int:order_id>', methods=['GET'])
@verify_token
def get_order_payment(order_id):
    """Récupère le paiement d'une commande"""
    user = request.user
    client_id = None
    if user.get('role') == 'client':
        client_id = user.get('id') or user.get('id_user')
    return payment_controller.get_order_payment(order_id, client_id)

@bp.route('/<int:payment_id>/status', methods=['PUT'])
@admin_only
def update_payment_status(payment_id):
    """Met à jour le statut d'un paiement (admin only)"""
    data = request.get_json()
    return payment_controller.update_payment_status(payment_id, data)

# Stripe Payment Routes
@bp.route('/stripe/create-checkout', methods=['POST'])
@verify_token
def create_stripe_checkout():
    """Crée une session Stripe Checkout"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can create payments'}), 403
    
    data = request.get_json()
    order_id = data.get('order_id')
    amount = data.get('amount')
    currency = data.get('currency', 'mad')  # Stripe uses lowercase currency codes
    client_id = user.get('id') or user.get('id_user')
    
    if not order_id or not amount:
        from flask import jsonify
        return jsonify({'message': 'order_id and amount are required'}), 400
    
    return stripe_controller.create_stripe_checkout_session(order_id, client_id, amount, currency)

@bp.route('/stripe/verify/<session_id>', methods=['GET'])
def verify_stripe_payment(session_id):
    """Vérifie le statut d'un paiement Stripe (public endpoint)"""
    return stripe_controller.verify_stripe_payment(session_id)

@bp.route('/stripe/webhook', methods=['POST'])
def webhook_stripe_payment():
    """Webhook Stripe pour les mises à jour de statut (public endpoint)"""
    return stripe_controller.webhook_stripe_payment()

@bp.route('/stripe/config', methods=['GET'])
def get_stripe_config():
    """Récupère la clé publique Stripe pour le frontend (public endpoint)"""
    return stripe_controller.get_stripe_config()
