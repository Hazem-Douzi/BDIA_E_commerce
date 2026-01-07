from flask import jsonify, request
from backend import db
from backend.models import Review, Product, Order, OrderItem
from datetime import datetime
from sqlalchemy import and_

def create_review(client_id, product_id, data):
    """Crée un avis pour un produit"""
    try:
        # Vérifier que le produit existe
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        # Vérifier que le client a acheté ce produit (optionnel mais recommandé)
        has_purchased = db.session.query(OrderItem).join(Order).filter(
            and_(
                Order.id_client == client_id,
                OrderItem.id_product == product_id,
                Order.order_status == 'delivered',
                Order.payment_status == 'paid'
            )
        ).first()
        
        # Note: On peut permettre les avis même sans achat, mais c'est optionnel
        # if not has_purchased:
        #     return jsonify({'message': 'You must purchase the product before reviewing'}), 403
        
        # Vérifier si l'utilisateur a déjà laissé un avis
        existing_review = Review.query.filter_by(id_client=client_id, id_product=product_id).first()
        if existing_review:
            return jsonify({'message': 'You have already reviewed this product'}), 400
        
        rating = data.get('rating_review')
        comment = data.get('commentt', '')
        
        if not rating or rating < 1 or rating > 5:
            return jsonify({'message': 'Rating must be between 1 and 5'}), 400
        
        review = Review(
            rating_review=rating,
            commentt=comment,
            id_product=product_id,
            id_client=client_id,
            review_createdAt=datetime.utcnow()
        )
        db.session.add(review)
        
        # Mettre à jour la note moyenne du produit
        all_reviews = Review.query.filter_by(id_product=product_id).all()
        if all_reviews:
            total_rating = sum(r.rating_review for r in all_reviews)
            product.rating = total_rating / len(all_reviews)
        else:
            product.rating = rating
        
        db.session.commit()
        
        review_dict = review.to_dict()
        if review.client_user:
            review_dict['client'] = review.client_user.to_dict()
        return jsonify({'message': 'Review created successfully', 'review': review_dict}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def get_product_reviews(product_id):
    """Récupère tous les avis d'un produit"""
    try:
        reviews = Review.query.filter_by(id_product=product_id).order_by(Review.review_createdAt.desc()).all()
        result = []
        for review in reviews:
            review_dict = review.to_dict()
            if review.client_user:
                review_dict['client'] = review.client_user.to_dict()
            result.append(review_dict)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def update_review(review_id, client_id, data):
    """Met à jour un avis"""
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'message': 'Review not found'}), 404
        
        # Vérifier que l'avis appartient au client
        if review.id_client != client_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        if 'rating_review' in data:
            rating = data['rating_review']
            if rating < 1 or rating > 5:
                return jsonify({'message': 'Rating must be between 1 and 5'}), 400
            review.rating_review = rating
        
        if 'commentt' in data:
            review.commentt = data['commentt']
        
        # Mettre à jour la note moyenne du produit
        product = Product.query.get(review.id_product)
        if product:
            all_reviews = Review.query.filter_by(id_product=product.id_product).all()
            if all_reviews:
                total_rating = sum(r.rating_review for r in all_reviews)
                product.rating = total_rating / len(all_reviews)
        
        db.session.commit()
        
        review_dict = review.to_dict()
        if review.client_user:
            review_dict['client'] = review.client_user.to_dict()
        return jsonify({'message': 'Review updated successfully', 'review': review_dict}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def delete_review(review_id, client_id):
    """Supprime un avis"""
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'message': 'Review not found'}), 404
        
        # Vérifier que l'avis appartient au client
        if review.id_client != client_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        product_id = review.id_product
        db.session.delete(review)
        
        # Mettre à jour la note moyenne du produit
        product = Product.query.get(product_id)
        if product:
            all_reviews = Review.query.filter_by(id_product=product_id).all()
            if all_reviews:
                total_rating = sum(r.rating_review for r in all_reviews)
                product.rating = total_rating / len(all_reviews)
            else:
                product.rating = 0.0
        
        db.session.commit()
        return jsonify({'message': 'Review deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

def get_client_reviews(client_id):
    """Récupère tous les avis d'un client"""
    try:
        reviews = Review.query.filter_by(id_client=client_id).order_by(Review.review_createdAt.desc()).all()
        result = []
        for review in reviews:
            review_dict = review.to_dict()
            if review.product:
                review_dict['product'] = review.product.to_dict()
            result.append(review_dict)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

