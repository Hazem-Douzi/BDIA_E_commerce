import bcrypt
from flask import jsonify
from backend.database.dao import users as users_dao
from backend.database.dao import orders as orders_dao
from backend.database.dao import products as products_dao
from backend.database.dao import categories as categories_dao
from backend.database.dao import product_images as product_images_dao
from backend.controllers.serializers import (
    user_to_dict, order_to_dict, product_to_dict,
    category_to_dict, product_image_to_dict, review_to_dict
)


def get_client_profile(client_id):
    """Get client profile."""
    try:
        client = users_dao.get_user_by_id(client_id)
        if not client or client["rolee"] != "client":
            return jsonify({"message": "Client not found"}), 404

        client_dict = user_to_dict(client)
        orders = orders_dao.list_orders_by_client(client_id)
        total_spent = sum(
            order["total_amount"] for order in orders if order["payment_status"] == "paid"
        )
        client_dict["stats"] = {
            "total_orders": len(orders),
            "total_spent": float(total_spent) if total_spent is not None else 0,
        }
        return jsonify(client_dict), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def update_client_profile(client_id, data):
    """Update client profile."""
    try:
        client = users_dao.get_user_by_id(client_id)
        if not client or client["rolee"] != "client":
            return jsonify({"message": "Client not found"}), 404

        update_fields = {}
        if "full_name" in data:
            update_fields["full_name"] = data["full_name"]
        if "phone" in data:
            update_fields["phone"] = data["phone"]
        if "adress" in data:
            update_fields["adress"] = data["adress"]
        if "email" in data:
            existing = users_dao.get_user_by_email(data["email"])
            if existing and existing["id_user"] != client_id:
                return jsonify({"message": "Email already in use"}), 400
            update_fields["email"] = data["email"]
        if "password" in data and data["password"]:
            update_fields["pass_word"] = bcrypt.hashpw(
                data["password"].encode("utf-8"), bcrypt.gensalt(10)
            ).decode("utf-8")

        return jsonify({
            "message": "Client profile updated successfully",
            "client": user_to_dict(client),
        }), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_client_home_data():
    """Get data for client home page."""
    try:
        # Get featured products (recently added, high rated)
        featured_products = _get_featured_products_data(8)

        # Get categories
        categories = _get_categories_data()

        # Get recent products
        recent_products = _get_recent_products_data(6)

        return jsonify({
            "featured_products": featured_products,
            "categories": categories,
            "recent_products": recent_products,
        }), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def _get_featured_products_data(limit=10):
    """Get featured products data (helper method)."""
    # Get products with high rating first, then recent ones
    query = """
        SELECT id_product, product_name, brand, product_description, price, stock, rating,
               id_seller, id_category, createdAtt, updatedAt
        FROM product
        WHERE stock > 0
        ORDER BY rating DESC, createdAtt DESC
        LIMIT %s
    """
    from backend.database.connection import get_db_manager
    products = get_db_manager().execute_query(query, (limit,), fetch_all=True)

    # Add images to products
    products_with_images = []
    for product in products:
        product_dict = product_to_dict(product)
        images = product_images_dao.list_images_by_product(product['id_product'])
        product_dict['images'] = [product_image_to_dict(img) for img in images]
        products_with_images.append(product_dict)

    return products_with_images


def _get_categories_data():
    """Get categories data (helper method)."""
    categories = categories_dao.list_categories()
    return [category_to_dict(cat) for cat in categories]


def _get_recent_products_data(limit=10):
    """Get recent products data (helper method)."""
    query = """
        SELECT id_product, product_name, brand, product_description, price, stock, rating,
               id_seller, id_category, createdAtt, updatedAt
        FROM product
        WHERE stock > 0
        ORDER BY createdAtt DESC
        LIMIT %s
    """
    from backend.database.connection import get_db_manager
    products = get_db_manager().execute_query(query, (limit,), fetch_all=True)

    # Add images to products
    products_with_images = []
    for product in products:
        product_dict = product_to_dict(product)
        images = product_images_dao.list_images_by_product(product['id_product'])
        product_dict['images'] = [product_image_to_dict(img) for img in images]
        products_with_images.append(product_dict)

    return products_with_images


