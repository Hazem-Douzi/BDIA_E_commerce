from flask import jsonify, request
from backend.database.dao import payment_cards as payment_cards_dao
from backend.controllers.serializers import payment_card_to_dict


def get_client_payment_cards(client_id):
    """Get all payment cards for a client."""
    try:
        cards = payment_cards_dao.list_payment_cards_by_client(client_id)
        result = [payment_card_to_dict(card) for card in cards]
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def create_payment_card(client_id, data):
    """Create a payment card for a client."""
    try:
        card_number = data.get("card_number")
        card_holder_name = data.get("card_holder_name")
        expiry_date = data.get("expiry_date")
        cvv = data.get("cvv")
        is_default = data.get("is_default", False)

        if not card_number or not card_holder_name or not expiry_date or not cvv:
            return jsonify({"message": "Missing required fields"}), 400

        # Validate card number (should be 16 digits)
        if len(card_number.replace(' ', '')) < 13 or len(card_number.replace(' ', '')) > 19:
            return jsonify({"message": "Invalid card number"}), 400

        # Validate expiry date format (MM/YY)
        if len(expiry_date) < 5:
            return jsonify({"message": "Invalid expiry date format"}), 400

        card_id = payment_cards_dao.create_payment_card(
            client_id, card_number, card_holder_name, expiry_date, cvv, is_default
        )
        card = payment_cards_dao.get_payment_card(card_id, client_id)
        return jsonify({"message": "Payment card created successfully", "card": payment_card_to_dict(card)}), 201
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_payment_card(card_id, client_id, data):
    """Update a payment card."""
    try:
        card = payment_cards_dao.get_payment_card(card_id, client_id)
        if not card:
            return jsonify({"message": "Payment card not found"}), 404

        update_fields = {}
        if "card_number" in data:
            card_number = data["card_number"]
            if len(card_number.replace(' ', '')) < 13 or len(card_number.replace(' ', '')) > 19:
                return jsonify({"message": "Invalid card number"}), 400
            update_fields["card_number"] = card_number
        if "card_holder_name" in data:
            update_fields["card_holder_name"] = data["card_holder_name"]
        if "expiry_date" in data:
            expiry_date = data["expiry_date"]
            if len(expiry_date) < 5:
                return jsonify({"message": "Invalid expiry date format"}), 400
            update_fields["expiry_date"] = expiry_date
        if "cvv" in data:
            update_fields["cvv"] = data["cvv"]
        if "is_default" in data:
            update_fields["is_default"] = data["is_default"]

        if update_fields:
            payment_cards_dao.update_payment_card(card_id, client_id, update_fields)

        updated_card = payment_cards_dao.get_payment_card(card_id, client_id)
        return jsonify({"message": "Payment card updated successfully", "card": payment_card_to_dict(updated_card)}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def delete_payment_card(card_id, client_id):
    """Delete a payment card."""
    try:
        card = payment_cards_dao.get_payment_card(card_id, client_id)
        if not card:
            return jsonify({"message": "Payment card not found"}), 404

        payment_cards_dao.delete_payment_card(card_id, client_id)
        return jsonify({"message": "Payment card deleted successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500
