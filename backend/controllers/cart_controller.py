from flask import jsonify
from backend.database.dao import cart as cart_dao
from backend.database.dao import products as products_dao
from backend.database.dao import product_images as images_dao
from backend.controllers.serializers import cart_to_dict, cart_item_to_dict, product_to_dict, product_image_to_dict


def get_cart(client_id):
    """Get a client's cart."""
    try:
        cart = cart_dao.get_cart_by_client(client_id)
        if not cart:
            cart_id = cart_dao.create_cart(client_id)
            cart = cart_dao.get_cart(cart_id)

        result = cart_to_dict(cart)
        result["items"] = []
        total = 0

        items = cart_dao.list_cart_items(cart["id_cart"])
        for item in items:
            item_dict = cart_item_to_dict(item)
            product = products_dao.get_product(item["id_product"])
            if product:
                product_dict = product_to_dict(product)
                images = images_dao.list_images_by_product(product["id_product"])
                product_dict["images"] = [product_image_to_dict(img) for img in images[:1]]
                item_dict["product"] = product_dict
                item_total = (product_dict["price"] or 0) * item_dict["quantity"]
                item_dict["item_total"] = item_total
                total += item_total
            result["items"].append(item_dict)

        result["total"] = total
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def add_to_cart(client_id, data):
    """Add a product to the cart."""
    try:
        product_id = data.get("id_product")
        quantity = data.get("quantity", 1)

        if not product_id:
            return jsonify({"message": "Product ID is required"}), 400

        product = products_dao.get_product(product_id)
        if not product:
            return jsonify({"message": "Product not found"}), 404

        if product["stock"] < quantity:
            return jsonify({"message": "Insufficient stock"}), 400

        cart = cart_dao.get_cart_by_client(client_id)
        if not cart:
            cart_id = cart_dao.create_cart(client_id)
            cart = cart_dao.get_cart(cart_id)

        existing_item = cart_dao.get_cart_item_by_product(cart["id_cart"], product_id)
        if existing_item:
            new_quantity = existing_item["quantity"] + quantity
            if product["stock"] < new_quantity:
                return jsonify({"message": "Insufficient stock"}), 400
            cart_dao.update_cart_item_quantity(existing_item["id_cart_item"], new_quantity)
        else:
            cart_dao.add_cart_item(cart["id_cart"], product_id, quantity)

        return jsonify({"message": "Product added to cart successfully"}), 201
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_cart_item(cart_item_id, client_id, data):
    """Update a cart item."""
    try:
        cart_item = cart_dao.get_cart_item(cart_item_id)
        if not cart_item:
            return jsonify({"message": "Cart item not found"}), 404

        cart = cart_dao.get_cart(cart_item["id_cart"])
        if not cart or cart["id_client"] != client_id:
            return jsonify({"message": "Unauthorized"}), 403

        quantity = data.get("quantity")
        if quantity is not None:
            if quantity <= 0:
                cart_dao.delete_cart_item(cart_item_id)
            else:
                product = products_dao.get_product(cart_item["id_product"])
                if product and product["stock"] < quantity:
                    return jsonify({"message": "Insufficient stock"}), 400
                cart_dao.update_cart_item_quantity(cart_item_id, quantity)

        return jsonify({"message": "Cart item updated successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def remove_from_cart(cart_item_id, client_id):
    """Remove an item from the cart."""
    try:
        cart_item = cart_dao.get_cart_item(cart_item_id)
        if not cart_item:
            return jsonify({"message": "Cart item not found"}), 404

        cart = cart_dao.get_cart(cart_item["id_cart"])
        if not cart or cart["id_client"] != client_id:
            return jsonify({"message": "Unauthorized"}), 403

        cart_dao.delete_cart_item(cart_item_id)
        return jsonify({"message": "Item removed from cart successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def clear_cart(client_id):
    """Clear all items from a cart."""
    try:
        cart = cart_dao.get_cart_by_client(client_id)
        if not cart:
            return jsonify({"message": "Cart not found"}), 404

        cart_dao.clear_cart(cart["id_cart"])
        return jsonify({"message": "Cart cleared successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500
