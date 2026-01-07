from flask import jsonify
from datetime import datetime
from backend.database.dao import payments as payments_dao
from backend.database.dao import orders as orders_dao
from backend.controllers.serializers import payment_to_dict, order_to_dict


def create_payment(order_id, client_id, data):
    """Create payment for an order."""
    try:
        order = orders_dao.get_order(order_id)
        if not order:
            return jsonify({"message": "Order not found"}), 404

        if order["id_client"] != client_id:
            return jsonify({"message": "Unauthorized"}), 403

        existing_payment = payments_dao.get_payment_by_order(order_id)
        if existing_payment:
            return jsonify({"message": "Payment already exists for this order"}), 400

        method = data.get("method", "cash_on_delivery")
        if method not in ["card", "cash_on_delivery", "flouci"]:
            return jsonify({"message": "Invalid payment method"}), 400

        status = "pending"
        transaction_id = data.get("id_transaction")
        if method == "cash_on_delivery":
            status = "pending"
            orders_dao.update_order_status(order_id, {"payment_status": "pending"})
        else:
            status = "succes"
            transaction_id = transaction_id or f"TXN{datetime.utcnow().timestamp()}"
            orders_dao.update_order_status(order_id, {"payment_status": "paid"})

        payment_id = payments_dao.create_payment(
            order_id, order["total_amount"], method, status, transaction_id
        )
        payment = payments_dao.get_payment(payment_id)
        return jsonify({"message": "Payment created successfully", "payment": payment_to_dict(payment)}), 201
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_order_payment(order_id, client_id=None):
    """Get payment by order."""
    try:
        payment = payments_dao.get_payment_by_order(order_id)
        if not payment:
            return jsonify({"message": "Payment not found"}), 404

        if client_id:
            order = orders_dao.get_order(order_id)
            if not order or order["id_client"] != client_id:
                return jsonify({"message": "Unauthorized"}), 403

        payment_dict = payment_to_dict(payment)
        order = orders_dao.get_order(order_id)
        if order:
            payment_dict["order"] = order_to_dict(order)
        return jsonify(payment_dict), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_payment_status(payment_id, data):
    """Update payment status (admin)."""
    try:
        payment = payments_dao.get_payment(payment_id)
        if not payment:
            return jsonify({"message": "Payment not found"}), 404

        status = data.get("payment_status")
        if status and status in ["succes", "failed", "pending"]:
            payments_dao.update_payment_status(payment_id, status)
            if status == "succes":
                orders_dao.update_order_status(payment["id_order"], {"payment_status": "paid"})
            elif status == "failed":
                orders_dao.update_order_status(payment["id_order"], {"payment_status": "failed"})
            else:
                orders_dao.update_order_status(payment["id_order"], {"payment_status": "pending"})

        payment = payments_dao.get_payment(payment_id)
        return jsonify({"message": "Payment status updated successfully", "payment": payment_to_dict(payment)}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500
