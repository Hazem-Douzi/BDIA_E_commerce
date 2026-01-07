from flask import jsonify
from backend import db
from backend.models import Order, OrderItem, Cart, CartItem, Product, Payment
from datetime import datetime

def create_order(client_id, data):
    """Crée une commande à partir du panier"""
    try:
        # Récupérer le panier
        cart = Cart.query.filter_by(id_client=client_id).first()
        if not cart or not cart.items:
            return jsonify({'message': 'Cart is empty'}), 400
        
        # Calculer le total
        total_amount = 0
        order_items_data = []
        
        for cart_item in cart.items:
            if not cart_item.product:
                continue
            
            # Vérifier le stock
            if cart_item.product.stock < cart_item.quantity:
                return jsonify({
                    'message': f'Insufficient stock for product {cart_item.product.product_name}'
                }), 400
            
            item_price = float(cart_item.product.price) if cart_item.product.price else 0
            item_total = item_price * cart_item.quantity
            total_amount += item_total
            
            order_items_data.append({
                'id_product': cart_item.id_product,
                'quantity': cart_item.quantity,
                'price': item_price
            })
        
        if total_amount == 0:
            return jsonify({'message': 'Cannot create order with zero total'}), 400
        
        # Créer la commande
        order = Order(
            id_client=client_id,
            total_amount=total_amount,
            payment_status='pending',
            order_status='processing',
            order_createdAt=datetime.utcnow()
        )
        db.session.add(order)
        db.session.flush()
        
        # Créer les articles de commande
        for item_data in order_items_data:
            order_item = OrderItem(
                id_order=order.id_order,
                id_product=item_data['id_product'],
                order_item_quantity=item_data['quantity'],
                order_item_price=item_data['price']
            )
            db.session.add(order_item)
            
            # Réduire le stock
            product = Product.query.get(item_data['id_product'])
            if product:
                product.stock -= item_data['quantity']
        
        # Vider le panier
        CartItem.query.filter_by(id_cart=cart.id_cart).delete()
        
        db.session.commit()
        
        order_dict = order.to_dict()
        order_dict['items'] = [item.to_dict() for item in order.items]
        return jsonify({'message': 'Order created successfully', 'order': order_dict}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def get_client_orders(client_id):
    """Récupère toutes les commandes d'un client"""
    try:
        orders = Order.query.filter_by(id_client=client_id).order_by(Order.order_createdAt.desc()).all()
        result = []
        for order in orders:
            order_dict = order.to_dict()
            order_dict['items'] = []
            for item in order.items:
                item_dict = item.to_dict()
                if item.product:
                    product_dict = item.product.to_dict()
                    product_dict['images'] = [img.to_dict() for img in item.product.images[:1]]
                    item_dict['product'] = product_dict
                order_dict['items'].append(item_dict)
            if order.payment:
                order_dict['payment'] = order.payment.to_dict()
            result.append(order_dict)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def get_order(order_id, client_id=None):
    """Récupère une commande par ID"""
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        # Vérifier que le client est propriétaire (si client_id fourni)
        if client_id and order.id_client != client_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        order_dict = order.to_dict()
        order_dict['items'] = []
        for item in order.items:
            item_dict = item.to_dict()
            if item.product:
                product_dict = item.product.to_dict()
                product_dict['images'] = [img.to_dict() for img in item.product.images]
                item_dict['product'] = product_dict
            order_dict['items'].append(item_dict)
        if order.payment:
            order_dict['payment'] = order.payment.to_dict()
        return jsonify(order_dict), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def cancel_order(order_id, client_id):
    """Annule une commande"""
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        # Vérifier que le client est propriétaire
        if order.id_client != client_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        # Vérifier que la commande peut être annulée
        if order.order_status in ['delivered', 'cancelled']:
            return jsonify({'message': f'Cannot cancel order with status: {order.order_status}'}), 400
        
        # Restaurer le stock
        for item in order.items:
            if item.product:
                item.product.stock += item.order_item_quantity
        
        # Mettre à jour le statut
        order.order_status = 'cancelled'
        order.payment_status = 'failed'
        
        db.session.commit()
        return jsonify({'message': 'Order cancelled successfully', 'order': order.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

