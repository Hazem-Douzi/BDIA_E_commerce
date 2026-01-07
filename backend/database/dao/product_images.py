from backend.database.connection import get_db_manager


def list_images_by_product(product_id):
    query = (
        "SELECT id_product_image, imageURL, id_product "
        "FROM product_image WHERE id_product = %s"
    )
    return get_db_manager().execute_query(query, (product_id,), fetch_all=True)


def create_image(product_id, image_url):
    query = "INSERT INTO product_image (imageURL, id_product) VALUES (%s, %s)"
    return get_db_manager().execute_query(query, (image_url, product_id), commit=True)


def delete_images_by_product(product_id):
    query = "DELETE FROM product_image WHERE id_product = %s"
    return get_db_manager().execute_query(query, (product_id,), commit=True)

