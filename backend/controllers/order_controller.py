from flask import jsonify
from backend.database.dao import cart as cart_dao
from backend.database.dao import orders as orders_dao
from backend.database.dao import products as products_dao
from backend.database.dao import product_images as images_dao
from backend.database.dao import payments as payments_dao
from backend.controllers.serializers import (
    order_to_dict,
    order_item_to_dict,
    product_to_dict,
    product_image_to_dict,
    payment_to_dict,
)


def create_order(client_id, data):
    """Create an order from the cart."""
    try:
        cart = cart_dao.get_cart_by_client(client_id)
        if not cart:
            return jsonify({"message": "Cart is empty"}), 400

        cart_items = cart_dao.list_cart_items(cart["id_cart"])
        if not cart_items:
            return jsonify({"message": "Cart is empty"}), 400

        total_amount = 0
        order_items_data = []
        for cart_item in cart_items:
            product = products_dao.get_product(cart_item["id_product"])
            if not product:
                continue
            if product["stock"] < cart_item["quantity"]:
                return jsonify({
                    "message": f"Insufficient stock for product {product['product_name']}"
                }), 400
            item_price = float(product["price"]) if product["price"] is not None else 0
            total_amount += item_price * cart_item["quantity"]
            order_items_data.append({
                "id_product": cart_item["id_product"],
                "quantity": cart_item["quantity"],
                "price": item_price,
            })

        if total_amount == 0:
            return jsonify({"message": "Cannot create order with zero total"}), 400

        order_id = orders_dao.create_order_with_items(
            client_id, cart["id_cart"], order_items_data, total_amount
        )

        order = orders_dao.get_order(order_id)
        order_dict = order_to_dict(order)
        items = orders_dao.list_order_items(order_id)
        order_dict["items"] = [order_item_to_dict(item) for item in items]
        return jsonify({"message": "Order created successfully", "order": order_dict}), 201
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_client_orders(client_id):
    """Get all orders for a client."""
    try:
        orders = orders_dao.list_orders_by_client(client_id)
        result = []
        for order in orders:
            order_dict = order_to_dict(order)
            items = orders_dao.list_order_items(order["id_order"])
            order_dict["items"] = []
            for item in items:
                item_dict = order_item_to_dict(item)
                product = products_dao.get_product(item["id_product"])
                if product:
                    product_dict = product_to_dict(product)
                    images = images_dao.list_images_by_product(product["id_product"])
                    product_dict["images"] = [product_image_to_dict(img) for img in images[:1]]
                    item_dict["product"] = product_dict
                order_dict["items"].append(item_dict)
            payment = payments_dao.get_payment_by_order(order["id_order"])
            if payment:
                order_dict["payment"] = payment_to_dict(payment)
            result.append(order_dict)
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_order(order_id, client_id=None):
    """Get an order by ID."""
    try:
        order = orders_dao.get_order(order_id)
        if not order:
            return jsonify({"message": "Order not found"}), 404

        if client_id and order["id_client"] != client_id:
            return jsonify({"message": "Unauthorized"}), 403

        order_dict = order_to_dict(order)
        items = orders_dao.list_order_items(order_id)
        order_dict["items"] = []
        for item in items:
            item_dict = order_item_to_dict(item)
            product = products_dao.get_product(item["id_product"])
            if product:
                product_dict = product_to_dict(product)
                images = images_dao.list_images_by_product(product["id_product"])
                product_dict["images"] = [product_image_to_dict(img) for img in images]
                item_dict["product"] = product_dict
            order_dict["items"].append(item_dict)
        payment = payments_dao.get_payment_by_order(order_id)
        if payment:
            order_dict["payment"] = payment_to_dict(payment)
        return jsonify(order_dict), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def cancel_order(order_id, client_id):
    """Cancel an order."""
    try:
        order = orders_dao.get_order(order_id)
        if not order:
            return jsonify({"message": "Order not found"}), 404

        if order["id_client"] != client_id:
            return jsonify({"message": "Unauthorized"}), 403

        if order["order_status"] in ["delivered", "cancelled"]:
            return jsonify({"message": f"Cannot cancel order with status: {order['order_status']}"}), 400

        items = orders_dao.list_order_items(order_id)
        for item in items:
            products_dao.update_product_stock(item["id_product"], item["order_item_quantity"])

        orders_dao.update_order_status(
            order_id,
            {"order_status": "cancelled", "payment_status": "failed"},
        )

        order = orders_dao.get_order(order_id)
        return jsonify({"message": "Order cancelled successfully", "order": order_to_dict(order)}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500
