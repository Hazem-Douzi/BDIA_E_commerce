from flask import Blueprint
from backend.controllers import admin_controller
from backend.middleware.auth_jwt import verify_token, check_role

bp = Blueprint('admin', __name__)

# Décorateur pour vérifier que l'utilisateur est admin
admin_only = check_role(['admin'])

# ============ UTILISATEURS ============
@bp.route('/users', methods=['GET'])
@admin_only
def get_all_users():
    return admin_controller.get_all_users()

@bp.route('/users/clients', methods=['GET'])
@admin_only
def get_all_clients():
    return admin_controller.get_all_clients()

@bp.route('/users/sellers', methods=['GET'])
@admin_only
def get_all_sellers():
    return admin_controller.get_all_sellers()

@bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_only
def update_user(user_id):
    return admin_controller.update_user(user_id)

@bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_only
def delete_user(user_id):
    return admin_controller.delete_user(user_id)

# ============ CATÉGORIES ============
@bp.route('/categories', methods=['GET'])
@admin_only
def get_all_categories():
    return admin_controller.get_all_categories()

@bp.route('/categories', methods=['POST'])
@admin_only
def create_category():
    return admin_controller.create_category()

@bp.route('/categories/<int:category_id>', methods=['PUT'])
@admin_only
def update_category(category_id):
    return admin_controller.update_category(category_id)

@bp.route('/categories/<int:category_id>', methods=['DELETE'])
@admin_only
def delete_category(category_id):
    return admin_controller.delete_category(category_id)

# ============ SOUS-CATÉGORIES ============
@bp.route('/subcategories', methods=['GET'])
@admin_only
def get_all_subcategories():
    return admin_controller.get_all_subcategories()

@bp.route('/subcategories', methods=['POST'])
@admin_only
def create_subcategory():
    return admin_controller.create_subcategory()

@bp.route('/subcategories/<int:subcategory_id>', methods=['PUT'])
@admin_only
def update_subcategory(subcategory_id):
    return admin_controller.update_subcategory(subcategory_id)

@bp.route('/subcategories/<int:subcategory_id>', methods=['DELETE'])
@admin_only
def delete_subcategory(subcategory_id):
    return admin_controller.delete_subcategory(subcategory_id)

# ============ PRODUITS ============
@bp.route('/products', methods=['GET'])
@admin_only
def get_all_products():
    return admin_controller.get_all_products()

@bp.route('/products/<int:product_id>', methods=['DELETE'])
@admin_only
def delete_product(product_id):
    return admin_controller.delete_product(product_id)

# ============ VENDEURS (VÉRIFICATION) ============
@bp.route('/sellers/<int:seller_id>/verification', methods=['PUT'])
@admin_only
def update_seller_verification(seller_id):
    return admin_controller.update_seller_verification(seller_id)

# ============ COMMANDES ============
@bp.route('/orders', methods=['GET'])
@admin_only
def get_all_orders():
    return admin_controller.get_all_orders()

@bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@admin_only
def update_order_status(order_id):
    return admin_controller.update_order_status(order_id)

# ============ STATISTIQUES ============
@bp.route('/stats', methods=['GET'])
@admin_only
def get_dashboard_stats():
    return admin_controller.get_dashboard_stats()

# ============ REVIEWS ============
@bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@admin_only
def delete_review(review_id):
    return admin_controller.delete_review(review_id)
