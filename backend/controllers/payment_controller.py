from flask import jsonify
from backend import db
from backend.models import Payment, Order
from datetime import datetime

def create_payment(order_id, client_id, data):
    """Crée un paiement pour une commande"""
    try:
        # Vérifier que la commande existe et appartient au client
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        if order.id_client != client_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        # Vérifier qu'il n'y a pas déjà un paiement pour cette commande
        existing_payment = Payment.query.filter_by(id_order=order_id).first()
        if existing_payment:
            return jsonify({'message': 'Payment already exists for this order'}), 400
        
        method = data.get('method', 'cash_on_delivery')
        if method not in ['card', 'cash_on_delivery', 'flouci']:
            return jsonify({'message': 'Invalid payment method'}), 400
        
        payment = Payment(
            id_order=order_id,
            payment_amount=order.total_amount,
            method=method,
            payment_status='pending',
            id_transaction=data.get('id_transaction')
        )
        
        db.session.add(payment)
        
        # Si c'est cash_on_delivery, le statut reste pending
        # Sinon, on peut simuler le traitement (dans un vrai système, on appellerait une API de paiement)
        if method == 'cash_on_delivery':
            payment.payment_status = 'pending'
            order.payment_status = 'pending'
        else:
            # Simulation: on accepte le paiement (dans la réalité, vérifier avec le processeur de paiement)
            payment.payment_status = 'succes'
            payment.id_transaction = payment.id_transaction or f"TXN{datetime.utcnow().timestamp()}"
            order.payment_status = 'paid'
        
        db.session.commit()
        
        payment_dict = payment.to_dict()
        return jsonify({'message': 'Payment created successfully', 'payment': payment_dict}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def get_order_payment(order_id, client_id=None):
    """Récupère le paiement d'une commande"""
    try:
        payment = Payment.query.filter_by(id_order=order_id).first()
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        
        # Vérifier que le client est propriétaire (si client_id fourni)
        if client_id:
            order = Order.query.get(order_id)
            if not order or order.id_client != client_id:
                return jsonify({'message': 'Unauthorized'}), 403
        
        payment_dict = payment.to_dict()
        if payment.order:
            payment_dict['order'] = payment.order.to_dict()
        return jsonify(payment_dict), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def update_payment_status(payment_id, data):
    """Met à jour le statut d'un paiement (admin only)"""
    try:
        payment = Payment.query.get(payment_id)
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        
        status = data.get('payment_status')
        if status and status in ['succes', 'failed', 'pending']:
            payment.payment_status = status
            
            # Mettre à jour le statut de paiement de la commande
            if payment.order:
                if status == 'succes':
                    payment.order.payment_status = 'paid'
                elif status == 'failed':
                    payment.order.payment_status = 'failed'
                else:
                    payment.order.payment_status = 'pending'
        
        db.session.commit()
        
        payment_dict = payment.to_dict()
        return jsonify({'message': 'Payment status updated successfully', 'payment': payment_dict}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

