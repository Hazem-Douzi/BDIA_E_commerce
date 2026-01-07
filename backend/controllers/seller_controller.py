import bcrypt
from flask import jsonify
from backend import db
from backend.models import User, SellerProfile, Product, Order, OrderItem

def get_seller_profile(seller_id):
    """Récupère le profil d'un vendeur"""
    try:
        seller = User.query.get(seller_id)
        if not seller or seller.rolee != 'seller':
            return jsonify({'message': 'Seller not found'}), 404
        
        seller_dict = seller.to_dict()
        if seller.seller_profile:
            seller_dict['seller_profile'] = seller.seller_profile.to_dict()
        
        # Statistiques du vendeur
        products = Product.query.filter_by(id_seller=seller_id).all()
        seller_dict['stats'] = {
            'total_products': len(products),
            'verified': seller.seller_profile.verification_status == 'verified' if seller.seller_profile else False
        }
        
        return jsonify(seller_dict), 200
    except Exception as error:
        return jsonify({'message': str(error)}), 500

def update_seller_profile(seller_id, data):
    """Met à jour le profil d'un vendeur"""
    try:
        seller = User.query.get(seller_id)
        if not seller or seller.rolee != 'seller':
            return jsonify({'message': 'Seller not found'}), 404
        
        # Mettre à jour les informations utilisateur
        if 'full_name' in data:
            seller.full_name = data['full_name']
        if 'phone' in data:
            seller.phone = data['phone']
        if 'adress' in data:
            seller.adress = data['adress']
        if 'email' in data:
            # Vérifier que l'email n'est pas déjà utilisé
            existing = User.query.filter_by(email=data['email']).first()
            if existing and existing.id_user != seller_id:
                return jsonify({'message': 'Email already in use'}), 400
            seller.email = data['email']
        if 'password' in data and data['password']:
            seller.pass_word = bcrypt.hashpw(
                data['password'].encode('utf-8'),
                bcrypt.gensalt(10)
            ).decode('utf-8')
        
        # Créer ou mettre à jour le profil seller
        if not seller.seller_profile:
            seller_profile = SellerProfile(
                id_user=seller_id,
                shop_name=data.get('shop_name', f"{seller.full_name}'s Shop"),
                shop_description=data.get('shop_description', ''),
                verification_status='pending'
            )
            db.session.add(seller_profile)
        else:
            if 'shop_name' in data:
                seller.seller_profile.shop_name = data['shop_name']
            if 'shop_description' in data:
                seller.seller_profile.shop_description = data['shop_description']
        
        db.session.commit()
        
        seller_dict = seller.to_dict()
        if seller.seller_profile:
            seller_dict['seller_profile'] = seller.seller_profile.to_dict()
        
        return jsonify({'message': 'Seller profile updated successfully', 'seller': seller_dict}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({'message': str(error)}), 500

def get_seller_orders(seller_id):
    """Récupère toutes les commandes contenant les produits du vendeur"""
    try:
        # Récupérer tous les produits du vendeur
        products = Product.query.filter_by(id_seller=seller_id).all()
        product_ids = [p.id_product for p in products]
        
        # Récupérer tous les order_items pour ces produits
        order_items = OrderItem.query.filter(OrderItem.id_product.in_(product_ids)).all()
        order_ids = list(set([item.id_order for item in order_items]))
        
        # Récupérer les commandes
        orders = Order.query.filter(Order.id_order.in_(order_ids)).order_by(Order.order_createdAt.desc()).all()
        
        result = []
        for order in orders:
            order_dict = order.to_dict()
            # Filtrer seulement les items du vendeur
            seller_items = [item for item in order.items if item.id_product in product_ids]
            order_dict['items'] = []
            for item in seller_items:
                item_dict = item.to_dict()
                if item.product:
                    item_dict['product'] = item.product.to_dict()
                order_dict['items'].append(item_dict)
            
            # Calculer le total pour ce vendeur
            seller_total = sum(float(item.order_item_price) * item.order_item_quantity for item in seller_items)
            order_dict['seller_total'] = seller_total
            
            if order.client_user:
                order_dict['client'] = order.client_user.to_dict()
            result.append(order_dict)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def get_seller_stats(seller_id):
    """Récupère les statistiques du vendeur"""
    try:
        products = Product.query.filter_by(id_seller=seller_id).all()
        product_ids = [p.id_product for p in products]
        
        order_items = OrderItem.query.filter(OrderItem.id_product.in_(product_ids)).all()
        orders = Order.query.filter(Order.id_order.in_(list(set([item.id_order for item in order_items])))).all()
        
        stats = {
            'total_products': len(products),
            'total_orders': len(orders),
            'total_revenue': sum(float(item.order_item_price) * item.order_item_quantity for item in order_items if item.order.payment_status == 'paid'),
            'pending_orders': len([o for o in orders if o.order_status == 'processing']),
            'delivered_orders': len([o for o in orders if o.order_status == 'delivered'])
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
