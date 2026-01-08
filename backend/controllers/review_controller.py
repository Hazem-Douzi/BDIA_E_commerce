from flask import jsonify
from backend.database.dao import reviews as reviews_dao
from backend.database.dao import products as products_dao
from backend.database.dao import orders as orders_dao
from backend.database.dao import users as users_dao
from backend.controllers.serializers import review_to_dict, user_to_dict, product_to_dict


def create_review(client_id, product_id, data):
    """Create a review for a product."""
    try:
        product = products_dao.get_product(product_id)
        if not product:
            return jsonify({"message": "Product not found"}), 404

        has_purchased = orders_dao.client_has_purchased_product(client_id, product_id)
        del has_purchased

        existing_review = reviews_dao.get_review_by_client_and_product(client_id, product_id)
        if existing_review:
            return jsonify({"message": "You have already reviewed this product"}), 400

        rating = data.get("rating_review")
        comment = data.get("commentt", "")

        if not rating or rating < 1 or rating > 5:
            return jsonify({"message": "Rating must be between 1 and 5"}), 400

        review_id = reviews_dao.create_review(rating, comment, product_id, client_id)

        avg_rating = reviews_dao.average_rating_for_product(product_id)
        if avg_rating is not None:
            products_dao.update_product_rating(product_id, avg_rating)

        review = reviews_dao.get_review(review_id)
        review_dict = review_to_dict(review)
        client = users_dao.get_user_by_id(client_id)
        if client:
            review_dict["client"] = user_to_dict(client)
        return jsonify({"message": "Review created successfully", "review": review_dict}), 201
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_product_reviews(product_id):
    """Get all reviews for a product."""
    try:
        reviews = reviews_dao.list_reviews_by_product(product_id)
        result = []
        for review in reviews:
            review_dict = review_to_dict(review)
            client = users_dao.get_user_by_id(review["id_client"])
            if client:
                review_dict["client"] = user_to_dict(client)
            result.append(review_dict)
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_review(review_id, client_id, data):
    """Update a review."""
    try:
        review = reviews_dao.get_review(review_id)
        if not review:
            return jsonify({"message": "Review not found"}), 404

        if review["id_client"] != client_id:
            return jsonify({"message": "Unauthorized"}), 403

        update_fields = {}
        if "rating_review" in data:
            rating = data["rating_review"]
            if rating < 1 or rating > 5:
                return jsonify({"message": "Rating must be between 1 and 5"}), 400
            update_fields["rating_review"] = rating
        if "commentt" in data:
            update_fields["commentt"] = data["commentt"]

        if update_fields:
            reviews_dao.update_review(review_id, update_fields)

        avg_rating = reviews_dao.average_rating_for_product(review["id_product"])
        if avg_rating is not None:
            products_dao.update_product_rating(review["id_product"], avg_rating)

        updated_review = reviews_dao.get_review(review_id)
        review_dict = review_to_dict(updated_review)
        client = users_dao.get_user_by_id(client_id)
        if client:
            review_dict["client"] = user_to_dict(client)
        return jsonify({"message": "Review updated successfully", "review": review_dict}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def delete_review(review_id, client_id):
    """Delete a review."""
    try:
        review = reviews_dao.get_review(review_id)
        if not review:
            return jsonify({"message": "Review not found"}), 404

        if review["id_client"] != client_id:
            return jsonify({"message": "Unauthorized"}), 403

        product_id = review["id_product"]
        reviews_dao.delete_review(review_id)

        avg_rating = reviews_dao.average_rating_for_product(product_id)
        if avg_rating is None:
            products_dao.update_product_rating(product_id, 0.0)
        else:
            products_dao.update_product_rating(product_id, avg_rating)

        return jsonify({"message": "Review deleted successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_client_reviews(client_id):
    """Get all reviews for a client."""
    try:
        if not client_id:
            return jsonify({"message": "Client ID is required"}), 400
        
        reviews = reviews_dao.list_reviews_by_client(client_id)
        result = []
        for review in reviews:
            review_dict = review_to_dict(review)
            product = products_dao.get_product(review["id_product"])
            if product:
                review_dict["product"] = product_to_dict(product)
            result.append(review_dict)
        return jsonify(result), 200
    except Exception as error:
        import traceback
        return jsonify({"message": str(error), "traceback": traceback.format_exc()}), 500
