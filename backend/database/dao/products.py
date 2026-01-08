from backend.database.connection import get_db_manager


def create_product(data):
    query = (
        "INSERT INTO product (product_name, brand, product_description, price, stock, rating, "
        "id_seller, id_category, createdAtt, updatedAt) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())"
    )
    params = (
        data.get("product_name"),
        data.get("brand"),
        data.get("product_description"),
        data.get("price"),
        data.get("stock", 0),
        data.get("rating", 0.0),
        data.get("id_seller"),
        data.get("id_category"),
    )
    return get_db_manager().execute_query(query, params, commit=True)


def get_product(product_id):
    query = (
        "SELECT id_product, product_name, brand, product_description, price, stock, rating, "
        "id_seller, id_category, id_SubCategory, createdAtt, updatedAt "
        "FROM product WHERE id_product = %s"
    )
    return get_db_manager().execute_query(query, (product_id,), fetch_one=True)


def list_products():
    query = (
        "SELECT id_product, product_name, brand, product_description, price, stock, rating, "
        "id_seller, id_category, createdAtt, updatedAt "
        "FROM product"
    )
    return get_db_manager().execute_query(query, fetch_all=True)


def list_products_by_seller(seller_id):
    query = (
        "SELECT id_product, product_name, brand, product_description, price, stock, rating, "
        "id_seller, id_category, id_SubCategory, createdAtt, updatedAt "
        "FROM product WHERE id_seller = %s"
    )
    return get_db_manager().execute_query(query, (seller_id,), fetch_all=True)


def update_product(product_id, fields):
    if not fields:
        return 0
    fields["updatedAt"] = "NOW()"
    assignments = []
    params = []
    for key, value in fields.items():
        if value == "NOW()":
            assignments.append(f"{key} = NOW()")
        else:
            assignments.append(f"{key} = %s")
            params.append(value)
    params.append(product_id)
    query = f"UPDATE product SET {', '.join(assignments)} WHERE id_product = %s"
    return get_db_manager().execute_query(query, params, commit=True)


def delete_product(product_id):
    query = "DELETE FROM product WHERE id_product = %s"
    return get_db_manager().execute_query(query, (product_id,), commit=True)


def search_products(conditions, params, order_by=None, limit=None, offset=None):
    """
    Recherche de produits avec filtres SQL complets.
    Pas d'ORM - uniquement des requêtes SQL pures MySQL.
    """
    base = (
        "SELECT id_product, product_name, brand, product_description, price, stock, rating, "
        "id_seller, id_category, id_SubCategory, createdAtt, updatedAt "
        "FROM product"
    )
    if conditions:
        base += " WHERE " + " AND ".join(conditions)
    
    # Ajouter le tri (ORDER BY)
    if order_by:
        base += f" ORDER BY {order_by}"
    else:
        base += " ORDER BY createdAtt DESC"  # Tri par défaut
    
    # Ajouter la pagination (LIMIT et OFFSET)
    if limit is not None:
        base += f" LIMIT {limit}"
        if offset is not None:
            base += f" OFFSET {offset}"
    
    return get_db_manager().execute_query(base, params, fetch_all=True)


def count_products(conditions, params):
    """
    Compte le nombre total de produits correspondant aux filtres.
    Utilisé pour la pagination côté backend.
    """
    base = "SELECT COUNT(*) as total FROM product"
    if conditions:
        base += " WHERE " + " AND ".join(conditions)
    result = get_db_manager().execute_query(base, params, fetch_one=True)
    return result["total"] if result else 0


def update_product_stock(product_id, delta):
    query = "UPDATE product SET stock = stock + %s WHERE id_product = %s"
    return get_db_manager().execute_query(query, (delta, product_id), commit=True)


def update_product_rating(product_id, rating):
    query = "UPDATE product SET rating = %s WHERE id_product = %s"
    return get_db_manager().execute_query(query, (rating, product_id), commit=True)


def get_top_sellers_by_product_count(limit=5):
    """Get top sellers by number of products."""
    query = (
        "SELECT p.id_seller, COUNT(p.id_product) as product_count "
        "FROM product p "
        "GROUP BY p.id_seller "
        "ORDER BY product_count DESC "
        "LIMIT %s"
    )
    return get_db_manager().execute_query(query, (limit,), fetch_all=True)