from backend.database.connection import get_db_manager


def get_profile_by_user_id(user_id):
    query = (
        "SELECT id_seller_profile, id_user, shop_name, shop_description, verification_status "
        "FROM seller_profile WHERE id_user = %s"
    )
    return get_db_manager().execute_query(query, (user_id,), fetch_one=True)


def create_profile(user_id, shop_name, shop_description, status):
    query = (
        "INSERT INTO seller_profile (id_user, shop_name, shop_description, verification_status) "
        "VALUES (%s, %s, %s, %s)"
    )
    return get_db_manager().execute_query(
        query, (user_id, shop_name, shop_description, status), commit=True
    )


def update_profile(user_id, fields):
    if not fields:
        return 0
    assignments = ", ".join(f"{key} = %s" for key in fields.keys())
    params = list(fields.values()) + [user_id]
    query = f"UPDATE seller_profile SET {assignments} WHERE id_user = %s"
    return get_db_manager().execute_query(query, params, commit=True)


def count_pending_verifications():
    query = "SELECT COUNT(*) AS total FROM seller_profile WHERE verification_status = 'pending'"
    row = get_db_manager().execute_query(query, fetch_one=True)
    return row["total"] if row else 0

