from flask import Blueprint
from backend.controllers import admin_controller
from backend.middleware.auth_jwt import check_role

bp = Blueprint('category', __name__)

# Routes publiques pour les catégories
# Note: /api/category (without trailing slash) is handled directly in __init__.py
# to prevent redirects during CORS preflight requests
@bp.route('/', methods=['GET'])
def get_all_categories():
    """Récupère toutes les catégories (public)"""
    return admin_controller.get_all_categories()

