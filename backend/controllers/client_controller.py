import bcrypt
from flask import jsonify
from backend import db
from backend.models import User, Order

def get_client_profile(client_id):
    """Récupère le profil d'un client"""
    try:
        client = User.query.get(client_id)
        if not client or client.rolee != 'client':
            return jsonify({'message': 'Client not found'}), 404
        
        client_dict = client.to_dict()
        
        # Statistiques du client
        orders = Order.query.filter_by(id_client=client_id).all()
        client_dict['stats'] = {
            'total_orders': len(orders),
            'total_spent': sum(float(o.total_amount) for o in orders if o.payment_status == 'paid')
        }
        
        return jsonify(client_dict), 200
    except Exception as error:
        return jsonify({'message': str(error)}), 500

def update_client_profile(client_id, data):
    """Met à jour le profil d'un client"""
    try:
        client = User.query.get(client_id)
        if not client or client.rolee != 'client':
            return jsonify({'message': 'Client not found'}), 404
        
        # Mettre à jour les informations utilisateur
        if 'full_name' in data:
            client.full_name = data['full_name']
        if 'phone' in data:
            client.phone = data['phone']
        if 'adress' in data:
            client.adress = data['adress']
        if 'email' in data:
            # Vérifier que l'email n'est pas déjà utilisé
            existing = User.query.filter_by(email=data['email']).first()
            if existing and existing.id_user != client_id:
                return jsonify({'message': 'Email already in use'}), 400
            client.email = data['email']
        if 'password' in data and data['password']:
            client.pass_word = bcrypt.hashpw(
                data['password'].encode('utf-8'),
                bcrypt.gensalt(10)
            ).decode('utf-8')
        
        db.session.commit()
        
        client_dict = client.to_dict()
        return jsonify({'message': 'Client profile updated successfully', 'client': client_dict}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({'message': str(error)}), 500
