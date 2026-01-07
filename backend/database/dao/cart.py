from backend.database.connection import get_db_manager


def get_cart_by_client(client_id):
    query = "SELECT id_cart, id_client, cart_createdAt FROM cart WHERE id_client = %s"
    return get_db_manager().execute_query(query, (client_id,), fetch_one=True)


def get_cart(cart_id):
    query = "SELECT id_cart, id_client, cart_createdAt FROM cart WHERE id_cart = %s"
    return get_db_manager().execute_query(query, (cart_id,), fetch_one=True)


def create_cart(client_id):
    query = "INSERT INTO cart (id_client, cart_createdAt) VALUES (%s, NOW())"
    return get_db_manager().execute_query(query, (client_id,), commit=True)


def list_cart_items(cart_id):
    query = (
        "SELECT id_cart_item, id_cart, id_product, quantity "
        "FROM cart_item WHERE id_cart = %s"
    )
    return get_db_manager().execute_query(query, (cart_id,), fetch_all=True)


def get_cart_item(cart_item_id):
    query = (
        "SELECT id_cart_item, id_cart, id_product, quantity "
        "FROM cart_item WHERE id_cart_item = %s"
    )
    return get_db_manager().execute_query(query, (cart_item_id,), fetch_one=True)


def get_cart_item_by_product(cart_id, product_id):
    query = (
        "SELECT id_cart_item, id_cart, id_product, quantity "
        "FROM cart_item WHERE id_cart = %s AND id_product = %s"
    )
    return get_db_manager().execute_query(query, (cart_id, product_id), fetch_one=True)


def add_cart_item(cart_id, product_id, quantity):
    query = (
        "INSERT INTO cart_item (id_cart, id_product, quantity) VALUES (%s, %s, %s)"
    )
    return get_db_manager().execute_query(query, (cart_id, product_id, quantity), commit=True)


def update_cart_item_quantity(cart_item_id, quantity):
    query = "UPDATE cart_item SET quantity = %s WHERE id_cart_item = %s"
    return get_db_manager().execute_query(query, (quantity, cart_item_id), commit=True)


def delete_cart_item(cart_item_id):
    query = "DELETE FROM cart_item WHERE id_cart_item = %s"
    return get_db_manager().execute_query(query, (cart_item_id,), commit=True)


def clear_cart(cart_id):
    query = "DELETE FROM cart_item WHERE id_cart = %s"
    return get_db_manager().execute_query(query, (cart_id,), commit=True)
