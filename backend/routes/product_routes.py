from flask import Blueprint, request
from backend.controllers import product_controller
from backend.middleware.auth_jwt import verify_token

bp = Blueprint('product', __name__)

@bp.route('/All', methods=['GET'])
def get_all():
    """Récupère tous les produits (public)"""
    return product_controller.get_all_products()

@bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Récupère un produit par ID (public)"""
    return product_controller.get_product_by_id(product_id)

@bp.route('/spec/<int:seller_id>', methods=['GET'])
def get_products_by_seller(seller_id):
    """Récupère tous les produits d'un vendeur spécifique (public)"""
    return product_controller.get_all_products_by_seller(seller_id)

@bp.route('/search', methods=['GET'])
def search_product():
    """Recherche des produits (public)"""
    query_params = request.args.to_dict()
    return product_controller.search_products(query_params)

@bp.route('/add', methods=['POST'])
@verify_token
def add_product():
    """Ajoute un nouveau produit (seller only)"""
    from flask import request as req
    user = req.user
    if user.get('role') != 'seller':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only sellers can add products'}), 403
    data = req.get_json()
    seller_id = user.get('id')
    return product_controller.add_product(data, seller_id)

@bp.route('/delete/<int:product_id>', methods=['DELETE'])
@verify_token
def delete_product(product_id):
    """Supprime un produit (seller ou admin)"""
    from flask import request as req
    user = req.user
    seller_id = None
    if user.get('role') == 'seller':
        seller_id = user.get('id')
    return product_controller.delete_product(product_id, seller_id)

@bp.route('/update/<int:product_id>', methods=['PUT'])
@verify_token
def update_product(product_id):
    """Met à jour un produit (seller ou admin)"""
    from flask import request as req
    user = req.user
    data = req.get_json()
    seller_id = None
    if user.get('role') == 'seller':
        seller_id = user.get('id')
    return product_controller.update_product(product_id, data, seller_id)
