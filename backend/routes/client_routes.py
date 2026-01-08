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

@bp.route('/home', methods=['GET'])
def get_client_home():
    """Récupère les données pour la page d'accueil client"""
    return client_controller.get_client_home_data()

@bp.route('/home/featured', methods=['GET'])
def get_featured_products():
    """Récupère les produits en vedette"""
    limit = request.args.get('limit', 10, type=int)
    return client_controller.get_featured_products(limit)

@bp.route('/home/categories', methods=['GET'])
def get_home_categories():
    """Récupère les catégories pour la page d'accueil"""
    return client_controller.get_home_categories()

@bp.route('/products/search', methods=['GET'])
def search_products():
    """Recherche des produits"""
    query = request.args.get('q', '')
    category_id = request.args.get('category_id', type=int)
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    sort_by = request.args.get('sort_by', 'createdAtt')
    sort_order = request.args.get('sort_order', 'desc')
    limit = request.args.get('limit', 20, type=int)
    offset = request.args.get('offset', 0, type=int)

    return client_controller.search_products(
        query=query,
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        sort_order=sort_order,
        limit=limit,
        offset=offset
    )

@bp.route('/products/category/<int:category_id>', methods=['GET'])
def get_products_by_category(category_id):
    """Récupère les produits d'une catégorie"""
    limit = request.args.get('limit', 20, type=int)
    offset = request.args.get('offset', 0, type=int)
    sort_by = request.args.get('sort_by', 'createdAtt')
    sort_order = request.args.get('sort_order', 'desc')

    return client_controller.get_products_by_category(
        category_id, limit=limit, offset=offset,
        sort_by=sort_by, sort_order=sort_order
    )

@bp.route('/products/<int:product_id>', methods=['GET'])
def get_product_details(product_id):
    """Récupère les détails d'un produit"""
    return client_controller.get_product_details(product_id)

@bp.route('/home/recommendations', methods=['GET'])
@verify_token
def get_personalized_recommendations():
    """Récupère les recommandations personnalisées pour le client connecté"""
    user = request.user
    if user.get('role') != 'client':
        from flask import jsonify
        return jsonify({'message': 'Unauthorized: Only clients can access recommendations'}), 403
    client_id = user.get('id')
    limit = request.args.get('limit', 10, type=int)
    return client_controller.get_personalized_recommendations(client_id, limit)
