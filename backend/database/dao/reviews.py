from backend.database.connection import get_db_manager


def create_review(rating, comment, product_id, client_id):
    query = (
        "INSERT INTO review (rating_review, commentt, id_product, id_client, review_createdAt) "
        "VALUES (%s, %s, %s, %s, NOW())"
    )
    return get_db_manager().execute_query(
        query, (rating, comment, product_id, client_id), commit=True
    )


def get_review(review_id):
    query = (
        "SELECT id_review, rating_review, commentt, id_product, id_client, review_createdAt "
        "FROM review WHERE id_review = %s"
    )
    return get_db_manager().execute_query(query, (review_id,), fetch_one=True)


def list_reviews_by_product(product_id):
    query = (
        "SELECT id_review, rating_review, commentt, id_product, id_client, review_createdAt "
        "FROM review WHERE id_product = %s ORDER BY review_createdAt DESC"
    )
    return get_db_manager().execute_query(query, (product_id,), fetch_all=True)


def list_reviews_by_client(client_id):
    query = (
        "SELECT id_review, rating_review, commentt, id_product, id_client, review_createdAt "
        "FROM review WHERE id_client = %s ORDER BY review_createdAt DESC"
    )
    return get_db_manager().execute_query(query, (client_id,), fetch_all=True)


def update_review(review_id, fields):
    if not fields:
        return 0
    assignments = ", ".join(f"{key} = %s" for key in fields.keys())
    params = list(fields.values()) + [review_id]
    query = f"UPDATE review SET {assignments} WHERE id_review = %s"
    return get_db_manager().execute_query(query, params, commit=True)


def delete_review(review_id):
    query = "DELETE FROM review WHERE id_review = %s"
    return get_db_manager().execute_query(query, (review_id,), commit=True)


def get_review_by_client_and_product(client_id, product_id):
    query = (
        "SELECT id_review, rating_review, commentt, id_product, id_client, review_createdAt "
        "FROM review WHERE id_client = %s AND id_product = %s"
    )
    return get_db_manager().execute_query(query, (client_id, product_id), fetch_one=True)


def average_rating_for_product(product_id):
    query = "SELECT AVG(rating_review) AS avg_rating FROM review WHERE id_product = %s"
    row = get_db_manager().execute_query(query, (product_id,), fetch_one=True)
    return row["avg_rating"] if row and row["avg_rating"] is not None else None

