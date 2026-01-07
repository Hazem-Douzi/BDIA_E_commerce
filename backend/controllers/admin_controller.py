from flask import jsonify, request, current_app
from backend import db
from backend.models import (
    User, Category, SubCategory, Product, ProductImage,
    Review, Order, OrderItem, Payment, SellerProfile
)
import os

# ============ GESTION DES UTILISATEURS ============

def get_all_users():
    """Récupère tous les utilisateurs"""
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def get_all_clients():
    """Récupère tous les clients"""
    try:
        clients = User.query.filter_by(rolee='client').all()
        return jsonify([client.to_dict() for client in clients]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def get_all_sellers():
    """Récupère tous les vendeurs avec leur profil"""
    try:
        sellers = User.query.filter_by(rolee='seller').all()
        result = []
        for seller in sellers:
            seller_dict = seller.to_dict()
            if seller.seller_profile:
                seller_dict['seller_profile'] = seller.seller_profile.to_dict()
            result.append(seller_dict)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def update_user(user_id):
    """Met à jour un utilisateur"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'email' in data:
            # Vérifier si l'email n'est pas déjà utilisé
            existing = User.query.filter_by(email=data['email']).first()
            if existing and existing.id_user != user_id:
                return jsonify({'message': 'Email already in use'}), 400
            user.email = data['email']
        if 'phone' in data:
            user.phone = data['phone']
        if 'adress' in data:
            user.adress = data['adress']
        if 'rolee' in data and data['rolee'] in ['admin', 'client', 'seller']:
            user.rolee = data['rolee']
        
        db.session.commit()
        return jsonify({'message': 'User updated successfully', 'user': user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def delete_user(user_id):
    """Supprime un utilisateur"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# ============ GESTION DES CATÉGORIES ============

def create_category():
    """Crée une catégorie"""
    try:
        data = request.get_json()
        category = Category(
            category_name=data.get('category_name'),
            category_description=data.get('category_description'),
            image=data.get('image')
        )
        db.session.add(category)
        db.session.commit()
        return jsonify({'message': 'Category created successfully', 'category': category.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def get_all_categories():
    """Récupère toutes les catégories"""
    try:
        categories = Category.query.all()
        result = []
        for cat in categories:
            cat_dict = cat.to_dict()
            cat_dict['subcategories'] = [sub.to_dict() for sub in cat.subcategories]
            result.append(cat_dict)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def update_category(category_id):
    """Met à jour une catégorie"""
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'message': 'Category not found'}), 404
        
        data = request.get_json()
        if 'category_name' in data:
            category.category_name = data['category_name']
        if 'category_description' in data:
            category.category_description = data['category_description']
        if 'image' in data:
            category.image = data['image']
        
        db.session.commit()
        return jsonify({'message': 'Category updated successfully', 'category': category.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def delete_category(category_id):
    """Supprime une catégorie"""
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'message': 'Category not found'}), 404
        
        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': 'Category deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# ============ GESTION DES SOUS-CATÉGORIES ============

def create_subcategory():
    """Crée une sous-catégorie"""
    try:
        data = request.get_json()
        subcategory = SubCategory(
            SubCategory_name=data.get('SubCategory_name'),
            id_category=data.get('id_category'),
            SubCategory_description=data.get('SubCategory_description')
        )
        db.session.add(subcategory)
        db.session.commit()
        return jsonify({'message': 'SubCategory created successfully', 'subcategory': subcategory.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def get_all_subcategories():
    """Récupère toutes les sous-catégories"""
    try:
        subcategories = SubCategory.query.all()
        return jsonify([sub.to_dict() for sub in subcategories]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def update_subcategory(subcategory_id):
    """Met à jour une sous-catégorie"""
    try:
        subcategory = SubCategory.query.get(subcategory_id)
        if not subcategory:
            return jsonify({'message': 'SubCategory not found'}), 404
        
        data = request.get_json()
        if 'SubCategory_name' in data:
            subcategory.SubCategory_name = data['SubCategory_name']
        if 'id_category' in data:
            subcategory.id_category = data['id_category']
        if 'SubCategory_description' in data:
            subcategory.SubCategory_description = data['SubCategory_description']
        
        db.session.commit()
        return jsonify({'message': 'SubCategory updated successfully', 'subcategory': subcategory.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def delete_subcategory(subcategory_id):
    """Supprime une sous-catégorie"""
    try:
        subcategory = SubCategory.query.get(subcategory_id)
        if not subcategory:
            return jsonify({'message': 'SubCategory not found'}), 404
        
        db.session.delete(subcategory)
        db.session.commit()
        return jsonify({'message': 'SubCategory deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# ============ GESTION DES PRODUITS ============

def get_all_products():
    """Récupère tous les produits avec leurs images"""
    try:
        products = Product.query.all()
        result = []
        for product in products:
            product_dict = product.to_dict()
            product_dict['images'] = [img.to_dict() for img in product.images]
            if product.seller_user:
                product_dict['seller'] = product.seller_user.to_dict()
            if product.subcategory:
                product_dict['subcategory'] = product.subcategory.to_dict()
            result.append(product_dict)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def delete_product(product_id):
    """Supprime un produit"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
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
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# ============ GESTION DES VENDEURS (VÉRIFICATION) ============

def update_seller_verification(seller_id):
    """Met à jour le statut de vérification d'un vendeur"""
    try:
        user = User.query.get(seller_id)
        if not user or user.rolee != 'seller':
            return jsonify({'message': 'Seller not found'}), 404
        
        data = request.get_json()
        status = data.get('verification_status')
        
        if status not in ['pending', 'verified', 'rejected']:
            return jsonify({'message': 'Invalid verification status'}), 400
        
        # Créer le profil s'il n'existe pas
        if not user.seller_profile:
            seller_profile = SellerProfile(
                id_user=user.id_user,
                shop_name=data.get('shop_name', f"{user.full_name}'s Shop"),
                shop_description=data.get('shop_description', ''),
                verification_status=status
            )
            db.session.add(seller_profile)
        else:
            user.seller_profile.verification_status = status
            if 'shop_name' in data:
                user.seller_profile.shop_name = data['shop_name']
            if 'shop_description' in data:
                user.seller_profile.shop_description = data['shop_description']
        
        db.session.commit()
        return jsonify({
            'message': 'Seller verification updated successfully',
            'seller_profile': user.seller_profile.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# ============ GESTION DES COMMANDES ============

def get_all_orders():
    """Récupère toutes les commandes"""
    try:
        orders = Order.query.order_by(Order.order_createdAt.desc()).all()
        result = []
        for order in orders:
            order_dict = order.to_dict()
            order_dict['items'] = [item.to_dict() for item in order.items]
            if order.client_user:
                order_dict['client'] = order.client_user.to_dict()
            if order.payment:
                order_dict['payment'] = order.payment.to_dict()
            result.append(order_dict)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def update_order_status(order_id):
    """Met à jour le statut d'une commande"""
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        data = request.get_json()
        if 'order_status' in data:
            if data['order_status'] not in ['processing', 'shipped', 'delivered', 'cancelled']:
                return jsonify({'message': 'Invalid order status'}), 400
            order.order_status = data['order_status']
        
        if 'payment_status' in data:
            if data['payment_status'] not in ['pending', 'paid', 'failed']:
                return jsonify({'message': 'Invalid payment status'}), 400
            order.payment_status = data['payment_status']
        
        db.session.commit()
        return jsonify({'message': 'Order updated successfully', 'order': order.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# ============ STATISTIQUES ============

def get_dashboard_stats():
    """Récupère les statistiques du dashboard admin"""
    try:
        stats = {
            'total_users': User.query.count(),
            'total_clients': User.query.filter_by(rolee='client').count(),
            'total_sellers': User.query.filter_by(rolee='seller').count(),
            'total_products': Product.query.count(),
            'total_orders': Order.query.count(),
            'pending_orders': Order.query.filter_by(order_status='processing').count(),
            'total_categories': Category.query.count(),
            'pending_seller_verifications': SellerProfile.query.filter_by(verification_status='pending').count()
        }
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

