from backend.database.connection import get_db_manager


def create_subcategory(name, category_id, description):
    query = (
        "INSERT INTO SubCategory (SubCategory_name, id_category, SubCategory_description) "
        "VALUES (%s, %s, %s)"
    )
    return get_db_manager().execute_query(query, (name, category_id, description), commit=True)


def list_subcategories():
    query = (
        "SELECT id_SubCategory, SubCategory_name, id_category, SubCategory_description "
        "FROM SubCategory"
    )
    return get_db_manager().execute_query(query, fetch_all=True)


def list_subcategories_by_category(category_id):
    query = (
        "SELECT id_SubCategory, SubCategory_name, id_category, SubCategory_description "
        "FROM SubCategory WHERE id_category = %s"
    )
    return get_db_manager().execute_query(query, (category_id,), fetch_all=True)


def get_subcategory(subcategory_id):
    query = (
        "SELECT id_SubCategory, SubCategory_name, id_category, SubCategory_description "
        "FROM SubCategory WHERE id_SubCategory = %s"
    )
    return get_db_manager().execute_query(query, (subcategory_id,), fetch_one=True)


def update_subcategory(subcategory_id, fields):
    if not fields:
        return 0
    assignments = ", ".join(f"{key} = %s" for key in fields.keys())
    params = list(fields.values()) + [subcategory_id]
    query = f"UPDATE SubCategory SET {assignments} WHERE id_SubCategory = %s"
    return get_db_manager().execute_query(query, params, commit=True)


def delete_subcategory(subcategory_id):
    query = "DELETE FROM SubCategory WHERE id_SubCategory = %s"
    return get_db_manager().execute_query(query, (subcategory_id,), commit=True)

