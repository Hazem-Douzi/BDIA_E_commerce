import bcrypt
from flask import jsonify
from backend.database.dao import users as users_dao
from backend.database.dao import seller_profiles as seller_profiles_dao
from backend.database.dao import products as products_dao
from backend.database.dao import orders as orders_dao
from backend.controllers.serializers import (
    user_to_dict,
    seller_profile_to_dict,
    order_to_dict,
    order_item_to_dict,
    product_to_dict,
)


def get_seller_profile(seller_id):
    """Get seller profile."""
    try:
        seller = users_dao.get_user_by_id(seller_id)
        if not seller or seller["rolee"] != "seller":
            return jsonify({"message": "Seller not found"}), 404

        seller_dict = user_to_dict(seller)
        profile = seller_profiles_dao.get_profile_by_user_id(seller_id)
        if profile:
            seller_dict["seller_profile"] = seller_profile_to_dict(profile)

        products = products_dao.list_products_by_seller(seller_id)
        seller_dict["stats"] = {
            "total_products": len(products),
            "verified": profile["verification_status"] == "verified" if profile else False,
        }
        return jsonify(seller_dict), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_seller_profile(seller_id, data):
    """Update seller profile."""
    try:
        seller = users_dao.get_user_by_id(seller_id)
        if not seller or seller["rolee"] != "seller":
            return jsonify({"message": "Seller not found"}), 404

        update_fields = {}
        if "full_name" in data:
            update_fields["full_name"] = data["full_name"]
        if "phone" in data:
            update_fields["phone"] = data["phone"]
        if "adress" in data:
            update_fields["adress"] = data["adress"]
        if "email" in data:
            existing = users_dao.get_user_by_email(data["email"])
            if existing and existing["id_user"] != seller_id:
                return jsonify({"message": "Email already in use"}), 400
            update_fields["email"] = data["email"]
        if "password" in data and data["password"]:
            update_fields["pass_word"] = bcrypt.hashpw(
                data["password"].encode("utf-8"), bcrypt.gensalt(10)
            ).decode("utf-8")

        if update_fields:
            users_dao.update_user(seller_id, update_fields)

        profile = seller_profiles_dao.get_profile_by_user_id(seller_id)
        if not profile:
            seller_profiles_dao.create_profile(
                seller_id,
                data.get("shop_name", f"{seller['full_name']}'s Shop"),
                data.get("shop_description", ""),
                "pending",
            )
        else:
            profile_fields = {}
            if "shop_name" in data:
                profile_fields["shop_name"] = data["shop_name"]
            if "shop_description" in data:
                profile_fields["shop_description"] = data["shop_description"]
            if profile_fields:
                seller_profiles_dao.update_profile(seller_id, profile_fields)

        seller = users_dao.get_user_by_id(seller_id)
        profile = seller_profiles_dao.get_profile_by_user_id(seller_id)
        seller_dict = user_to_dict(seller)
        if profile:
            seller_dict["seller_profile"] = seller_profile_to_dict(profile)
        return jsonify({"message": "Seller profile updated successfully", "seller": seller_dict}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_seller_orders(seller_id):
    """Get orders for seller's products."""
    try:
        products = products_dao.list_products_by_seller(seller_id)
        product_ids = [product["id_product"] for product in products]
        order_items = orders_dao.list_order_items_by_products(product_ids)
        order_ids = list({item["id_order"] for item in order_items})
        orders = orders_dao.list_orders_by_ids(order_ids)

        result = []
        for order in orders:
            order_dict = order_to_dict(order)
            seller_items = [item for item in order_items if item["id_order"] == order["id_order"]]
            order_dict["items"] = []
            for item in seller_items:
                item_dict = order_item_to_dict(item)
                product = next(
                    (p for p in products if p["id_product"] == item["id_product"]),
                    None,
                )
                if product:
                    product_dict = product_to_dict(product)
                    # Add images to product
                    from backend.database.dao import product_images as images_dao
                    from backend.controllers.serializers import product_image_to_dict
                    images = images_dao.list_images_by_product(product["id_product"])
                    product_dict["images"] = [product_image_to_dict(img) for img in images]
                    item_dict["product"] = product_dict
                order_dict["items"].append(item_dict)

            seller_total = sum(
                (item["order_item_price"] or 0) * item["order_item_quantity"]
                for item in seller_items
            )
            order_dict["seller_total"] = float(seller_total)

            client = users_dao.get_user_by_id(order["id_client"])
            if client:
                order_dict["client"] = user_to_dict(client)
            result.append(order_dict)

        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_seller_order_status(seller_id, order_id, data):
    """Update order status for a seller's order."""
    try:
        from flask import jsonify
        from backend.database.dao import orders as orders_dao
        from backend.database.dao import products as products_dao
        from backend.controllers.serializers import order_to_dict
        
        # Verify order belongs to seller's products
        order = orders_dao.get_order(order_id)
        if not order:
            return jsonify({"message": "Order not found"}), 404
        
        # Get seller's products
        products = products_dao.list_products_by_seller(seller_id)
        product_ids = [p["id_product"] for p in products]
        
        # Get order items
        order_items = orders_dao.list_order_items(order_id)
        seller_items = [item for item in order_items if item["id_product"] in product_ids]
        
        if not seller_items:
            return jsonify({"message": "Order does not contain any of your products"}), 403
        
        # Validate and update status
        fields = {}
        if "order_status" in data:
            if data["order_status"] not in ["processing", "shipped", "delivered", "cancelled"]:
                return jsonify({"message": "Invalid order status"}), 400
            fields["order_status"] = data["order_status"]
        
        if not fields:
            return jsonify({"message": "No fields to update"}), 400
        
        orders_dao.update_order_status(order_id, fields)
        updated_order = orders_dao.get_order(order_id)
        
        return jsonify({"message": "Order status updated successfully", "order": order_to_dict(updated_order)}), 200
    except Exception as error:
        from flask import jsonify
        return jsonify({"message": str(error)}), 500


def get_seller_stats(seller_id):
    """Get seller statistics."""
    try:
        from backend.database.dao import reviews as reviews_dao
        
        products = products_dao.list_products_by_seller(seller_id)
        product_ids = [product["id_product"] for product in products]
        order_items = orders_dao.list_order_items_by_products(product_ids)
        order_ids = list({item["id_order"] for item in order_items})
        orders = orders_dao.list_orders_by_ids(order_ids)

        total_revenue = 0
        for item in order_items:
            order = next((o for o in orders if o["id_order"] == item["id_order"]), None)
            # Only count delivered orders (livré suffisant, pas besoin de vérifier payment_status)
            if order and order["order_status"] == "delivered":
                item_revenue = (item["order_item_price"] or 0) * item["order_item_quantity"]
                total_revenue += item_revenue
        
        # Log for debugging (can be removed in production)
        from flask import current_app
        current_app.logger.info(f"Seller {seller_id} - Calculated total_revenue: {total_revenue} from {len(order_items)} order items")

        # Calculate average rating from all seller's products
        total_rating = 0
        rating_count = 0
        for product in products:
            avg_rating = reviews_dao.average_rating_for_product(product["id_product"])
            if avg_rating is not None:
                total_rating += avg_rating
                rating_count += 1
        
        average_rating = total_rating / rating_count if rating_count > 0 else 0

        stats = {
            "total_products": len(products),
            "total_orders": len(orders),
            "total_revenue": float(total_revenue),
            "pending_orders": len([o for o in orders if o["order_status"] == "processing"]),
            "delivered_orders": len([o for o in orders if o["order_status"] == "delivered"]),
            "average_rating": round(average_rating, 2) if average_rating > 0 else 0,
            "total_views": 0  # Placeholder for future implementation
        }
        return jsonify(stats), 200
    except Exception as error:
        import traceback
        return jsonify({"message": str(error), "traceback": traceback.format_exc()}), 500
