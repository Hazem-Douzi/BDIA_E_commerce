import os
from flask import jsonify, request, current_app
from backend.database.dao import users as users_dao
from backend.database.dao import seller_profiles as seller_profiles_dao
from backend.database.dao import categories as categories_dao
from backend.database.dao import subcategories as subcategories_dao
from backend.database.dao import products as products_dao
from backend.database.dao import product_images as images_dao
from backend.database.dao import orders as orders_dao
from backend.database.dao import payments as payments_dao
from backend.database.dao import reviews as reviews_dao
from backend.controllers.serializers import (
    user_to_dict,
    category_to_dict,
    subcategory_to_dict,
    product_to_dict,
    product_image_to_dict,
    order_to_dict,
    order_item_to_dict,
    payment_to_dict,
    seller_profile_to_dict,
)


def get_all_users():
    try:
        users = users_dao.list_users()
        return jsonify([user_to_dict(user) for user in users]), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_all_clients():
    try:
        clients = users_dao.list_users_by_role("client")
        return jsonify([user_to_dict(client) for client in clients]), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_all_sellers():
    try:
        sellers = users_dao.list_users_by_role("seller")
        result = []
        for seller in sellers:
            seller_dict = user_to_dict(seller)
            profile = seller_profiles_dao.get_profile_by_user_id(seller["id_user"])
            if profile:
                seller_dict["seller_profile"] = seller_profile_to_dict(profile)
            result.append(seller_dict)
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_user(user_id):
    try:
        user = users_dao.get_user_by_id(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        data = request.get_json() or {}
        update_fields = {}
        for key in ["full_name", "phone", "adress"]:
            if key in data:
                update_fields[key] = data[key]

        if "email" in data:
            existing = users_dao.get_user_by_email(data["email"])
            if existing and existing["id_user"] != user_id:
                return jsonify({"message": "Email already in use"}), 400
            update_fields["email"] = data["email"]

        if "rolee" in data and data["rolee"] in ["admin", "client", "seller"]:
            update_fields["rolee"] = data["rolee"]

        if update_fields:
            users_dao.update_user(user_id, update_fields)

        user = users_dao.get_user_by_id(user_id)
        return jsonify({"message": "User updated successfully", "user": user_to_dict(user)}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def delete_user(user_id):
    try:
        user = users_dao.get_user_by_id(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        users_dao.delete_user(user_id)
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def create_category():
    try:
        data = request.get_json() or {}
        category_id = categories_dao.create_category(
            data.get("category_name"),
            data.get("category_description"),
            data.get("image"),
        )
        category = categories_dao.get_category(category_id)
        return jsonify({"message": "Category created successfully", "category": category_to_dict(category)}), 201
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_all_categories():
    try:
        categories = categories_dao.list_categories()
        if not categories:
            return jsonify([]), 200
        
        result = []
        for category in categories:
            try:
                cat_dict = category_to_dict(category)
                subcategories = subcategories_dao.list_subcategories_by_category(category["id_category"])
                cat_dict["subcategories"] = [subcategory_to_dict(sub) for sub in subcategories] if subcategories else []
                result.append(cat_dict)
            except Exception as e:
                # Log error but continue processing other categories
                continue
        return jsonify(result), 200
    except Exception as error:
        import traceback
        return jsonify({"message": str(error), "traceback": traceback.format_exc()}), 500


def update_category(category_id):
    try:
        category = categories_dao.get_category(category_id)
        if not category:
            return jsonify({"message": "Category not found"}), 404
        data = request.get_json() or {}
        fields = {}
        for key in ["category_name", "category_description", "image"]:
            if key in data:
                fields[key] = data[key]
        if fields:
            categories_dao.update_category(category_id, fields)
        category = categories_dao.get_category(category_id)
        return jsonify({"message": "Category updated successfully", "category": category_to_dict(category)}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def delete_category(category_id):
    try:
        category = categories_dao.get_category(category_id)
        if not category:
            return jsonify({"message": "Category not found"}), 404
        categories_dao.delete_category(category_id)
        return jsonify({"message": "Category deleted successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def create_subcategory():
    try:
        data = request.get_json() or {}
        subcategory_id = subcategories_dao.create_subcategory(
            data.get("SubCategory_name"),
            data.get("id_category"),
            data.get("SubCategory_description"),
        )
        subcategory = subcategories_dao.get_subcategory(subcategory_id)
        return jsonify({
            "message": "SubCategory created successfully",
            "subcategory": subcategory_to_dict(subcategory),
        }), 201
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_all_subcategories():
    try:
        subcategories = subcategories_dao.list_subcategories()
        return jsonify([subcategory_to_dict(sub) for sub in subcategories]), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_subcategory(subcategory_id):
    try:
        subcategory = subcategories_dao.get_subcategory(subcategory_id)
        if not subcategory:
            return jsonify({"message": "SubCategory not found"}), 404
        data = request.get_json() or {}
        fields = {}
        for key in ["SubCategory_name", "id_category", "SubCategory_description"]:
            if key in data:
                fields[key] = data[key]
        if fields:
            subcategories_dao.update_subcategory(subcategory_id, fields)
        subcategory = subcategories_dao.get_subcategory(subcategory_id)
        return jsonify({
            "message": "SubCategory updated successfully",
            "subcategory": subcategory_to_dict(subcategory),
        }), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def delete_subcategory(subcategory_id):
    try:
        subcategory = subcategories_dao.get_subcategory(subcategory_id)
        if not subcategory:
            return jsonify({"message": "SubCategory not found"}), 404
        subcategories_dao.delete_subcategory(subcategory_id)
        return jsonify({"message": "SubCategory deleted successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_all_products():
    try:
        products = products_dao.list_products()
        result = []
        for product in products:
            product_dict = product_to_dict(product)
            images = images_dao.list_images_by_product(product["id_product"])
            product_dict["images"] = [product_image_to_dict(img) for img in images]
            result.append(product_dict)
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def delete_product(product_id):
    try:
        product = products_dao.get_product(product_id)
        if not product:
            return jsonify({"message": "Product not found"}), 404

        images = images_dao.list_images_by_product(product_id)
        for image in images:
            if image["imageURL"]:
                image_path = os.path.join(
                    current_app.config["UPLOAD_FOLDER"], os.path.basename(image["imageURL"])
                )
                if os.path.exists(image_path):
                    try:
                        os.remove(image_path)
                    except Exception:
                        pass
        images_dao.delete_images_by_product(product_id)
        products_dao.delete_product(product_id)
        return jsonify({"message": "Product deleted successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_seller_verification(seller_id):
    try:
        user = users_dao.get_user_by_id(seller_id)
        if not user or user["rolee"] != "seller":
            return jsonify({"message": "Seller not found"}), 404

        data = request.get_json() or {}
        status = data.get("verification_status")
        if status not in ["pending", "verified", "rejected"]:
            return jsonify({"message": "Invalid verification status"}), 400

        profile = seller_profiles_dao.get_profile_by_user_id(seller_id)
        if not profile:
            seller_profiles_dao.create_profile(
                seller_id,
                data.get("shop_name", f"{user['full_name']}'s Shop"),
                data.get("shop_description", ""),
                status,
            )
        else:
            fields = {"verification_status": status}
            if "shop_name" in data:
                fields["shop_name"] = data["shop_name"]
            if "shop_description" in data:
                fields["shop_description"] = data["shop_description"]
            seller_profiles_dao.update_profile(seller_id, fields)

        profile = seller_profiles_dao.get_profile_by_user_id(seller_id)
        return jsonify({
            "message": "Seller verification updated successfully",
            "seller_profile": seller_profile_to_dict(profile),
        }), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_all_orders():
    try:
        orders = orders_dao.list_orders_all()
        result = []
        for order in orders:
            order_dict = order_to_dict(order)
            items = orders_dao.list_order_items(order["id_order"])
            order_dict["items"] = [order_item_to_dict(item) for item in items]
            client = users_dao.get_user_by_id(order["id_client"])
            if client:
                order_dict["client"] = user_to_dict(client)
            payment = payments_dao.get_payment_by_order(order["id_order"])
            if payment:
                order_dict["payment"] = payment_to_dict(payment)
            result.append(order_dict)
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_order_status(order_id):
    try:
        order = orders_dao.get_order(order_id)
        if not order:
            return jsonify({"message": "Order not found"}), 404

        data = request.get_json() or {}
        fields = {}
        if "order_status" in data:
            if data["order_status"] not in ["processing", "shipped", "delivered", "cancelled"]:
                return jsonify({"message": "Invalid order status"}), 400
            fields["order_status"] = data["order_status"]
        if "payment_status" in data:
            if data["payment_status"] not in ["pending", "paid", "failed"]:
                return jsonify({"message": "Invalid payment status"}), 400
            fields["payment_status"] = data["payment_status"]
        if fields:
            orders_dao.update_order_status(order_id, fields)
        order = orders_dao.get_order(order_id)
        return jsonify({"message": "Order updated successfully", "order": order_to_dict(order)}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_dashboard_stats():
    try:
        stats = {
            "total_users": users_dao.count_users(),
            "total_clients": users_dao.count_users_by_role("client"),
            "total_sellers": users_dao.count_users_by_role("seller"),
            "total_products": len(products_dao.list_products()),
            "total_orders": len(orders_dao.list_orders_all()),
            "pending_orders": len([o for o in orders_dao.list_orders_all() if o["order_status"] == "processing"]),
            "total_categories": len(categories_dao.list_categories()),
            "pending_seller_verifications": seller_profiles_dao.count_pending_verifications(),
        }
        return jsonify(stats), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def delete_review(review_id):
    """Delete a review (admin only)."""
    try:
        review = reviews_dao.get_review(review_id)
        if not review:
            return jsonify({"message": "Review not found"}), 404

        product_id = review["id_product"]
        reviews_dao.delete_review(review_id)

        # Update product rating
        avg_rating = reviews_dao.average_rating_for_product(product_id)
        if avg_rating is None:
            products_dao.update_product_rating(product_id, 0.0)
        else:
            products_dao.update_product_rating(product_id, avg_rating)

        return jsonify({"message": "Review deleted successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500