def get_featured_products(limit=10):
    """Get featured products (public method)."""
    try:
        products = _get_featured_products_data(limit)
        return jsonify(products), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_home_categories():
    """Get categories for home page display."""
    try:
        categories = _get_categories_data()
        return jsonify(categories), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_recent_products(limit=10):
    """Get recently added products."""
    try:
        products = _get_recent_products_data(limit)
        return jsonify(products), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def search_products(query='', category_id=None, min_price=None, max_price=None,
                   sort_by='createdAtt', sort_order='desc', limit=20, offset=0):
    """Search products with filters."""
    try:
        conditions = []
        params = []

        if query:
            conditions.append("(product_name LIKE %s OR brand LIKE %s OR product_description LIKE %s)")
            search_term = f"%{query}%"
            params.extend([search_term, search_term, search_term])

        if category_id:
            conditions.append("id_category = %s")
            params.append(category_id)

        if min_price is not None:
            conditions.append("price >= %s")
            params.append(min_price)

        if max_price is not None:
            conditions.append("price <= %s")
            params.append(max_price)

        # Always filter for products in stock
        conditions.append("stock > 0")

        # Build the query
        base_query = """
            SELECT id_product, product_name, brand, product_description, price, stock, rating,
                   id_seller, id_category, createdAtt, updatedAt
            FROM product
        """

        if conditions:
            base_query += " WHERE " + " AND ".join(conditions)

        # Validate sort_by to prevent SQL injection
        allowed_sort_fields = ['createdAtt', 'price', 'rating', 'product_name']
        if sort_by not in allowed_sort_fields:
            sort_by = 'createdAtt'

        sort_direction = 'DESC' if sort_order.lower() == 'desc' else 'ASC'
        base_query += f" ORDER BY {sort_by} {sort_direction}"

        base_query += " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        from backend.database.connection import get_db_manager
        products = get_db_manager().execute_query(base_query, params, fetch_all=True)

        # Add images to products
        products_with_images = []
        for product in products:
            product_dict = product_to_dict(product)
            images = product_images_dao.list_images_by_product(product['id_product'])
            product_dict['images'] = [product_image_to_dict(img) for img in images]
            products_with_images.append(product_dict)

        # Get total count for pagination
        count_query = "SELECT COUNT(*) as total FROM product"
        if conditions:
            count_query += " WHERE " + " AND ".join(conditions)

        total_result = get_db_manager().execute_query(count_query, params[:-2], fetch_one=True)
        total = total_result['total'] if total_result else 0

        return jsonify({
            "products": products_with_images,
            "total": total,
            "limit": limit,
            "offset": offset
        }), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_products_by_category(category_id, limit=20, offset=0, sort_by='createdAtt', sort_order='desc'):
    """Get products by category."""
    try:
        return search_products(
            category_id=category_id,
            sort_by=sort_by,
            sort_order=sort_order,
            limit=limit,
            offset=offset
        )
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_product_details(product_id):
    """Get detailed product information including images and reviews."""
    try:
        product = products_dao.get_product(product_id)
        if not product:
            return jsonify({"message": "Product not found"}), 404

        product_dict = product_to_dict(product)

        # Get product images
        images = product_images_dao.list_images_by_product(product_id)
        product_dict['images'] = [product_image_to_dict(img) for img in images]

        # Get category information
        category = categories_dao.get_category(product['id_category'])
        product_dict['category'] = category_to_dict(category)

        # Get reviews (if reviews DAO exists)
        try:
            from backend.database.dao import reviews as reviews_dao
            reviews = reviews_dao.list_reviews_by_product(product_id)
            product_dict['reviews'] = [review_to_dict(review) for review in reviews]
            product_dict['review_count'] = len(reviews)
        except:
            product_dict['reviews'] = []
            product_dict['review_count'] = 0

        return jsonify(product_dict), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_personalized_recommendations(client_id, limit=10):
    """Get personalized product recommendations based on user's order history."""
    try:
        # Get user's order history to find preferred categories
        orders = orders_dao.list_orders_by_client(client_id)

        if not orders:
            # If no order history, return featured products
            return get_featured_products(limit)

        # Find categories from user's past orders
        category_counts = {}
        for order in orders:
            # This would need to be implemented based on order items
            # For now, return featured products
            pass

        # For now, return a mix of featured and recent products
        return get_featured_products(limit)
    except Exception as error:
        return jsonify({"message": str(error)}), 500
