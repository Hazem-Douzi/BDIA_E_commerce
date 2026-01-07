from backend.database.connection import get_db_manager


def create_category(name, description, image):
    query = (
        "INSERT INTO category (category_name, category_description, image) "
        "VALUES (%s, %s, %s)"
    )
    return get_db_manager().execute_query(query, (name, description, image), commit=True)


def list_categories():
    query = "SELECT id_category, category_name, category_description, image FROM category"
    return get_db_manager().execute_query(query, fetch_all=True)


def get_category(category_id):
    query = (
        "SELECT id_category, category_name, category_description, image "
        "FROM category WHERE id_category = %s"
    )
    return get_db_manager().execute_query(query, (category_id,), fetch_one=True)


def get_category_by_name(name):
    query = (
        "SELECT id_category, category_name, category_description, image "
        "FROM category WHERE category_name = %s"
    )
    return get_db_manager().execute_query(query, (name,), fetch_one=True)


def update_category(category_id, fields):
    if not fields:
        return 0
    assignments = ", ".join(f"{key} = %s" for key in fields.keys())
    params = list(fields.values()) + [category_id]
    query = f"UPDATE category SET {assignments} WHERE id_category = %s"
    return get_db_manager().execute_query(query, params, commit=True)


def delete_category(category_id):
    query = "DELETE FROM category WHERE id_category = %s"
    return get_db_manager().execute_query(query, (category_id,), commit=True)
