from flask import jsonify, request
from backend.database.dao import wishlist as wishlist_dao
from backend.database.dao import products as products_dao
from backend.database.dao import product_images as images_dao
from backend.controllers.serializers import (
    product_to_dict,
    product_image_to_dict,
    category_to_dict
)
from backend.database.dao import categories as categories_dao


def get_client_wishlist(client_id):
    """Get all products in client's wishlist with full product details."""
    try:
        wishlist_items = wishlist_dao.get_wishlist_by_client(client_id)
        result = []
        
        for item in wishlist_items:
            product = products_dao.get_product(item['id_product'])
            if not product:
                continue
                
            product_dict = product_to_dict(product)
            
            # Get product images
            product_images = images_dao.list_images_by_product(item['id_product'])
            product_dict['images'] = [product_image_to_dict(img) for img in product_images]
            
            # Get category if available
            if product.get('id_category'):
                category = categories_dao.get_category(product['id_category'])
                if category:
                    product_dict['category'] = category_to_dict(category)
            
            product_dict['wishlist_createdAt'] = item['wishlist_createdAt']
            product_dict['id_wishlist'] = item['id_wishlist']
            result.append(product_dict)
        
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def add_to_wishlist(client_id, product_id):
    """Add a product to client's wishlist."""
    try:
        # Check if product exists
        product = products_dao.get_product(product_id)
        if not product:
            return jsonify({"message": "Product not found"}), 404
        
        # Check if already in wishlist
        if wishlist_dao.is_product_in_wishlist(client_id, product_id):
            return jsonify({"message": "Product already in wishlist"}), 400
        
        wishlist_dao.add_to_wishlist(client_id, product_id)
        return jsonify({"message": "Product added to wishlist successfully"}), 201
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def remove_from_wishlist(client_id, product_id):
    """Remove a product from client's wishlist."""
    try:
        if not wishlist_dao.is_product_in_wishlist(client_id, product_id):
            return jsonify({"message": "Product not in wishlist"}), 404
        
        wishlist_dao.remove_from_wishlist(client_id, product_id)
        return jsonify({"message": "Product removed from wishlist successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def check_product_in_wishlist(client_id, product_id):
    """Check if a product is in client's wishlist."""
    try:
        is_in_wishlist = wishlist_dao.is_product_in_wishlist(client_id, product_id)
        return jsonify({"is_in_wishlist": is_in_wishlist}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_wishlist_count(client_id):
    """Get the count of products in client's wishlist."""
    try:
        wishlist_items = wishlist_dao.get_wishlist_by_client(client_id)
        count = len(wishlist_items) if wishlist_items else 0
        return jsonify({"count": count}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500
