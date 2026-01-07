from backend.database.connection import get_db_manager


def create_product(data):
    query = (
        "INSERT INTO product (product_name, brand, product_description, price, stock, rating, "
        "id_seller, id_SubCategory, createdAtt, updatedAt) "
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
        data.get("id_SubCategory"),
    )
    return get_db_manager().execute_query(query, params, commit=True)


def get_product(product_id):
    query = (
        "SELECT id_product, product_name, brand, product_description, price, stock, rating, "
        "id_seller, id_SubCategory, createdAtt, updatedAt "
        "FROM product WHERE id_product = %s"
    )
    return get_db_manager().execute_query(query, (product_id,), fetch_one=True)


def list_products():
    query = (
        "SELECT id_product, product_name, brand, product_description, price, stock, rating, "
        "id_seller, id_SubCategory, createdAtt, updatedAt "
        "FROM product"
    )
    return get_db_manager().execute_query(query, fetch_all=True)


def list_products_by_seller(seller_id):
    query = (
        "SELECT id_product, product_name, brand, product_description, price, stock, rating, "
        "id_seller, id_SubCategory, createdAtt, updatedAt "
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


def search_products(conditions, params):
    base = (
        "SELECT id_product, product_name, brand, product_description, price, stock, rating, "
        "id_seller, id_SubCategory, createdAtt, updatedAt "
        "FROM product"
    )
    if conditions:
        base += " WHERE " + " AND ".join(conditions)
    return get_db_manager().execute_query(base, params, fetch_all=True)


def update_product_stock(product_id, delta):
    query = "UPDATE product SET stock = stock + %s WHERE id_product = %s"
    return get_db_manager().execute_query(query, (delta, product_id), commit=True)


def update_product_rating(product_id, rating):
    query = "UPDATE product SET rating = %s WHERE id_product = %s"
    return get_db_manager().execute_query(query, (rating, product_id), commit=True)

