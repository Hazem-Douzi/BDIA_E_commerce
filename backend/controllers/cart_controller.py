from flask import jsonify, request
from backend import db
from backend.models import Cart, CartItem, Product, User
from datetime import datetime

def get_cart(client_id):
    """Récupère le panier d'un client"""
    try:
        cart = Cart.query.filter_by(id_client=client_id).first()
        if not cart:
            # Créer un nouveau panier si il n'existe pas
            cart = Cart(id_client=client_id, cart_createdAt=datetime.utcnow())
            db.session.add(cart)
            db.session.commit()
        
        result = cart.to_dict()
        result['items'] = []
        total = 0
        
        for item in cart.items:
            item_dict = item.to_dict()
            if item.product:
                product_dict = item.product.to_dict()
                product_dict['images'] = [img.to_dict() for img in item.product.images[:1]]  # Première image seulement
                item_dict['product'] = product_dict
                # Calculer le total de l'article
                item_total = float(item.product.price) * item.quantity if item.product.price else 0
                item_dict['item_total'] = item_total
                total += item_total
            result['items'].append(item_dict)
        
        result['total'] = total
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def add_to_cart(client_id, data):
    """Ajoute un produit au panier"""
    try:
        product_id = data.get('id_product')
        quantity = data.get('quantity', 1)
        
        if not product_id:
            return jsonify({'message': 'Product ID is required'}), 400
        
        # Vérifier que le produit existe
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        # Vérifier le stock
        if product.stock < quantity:
            return jsonify({'message': 'Insufficient stock'}), 400
        
        # Récupérer ou créer le panier
        cart = Cart.query.filter_by(id_client=client_id).first()
        if not cart:
            cart = Cart(id_client=client_id, cart_createdAt=datetime.utcnow())
            db.session.add(cart)
            db.session.flush()
        
        # Vérifier si le produit est déjà dans le panier
        existing_item = CartItem.query.filter_by(id_cart=cart.id_cart, id_product=product_id).first()
        
        if existing_item:
            # Mettre à jour la quantité
            new_quantity = existing_item.quantity + quantity
            if product.stock < new_quantity:
                return jsonify({'message': 'Insufficient stock'}), 400
            existing_item.quantity = new_quantity
        else:
            # Créer un nouvel article
            cart_item = CartItem(
                id_cart=cart.id_cart,
                id_product=product_id,
                quantity=quantity
            )
            db.session.add(cart_item)
        
        db.session.commit()
        return jsonify({'message': 'Product added to cart successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def update_cart_item(cart_item_id, client_id, data):
    """Met à jour un article du panier"""
    try:
        cart_item = CartItem.query.get(cart_item_id)
        if not cart_item:
            return jsonify({'message': 'Cart item not found'}), 404
        
        # Vérifier que l'article appartient au client
        cart = Cart.query.get(cart_item.id_cart)
        if not cart or cart.id_client != client_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        quantity = data.get('quantity')
        if quantity is not None:
            if quantity <= 0:
                # Supprimer l'article si la quantité est 0 ou négative
                db.session.delete(cart_item)
            else:
                # Vérifier le stock
                if cart_item.product and cart_item.product.stock < quantity:
                    return jsonify({'message': 'Insufficient stock'}), 400
                cart_item.quantity = quantity
        
        db.session.commit()
        return jsonify({'message': 'Cart item updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def remove_from_cart(cart_item_id, client_id):
    """Supprime un article du panier"""
    try:
        cart_item = CartItem.query.get(cart_item_id)
        if not cart_item:
            return jsonify({'message': 'Cart item not found'}), 404
        
        # Vérifier que l'article appartient au client
        cart = Cart.query.get(cart_item.id_cart)
        if not cart or cart.id_client != client_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({'message': 'Item removed from cart successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def clear_cart(client_id):
    """Vide le panier d'un client"""
    try:
        cart = Cart.query.filter_by(id_client=client_id).first()
        if not cart:
            return jsonify({'message': 'Cart not found'}), 404
        
        # Supprimer tous les articles
        CartItem.query.filter_by(id_cart=cart.id_cart).delete()
        db.session.commit()
        return jsonify({'message': 'Cart cleared successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

