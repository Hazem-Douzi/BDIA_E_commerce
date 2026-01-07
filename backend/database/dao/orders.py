from backend.database.connection import get_db_manager


def create_order(client_id, total_amount, payment_status, order_status):
    query = (
        "INSERT INTO orders (id_client, total_amount, payment_status, order_status, order_createdAt) "
        "VALUES (%s, %s, %s, %s, NOW())"
    )
    return get_db_manager().execute_query(
        query, (client_id, total_amount, payment_status, order_status), commit=True
    )


def create_order_with_items(client_id, cart_id, items, total_amount):
    db = get_db_manager()
    with db.get_cursor(commit=True) as cursor:
        cursor.execute(
            "INSERT INTO orders (id_client, total_amount, payment_status, order_status, order_createdAt) "
            "VALUES (%s, %s, %s, %s, NOW())",
            (client_id, total_amount, "pending", "processing"),
        )
        order_id = cursor.lastrowid
        for item in items:
            cursor.execute(
                "INSERT INTO order_item (id_order, id_product, order_item_quantity, order_item_price) "
                "VALUES (%s, %s, %s, %s)",
                (order_id, item["id_product"], item["quantity"], item["price"]),
            )
            cursor.execute(
                "UPDATE product SET stock = stock - %s WHERE id_product = %s",
                (item["quantity"], item["id_product"]),
            )
        cursor.execute("DELETE FROM cart_item WHERE id_cart = %s", (cart_id,))
        return order_id


def get_order(order_id):
    query = (
        "SELECT id_order, id_client, total_amount, payment_status, order_status, order_createdAt "
        "FROM orders WHERE id_order = %s"
    )
    return get_db_manager().execute_query(query, (order_id,), fetch_one=True)


def list_orders_by_client(client_id):
    query = (
        "SELECT id_order, id_client, total_amount, payment_status, order_status, order_createdAt "
        "FROM orders WHERE id_client = %s ORDER BY order_createdAt DESC"
    )
    return get_db_manager().execute_query(query, (client_id,), fetch_all=True)


def list_orders_all():
    query = (
        "SELECT id_order, id_client, total_amount, payment_status, order_status, order_createdAt "
        "FROM orders ORDER BY order_createdAt DESC"
    )
    return get_db_manager().execute_query(query, fetch_all=True)


def list_orders_by_ids(order_ids):
    if not order_ids:
        return []
    placeholders = ", ".join(["%s"] * len(order_ids))
    query = (
        "SELECT id_order, id_client, total_amount, payment_status, order_status, order_createdAt "
        f"FROM orders WHERE id_order IN ({placeholders}) ORDER BY order_createdAt DESC"
    )
    return get_db_manager().execute_query(query, order_ids, fetch_all=True)


def update_order_status(order_id, fields):
    if not fields:
        return 0
    assignments = ", ".join(f"{key} = %s" for key in fields.keys())
    params = list(fields.values()) + [order_id]
    query = f"UPDATE orders SET {assignments} WHERE id_order = %s"
    return get_db_manager().execute_query(query, params, commit=True)


def create_order_item(order_id, product_id, quantity, price):
    query = (
        "INSERT INTO order_item (id_order, id_product, order_item_quantity, order_item_price) "
        "VALUES (%s, %s, %s, %s)"
    )
    return get_db_manager().execute_query(query, (order_id, product_id, quantity, price), commit=True)


def list_order_items(order_id):
    query = (
        "SELECT id_order_item, id_order, id_product, order_item_quantity, order_item_price "
        "FROM order_item WHERE id_order = %s"
    )
    return get_db_manager().execute_query(query, (order_id,), fetch_all=True)


def client_has_purchased_product(client_id, product_id):
    query = (
        "SELECT oi.id_order_item FROM order_item oi "
        "JOIN orders o ON o.id_order = oi.id_order "
        "WHERE o.id_client = %s AND oi.id_product = %s "
        "AND o.order_status = 'delivered' AND o.payment_status = 'paid' "
        "LIMIT 1"
    )
    return get_db_manager().execute_query(query, (client_id, product_id), fetch_one=True)


def list_order_items_by_products(product_ids):
    if not product_ids:
        return []
    placeholders = ", ".join(["%s"] * len(product_ids))
    query = (
        "SELECT id_order_item, id_order, id_product, order_item_quantity, order_item_price "
        f"FROM order_item WHERE id_product IN ({placeholders})"
    )
    return get_db_manager().execute_query(query, product_ids, fetch_all=True)


def delete_order_items_by_order(order_id):
    query = "DELETE FROM order_item WHERE id_order = %s"
    return get_db_manager().execute_query(query, (order_id,), commit=True)
