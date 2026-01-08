from backend.database.connection import get_db_manager


def add_to_wishlist(client_id, product_id):
    """Add a product to client's wishlist."""
    query = (
        "INSERT INTO wishlist (id_client, id_product, wishlist_createdAt) "
        "VALUES (%s, %s, NOW())"
    )
    return get_db_manager().execute_query(
        query, (client_id, product_id), commit=True
    )


def remove_from_wishlist(client_id, product_id):
    """Remove a product from client's wishlist."""
    query = (
        "DELETE FROM wishlist WHERE id_client = %s AND id_product = %s"
    )
    return get_db_manager().execute_query(
        query, (client_id, product_id), commit=True
    )


def get_wishlist_by_client(client_id):
    """Get all products in client's wishlist."""
    query = (
        "SELECT w.id_wishlist, w.id_client, w.id_product, w.wishlist_createdAt "
        "FROM wishlist w "
        "WHERE w.id_client = %s "
        "ORDER BY w.wishlist_createdAt DESC"
    )
    return get_db_manager().execute_query(query, (client_id,), fetch_all=True)


def is_product_in_wishlist(client_id, product_id):
    """Check if a product is already in client's wishlist."""
    query = (
        "SELECT id_wishlist FROM wishlist "
        "WHERE id_client = %s AND id_product = %s"
    )
    result = get_db_manager().execute_query(query, (client_id, product_id), fetch_one=True)
    return result is not None


def get_wishlist_product_ids(client_id):
    """Get list of product IDs in client's wishlist."""
    query = (
        "SELECT id_product FROM wishlist WHERE id_client = %s"
    )
    results = get_db_manager().execute_query(query, (client_id,), fetch_all=True)
    return [row['id_product'] for row in results] if results else []
