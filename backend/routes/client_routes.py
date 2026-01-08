from flask import Blueprint, request
from backend.controllers import client_controller
from backend.controllers import payment_card_controller
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
    client_id = user.get('id') or user.get('id_user')
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
    client_id = user.get('id') or user.get('id_user')
    return client_controller.update_client_profile(client_id, data)

# Payment Cards Routes
@bp.route('/payment-cards', methods=['GET'])
@verify_token
def get_payment_cards():
    """Récupère toutes les cartes de paiement du client"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can access this'}), 403
    client_id = user.get('id') or user.get('id_user')
    return payment_card_controller.get_client_payment_cards(client_id)

@bp.route('/payment-cards', methods=['POST'])
@verify_token
def create_payment_card():
    """Crée une nouvelle carte de paiement"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can create payment cards'}), 403
    data = request.get_json()
    client_id = user.get('id') or user.get('id_user')
    return payment_card_controller.create_payment_card(client_id, data)

@bp.route('/payment-cards/<int:card_id>', methods=['PUT'])
@verify_token
def update_payment_card(card_id):
    """Met à jour une carte de paiement"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can update payment cards'}), 403
    data = request.get_json()
    client_id = user.get('id') or user.get('id_user')
    return payment_card_controller.update_payment_card(card_id, client_id, data)

@bp.route('/payment-cards/<int:card_id>', methods=['DELETE'])
@verify_token
def delete_payment_card(card_id):
    """Supprime une carte de paiement"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can delete payment cards'}), 403
    client_id = user.get('id') or user.get('id_user')
    return payment_card_controller.delete_payment_card(card_id, client_id)
