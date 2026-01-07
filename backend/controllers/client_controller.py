import bcrypt
from flask import jsonify
from backend.database.dao import users as users_dao
from backend.database.dao import orders as orders_dao
from backend.controllers.serializers import user_to_dict, order_to_dict


def get_client_profile(client_id):
    """Get client profile."""
    try:
        client = users_dao.get_user_by_id(client_id)
        if not client or client["rolee"] != "client":
            return jsonify({"message": "Client not found"}), 404

        client_dict = user_to_dict(client)
        orders = orders_dao.list_orders_by_client(client_id)
        total_spent = sum(
            order["total_amount"] for order in orders if order["payment_status"] == "paid"
        )
        client_dict["stats"] = {
            "total_orders": len(orders),
            "total_spent": float(total_spent) if total_spent is not None else 0,
        }
        return jsonify(client_dict), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_client_profile(client_id, data):
    """Update client profile."""
    try:
        client = users_dao.get_user_by_id(client_id)
        if not client or client["rolee"] != "client":
            return jsonify({"message": "Client not found"}), 404

        update_fields = {}
        if "full_name" in data:
            update_fields["full_name"] = data["full_name"]
        if "phone" in data:
            update_fields["phone"] = data["phone"]
        if "adress" in data:
            update_fields["adress"] = data["adress"]
        if "email" in data:
            existing = users_dao.get_user_by_email(data["email"])
            if existing and existing["id_user"] != client_id:
                return jsonify({"message": "Email already in use"}), 400
            update_fields["email"] = data["email"]
        if "password" in data and data["password"]:
            update_fields["pass_word"] = bcrypt.hashpw(
                data["password"].encode("utf-8"), bcrypt.gensalt(10)
            ).decode("utf-8")

        users_dao.update_user(client_id, update_fields)
        client = users_dao.get_user_by_id(client_id)
        return jsonify({
            "message": "Client profile updated successfully",
            "client": user_to_dict(client),
        }), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500
