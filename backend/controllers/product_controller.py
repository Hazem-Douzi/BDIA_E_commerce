from flask import jsonify, current_app
import os
from backend.database.dao import products as products_dao
from backend.database.dao import product_images as images_dao
from backend.database.dao import subcategories as subcategories_dao
from backend.database.dao import categories as categories_dao
from backend.database.dao import users as users_dao
from backend.database.dao import seller_profiles as seller_profiles_dao
from backend.controllers.serializers import (
    product_to_dict,
    product_image_to_dict,
    subcategory_to_dict,
    category_to_dict,
    user_to_dict,
    seller_profile_to_dict,
)


def _build_product_details(product):
    product_dict = product_to_dict(product)
    images = images_dao.list_images_by_product(product["id_product"])
    product_dict["images"] = [product_image_to_dict(img) for img in images]

    subcategory = subcategories_dao.get_subcategory(product["id_SubCategory"])
    if subcategory:
        product_dict["subcategory"] = subcategory_to_dict(subcategory)
        category = categories_dao.get_category(subcategory["id_category"])
        if category:
            product_dict["category"] = category_to_dict(category)

    seller = users_dao.get_user_by_id(product["id_seller"])
    if seller:
        seller_dict = user_to_dict(seller)
        profile = seller_profiles_dao.get_profile_by_user_id(product["id_seller"])
        if profile:
            seller_dict["seller_profile"] = seller_profile_to_dict(profile)
        product_dict["seller"] = seller_dict

    return product_dict


def get_all_products():
    """Get all products."""
    try:
        products = products_dao.list_products()
        result = [_build_product_details(product) for product in products]
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_product_by_id(product_id):
    """Get a product by ID."""
    try:
        product = products_dao.get_product(product_id)
        if not product:
            return jsonify({"message": "Product not found"}), 404
        return jsonify(_build_product_details(product)), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_all_products_by_seller(seller_id):
    """Get all products for a seller."""
    try:
        products = products_dao.list_products_by_seller(seller_id)
        result = []
        for product in products:
            product_dict = product_to_dict(product)
            images = images_dao.list_images_by_product(product["id_product"])
            product_dict["images"] = [product_image_to_dict(img) for img in images]
            subcategory = subcategories_dao.get_subcategory(product["id_SubCategory"])
            if subcategory:
                product_dict["subcategory"] = subcategory_to_dict(subcategory)
            result.append(product_dict)
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def add_product(data, seller_id):
    """Add a new product."""
    try:
        data = dict(data)
        data["id_seller"] = seller_id
        product_id = products_dao.create_product(data)

        images = data.get("images", [])
        for image_url in images:
            if image_url:
                images_dao.create_image(product_id, image_url)

        product = products_dao.get_product(product_id)
        product_dict = product_to_dict(product)
        product_dict["images"] = [product_image_to_dict(img) for img in images_dao.list_images_by_product(product_id)]
        return jsonify({"message": "Product added successfully", "product": product_dict}), 201
    except Exception as error:
        return jsonify({"message": str(error)}), 400


def delete_product(product_id, seller_id=None):
    """Delete a product."""
    try:
        product = products_dao.get_product(product_id)
        if not product:
            return jsonify({"message": "Product not found"}), 404

        if seller_id and product["id_seller"] != seller_id:
            return jsonify({"message": "Unauthorized"}), 403

        images = images_dao.list_images_by_product(product_id)
        for image in images:
            if image["imageURL"]:
                image_path = os.path.join(current_app.config["UPLOAD_FOLDER"], os.path.basename(image["imageURL"]))
                if os.path.exists(image_path):
                    try:
                        os.remove(image_path)
                    except Exception:
                        pass

        images_dao.delete_images_by_product(product_id)
        products_dao.delete_product(product_id)
        return jsonify({"message": "Product deleted successfully"}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 400


def update_product(product_id, data, seller_id=None):
    """Update a product."""
    try:
        product = products_dao.get_product(product_id)
        if not product:
            return jsonify({"message": "Product not found"}), 404

        if seller_id and product["id_seller"] != seller_id:
            return jsonify({"message": "Unauthorized"}), 403

        update_fields = {}
        for key in [
            "product_name",
            "brand",
            "product_description",
            "price",
            "stock",
            "rating",
            "id_SubCategory",
        ]:
            if key in data:
                update_fields[key] = data[key]

        if update_fields:
            products_dao.update_product(product_id, update_fields)

        if "images" in data:
            existing_images = images_dao.list_images_by_product(product_id)
            for image in existing_images:
                if image["imageURL"]:
                    image_path = os.path.join(current_app.config["UPLOAD_FOLDER"], os.path.basename(image["imageURL"]))
                    if os.path.exists(image_path):
                        try:
                            os.remove(image_path)
                        except Exception:
                            pass
            images_dao.delete_images_by_product(product_id)
            for image_url in data["images"]:
                if image_url:
                    images_dao.create_image(product_id, image_url)

        product = products_dao.get_product(product_id)
        product_dict = product_to_dict(product)
        product_dict["images"] = [product_image_to_dict(img) for img in images_dao.list_images_by_product(product_id)]
        return jsonify({"message": "Product updated successfully", "product": product_dict}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 400


def search_products(query_params):
    """Search products."""
    try:
        conditions = []
        params = []

        name = query_params.get("name")
        if name:
            conditions.append("product_name LIKE %s")
            params.append(f"%{name}%")

        brand = query_params.get("brand")
        if brand:
            conditions.append("brand LIKE %s")
            params.append(f"%{brand}%")

        category = query_params.get("category")
        if category:
            subcategories = subcategories_dao.list_subcategories()
            matching_ids = [
                sub["id_SubCategory"]
                for sub in subcategories
                if category.lower() in sub["SubCategory_name"].lower()
            ]
            if not matching_ids:
                return jsonify([]), 200
            placeholders = ", ".join(["%s"] * len(matching_ids))
            conditions.append(f"id_SubCategory IN ({placeholders})")
            params.extend(matching_ids)

        min_price = query_params.get("minPrice")
        max_price = query_params.get("maxPrice")
        if min_price and max_price:
            conditions.append("price BETWEEN %s AND %s")
            params.extend([float(min_price), float(max_price)])
        elif min_price:
            conditions.append("price >= %s")
            params.append(float(min_price))
        elif max_price:
            conditions.append("price <= %s")
            params.append(float(max_price))

        subcategory_id = query_params.get("subcategory")
        if subcategory_id:
            conditions.append("id_SubCategory = %s")
            params.append(int(subcategory_id))

        stock = query_params.get("stock")
        if stock:
            if stock.lower() == "available":
                conditions.append("stock > 0")
            elif stock.lower() == "out":
                conditions.append("stock = 0")

        products = products_dao.search_products(conditions, params)
        result = []
        for product in products:
            product_dict = product_to_dict(product)
            images = images_dao.list_images_by_product(product["id_product"])
            product_dict["images"] = [product_image_to_dict(img) for img in images]
            subcategory = subcategories_dao.get_subcategory(product["id_SubCategory"])
            if subcategory:
                product_dict["subcategory"] = subcategory_to_dict(subcategory)
            result.append(product_dict)

        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500
