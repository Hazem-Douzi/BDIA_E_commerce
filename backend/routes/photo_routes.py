from flask import Blueprint, request
from backend.controllers import photo_controller

bp = Blueprint('photos', __name__)

@bp.route('/upload/<int:product_id>', methods=['POST'])
def upload_photo(product_id):
    """Upload des photos pour un produit (jusqu'à 5 images)"""
    files = request.files.getlist('images')
    if len(files) > 5:
        return {'error': 'Maximum 5 images allowed'}, 400
    return photo_controller.add_photo(product_id, files)

@bp.route('/<int:product_id>', methods=['GET'])
def get_images(product_id):
    """Récupère toutes les images d'un produit"""
    return photo_controller.get_images_by_product(product_id)


