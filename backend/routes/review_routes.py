from flask import Blueprint, request
from backend.controllers import review_controller
from backend.middleware.auth_jwt import verify_token

bp = Blueprint('review', __name__)

@bp.route('/product/<int:product_id>', methods=['GET'])
def get_product_reviews(product_id):
    """Récupère tous les avis d'un produit (public)"""
    return review_controller.get_product_reviews(product_id)

@bp.route('/product/<int:product_id>', methods=['POST'])
@verify_token
def create_review(product_id):
    """Crée un avis pour un produit (client only)"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can create reviews'}), 403
    data = request.get_json()
    client_id = user.get('id') or user.get('id_user')
    return review_controller.create_review(client_id, product_id, data)

@bp.route('/<int:review_id>', methods=['PUT'])
@verify_token
def update_review(review_id):
    """Met à jour un avis (client only)"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can update reviews'}), 403
    data = request.get_json()
    client_id = user.get('id') or user.get('id_user')
    return review_controller.update_review(review_id, client_id, data)

@bp.route('/<int:review_id>', methods=['DELETE'])
@verify_token
def delete_review(review_id):
    """Supprime un avis (client only)"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can delete reviews'}), 403
    client_id = user.get('id') or user.get('id_user')
    return review_controller.delete_review(review_id, client_id)

@bp.route('/my-reviews', methods=['GET'])
@verify_token
def get_client_reviews():
    """Récupère tous les avis du client connecté"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can view their reviews'}), 403
    client_id = user.get('id') or user.get('id_user')
    return review_controller.get_client_reviews(client_id)

