from flask import jsonify, request, current_app
from sqlalchemy import or_, and_
from backend import db
from backend.models import Product, ProductImage, SubCategory, User
import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_all_products():
    """Récupère tous les produits avec leurs images"""
    try:
        products = Product.query.all()
        result = []
        for product in products:
            product_dict = product.to_dict()
            product_dict['images'] = [img.to_dict() for img in product.images]
            if product.subcategory:
                product_dict['subcategory'] = product.subcategory.to_dict()
                if product.subcategory.category:
                    product_dict['category'] = product.subcategory.category.to_dict()
            if product.seller_user:
                seller_dict = product.seller_user.to_dict()
                if product.seller_user.seller_profile:
                    seller_dict['seller_profile'] = product.seller_user.seller_profile.to_dict()
                product_dict['seller'] = seller_dict
            result.append(product_dict)
        return jsonify(result), 200
    except Exception as error:
        return jsonify({'message': str(error)}), 500


def get_product_by_id(product_id):
    """Récupère un produit par son ID"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        product_dict = product.to_dict()
        product_dict['images'] = [img.to_dict() for img in product.images]
        if product.subcategory:
            product_dict['subcategory'] = product.subcategory.to_dict()
            if product.subcategory.category:
                product_dict['category'] = product.subcategory.category.to_dict()
        if product.seller_user:
            seller_dict = product.seller_user.to_dict()
            if product.seller_user.seller_profile:
                seller_dict['seller_profile'] = product.seller_user.seller_profile.to_dict()
            product_dict['seller'] = seller_dict
        return jsonify(product_dict), 200
    except Exception as error:
        return jsonify({'message': str(error)}), 500


def get_all_products_by_seller(seller_id):
    """Récupère tous les produits d'un vendeur spécifique"""
    try:
        products = Product.query.filter_by(id_seller=seller_id).all()
        result = []
        for product in products:
            product_dict = product.to_dict()
            product_dict['images'] = [img.to_dict() for img in product.images]
            if product.subcategory:
                product_dict['subcategory'] = product.subcategory.to_dict()
            result.append(product_dict)
        return jsonify(result), 200
    except Exception as error:
        return jsonify({'message': str(error)}), 500


def add_product(data, seller_id):
    """Ajoute un nouveau produit"""
    try:
        product = Product(
            product_name=data.get('product_name'),
            brand=data.get('brand'),
            product_description=data.get('product_description'),
            price=data.get('price'),
            stock=data.get('stock', 0),
            rating=data.get('rating', 0.0),
            id_seller=seller_id,
            id_SubCategory=data.get('id_SubCategory')
        )
        db.session.add(product)
        db.session.flush()  # Pour obtenir l'ID du produit
        
        # Ajouter les images si fournies
        images = data.get('images', [])
        for image_url in images:
            if image_url:
                product_image = ProductImage(
                    imageURL=image_url,
                    id_product=product.id_product
                )
                db.session.add(product_image)
        
        db.session.commit()
        
        product_dict = product.to_dict()
        product_dict['images'] = [img.to_dict() for img in product.images]
        return jsonify({'message': 'Product added successfully', 'product': product_dict}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({'message': str(error)}), 400


def delete_product(product_id, seller_id=None):
    """Supprime un produit"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        # Vérifier que le vendeur est propriétaire du produit (si seller_id fourni)
        if seller_id and product.id_seller != seller_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        # Supprimer les images associées
        for image in product.images:
            if image.imageURL:
                image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], os.path.basename(image.imageURL))
                if os.path.exists(image_path):
                    try:
                        os.remove(image_path)
                    except:
                        pass
        
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({'message': str(error)}), 400


def update_product(product_id, data, seller_id=None):
    """Met à jour un produit"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        # Vérifier que le vendeur est propriétaire du produit (si seller_id fourni)
        if seller_id and product.id_seller != seller_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        # Mettre à jour les champs
        if 'product_name' in data:
            product.product_name = data['product_name']
        if 'brand' in data:
            product.brand = data['brand']
        if 'product_description' in data:
            product.product_description = data['product_description']
        if 'price' in data:
            product.price = data['price']
        if 'stock' in data:
            product.stock = data['stock']
        if 'rating' in data:
            product.rating = data['rating']
        if 'id_SubCategory' in data:
            product.id_SubCategory = data['id_SubCategory']
        
        # Mettre à jour les images si fournies
        if 'images' in data:
            # Supprimer les anciennes images
            for image in product.images:
                if image.imageURL:
                    image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], os.path.basename(image.imageURL))
                    if os.path.exists(image_path):
                        try:
                            os.remove(image_path)
                        except:
                            pass
                db.session.delete(image)
            
            # Ajouter les nouvelles images
            for image_url in data['images']:
                if image_url:
                    product_image = ProductImage(
                        imageURL=image_url,
                        id_product=product.id_product
                    )
                    db.session.add(product_image)
        
        from datetime import datetime
        product.updatedAt = datetime.utcnow()
        
        db.session.commit()
        
        product_dict = product.to_dict()
        product_dict['images'] = [img.to_dict() for img in product.images]
        return jsonify({'message': 'Product updated successfully', 'product': product_dict}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({'message': str(error)}), 400


def search_products(query_params):
    """Recherche des produits selon plusieurs critères"""
    try:
        search_conditions = []
        
        name = query_params.get('name')
        if name:
            search_conditions.append(Product.product_name.like(f'%{name}%'))
        
        brand = query_params.get('brand')
        if brand:
            search_conditions.append(Product.brand.like(f'%{brand}%'))
        
        category = query_params.get('category')
        if category:
            search_conditions.append(SubCategory.SubCategory_name.like(f'%{category}%'))
        
        min_price = query_params.get('minPrice')
        max_price = query_params.get('maxPrice')
        if min_price and max_price:
            search_conditions.append(Product.price.between(float(min_price), float(max_price)))
        elif min_price:
            search_conditions.append(Product.price >= float(min_price))
        elif max_price:
            search_conditions.append(Product.price <= float(max_price))
        
        subcategory_id = query_params.get('subcategory')
        if subcategory_id:
            search_conditions.append(Product.id_SubCategory == int(subcategory_id))
        
        stock = query_params.get('stock')
        if stock:
            if stock.lower() == 'available':
                search_conditions.append(Product.stock > 0)
            elif stock.lower() == 'out':
                search_conditions.append(Product.stock == 0)
        
        if search_conditions:
            products = Product.query.filter(and_(*search_conditions)).all()
        else:
            products = Product.query.all()
        
        result = []
        for product in products:
            product_dict = product.to_dict()
            product_dict['images'] = [img.to_dict() for img in product.images]
            if product.subcategory:
                product_dict['subcategory'] = product.subcategory.to_dict()
            result.append(product_dict)
        
        return jsonify(result), 200
    except Exception as error:
        return jsonify({'message': str(error)}), 500
