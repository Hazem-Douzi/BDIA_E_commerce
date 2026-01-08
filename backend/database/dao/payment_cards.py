from backend.database.connection import get_db_manager


def create_payment_card(client_id, card_number, card_holder_name, expiry_date, cvv, is_default=False):
    """Create a payment card for a client."""
    query = (
        "INSERT INTO payment_card (id_client, card_number, card_holder_name, expiry_date, cvv, is_default, created_at) "
        "VALUES (%s, %s, %s, %s, %s, %s, NOW())"
    )
    # If this card is set as default, unset all other default cards
    if is_default:
        unset_default_cards(client_id)
    return get_db_manager().execute_query(
        query, (client_id, card_number, card_holder_name, expiry_date, cvv, is_default), commit=True
    )


def list_payment_cards_by_client(client_id):
    """List all payment cards for a client."""
    query = (
        "SELECT id_payment_card, id_client, card_number, card_holder_name, expiry_date, cvv, is_default, created_at "
        "FROM payment_card WHERE id_client = %s ORDER BY is_default DESC, created_at DESC"
    )
    return get_db_manager().execute_query(query, (client_id,), fetch_all=True)


def get_payment_card(card_id, client_id=None):
    """Get a payment card by ID."""
    if client_id:
        query = (
            "SELECT id_payment_card, id_client, card_number, card_holder_name, expiry_date, cvv, is_default, created_at "
            "FROM payment_card WHERE id_payment_card = %s AND id_client = %s"
        )
        return get_db_manager().execute_query(query, (card_id, client_id), fetch_one=True)
    else:
        query = (
            "SELECT id_payment_card, id_client, card_number, card_holder_name, expiry_date, cvv, is_default, created_at "
            "FROM payment_card WHERE id_payment_card = %s"
        )
        return get_db_manager().execute_query(query, (card_id,), fetch_one=True)


def update_payment_card(card_id, client_id, fields):
    """Update a payment card."""
    if not fields:
        return 0
    
    # If setting this card as default, unset all other default cards
    if fields.get('is_default'):
        card = get_payment_card(card_id, client_id)
        if card:
            unset_default_cards(client_id)
    
    assignments = ", ".join(f"{key} = %s" for key in fields.keys())
    params = list(fields.values()) + [card_id, client_id]
    query = f"UPDATE payment_card SET {assignments} WHERE id_payment_card = %s AND id_client = %s"
    return get_db_manager().execute_query(query, params, commit=True)


def delete_payment_card(card_id, client_id):
    """Delete a payment card."""
    query = "DELETE FROM payment_card WHERE id_payment_card = %s AND id_client = %s"
    return get_db_manager().execute_query(query, (card_id, client_id), commit=True)


def unset_default_cards(client_id):
    """Unset all default cards for a client."""
    query = "UPDATE payment_card SET is_default = 0 WHERE id_client = %s"
    return get_db_manager().execute_query(query, (client_id,), commit=True)
