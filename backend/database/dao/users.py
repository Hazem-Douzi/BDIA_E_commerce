from backend.database.connection import get_db_manager


def get_user_by_email(email):
    query = (
        "SELECT id_user, full_name, email, pass_word, rolee, phone, adress, createdAT "
        "FROM users WHERE email = %s"
    )
    return get_db_manager().execute_query(query, (email,), fetch_one=True)


def get_user_by_id(user_id):
    query = (
        "SELECT id_user, full_name, email, pass_word, rolee, phone, adress, createdAT "
        "FROM users WHERE id_user = %s"
    )
    return get_db_manager().execute_query(query, (user_id,), fetch_one=True)


def list_users():
    query = (
        "SELECT id_user, full_name, email, rolee, phone, adress, createdAT "
        "FROM users ORDER BY id_user DESC"
    )
    return get_db_manager().execute_query(query, fetch_all=True)


def list_users_by_role(role):
    query = (
        "SELECT id_user, full_name, email, rolee, phone, adress, createdAT "
        "FROM users WHERE rolee = %s ORDER BY id_user DESC"
    )
    return get_db_manager().execute_query(query, (role,), fetch_all=True)


def create_user(full_name, email, password_hash, rolee, phone, adress):
    query = (
        "INSERT INTO users (full_name, email, pass_word, rolee, phone, adress, createdAT) "
        "VALUES (%s, %s, %s, %s, %s, %s, NOW())"
    )
    return get_db_manager().execute_query(
        query, (full_name, email, password_hash, rolee, phone, adress), commit=True
    )


def update_user(user_id, fields):
    if not fields:
        return 0
    assignments = ", ".join(f"{key} = %s" for key in fields.keys())
    params = list(fields.values()) + [user_id]
    query = f"UPDATE users SET {assignments} WHERE id_user = %s"
    return get_db_manager().execute_query(query, params, commit=True)


def delete_user(user_id):
    query = "DELETE FROM users WHERE id_user = %s"
    return get_db_manager().execute_query(query, (user_id,), commit=True)


def count_users():
    query = "SELECT COUNT(*) AS total FROM users"
    row = get_db_manager().execute_query(query, fetch_one=True)
    return row["total"] if row else 0


def count_users_by_role(role):
    query = "SELECT COUNT(*) AS total FROM users WHERE rolee = %s"
    row = get_db_manager().execute_query(query, (role,), fetch_one=True)
    return row["total"] if row else 0

