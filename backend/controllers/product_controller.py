from flask import jsonify, current_app
import os
from backend.database.dao import products as products_dao
from backend.database.dao import product_images as images_dao
from backend.database.dao import categories as categories_dao
from backend.database.dao import subcategories as subcategories_dao
from backend.database.dao import users as users_dao
from backend.database.dao import seller_profiles as seller_profiles_dao
from backend.controllers.serializers import (
    product_to_dict,
    product_image_to_dict,
    category_to_dict,
    subcategory_to_dict,
    user_to_dict,
    seller_profile_to_dict,
)


def _build_product_details(product):
    product_dict = product_to_dict(product)
    images = images_dao.list_images_by_product(product["id_product"])
    product_dict["images"] = [product_image_to_dict(img) for img in images]

    if product.get("id_category"):
        category = categories_dao.get_category(product["id_category"])
        if category:
            product_dict["category"] = category_to_dict(category)

    if product.get("id_SubCategory"):
        subcategory = subcategories_dao.get_subcategory(product["id_SubCategory"])
        if subcategory:
            product_dict["subcategory"] = subcategory_to_dict(subcategory)

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
            if product.get("id_category"):
                category = categories_dao.get_category(product["id_category"])
                if category:
                    product_dict["category"] = category_to_dict(category)
            result.append(product_dict)
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def add_product(data, seller_id):
    """Add a new product."""
    try:
        data = dict(data)
        if not data.get("id_category") and data.get("category_name"):
            category = categories_dao.get_category_by_name(data["category_name"])
            if not category:
                return jsonify({"message": "Category not found"}), 400
            data["id_category"] = category["id_category"]
        data["id_seller"] = seller_id
        product_id = products_dao.create_product(data)

        images = data.get("images", [])
        for image_url in images:
            if image_url:
                images_dao.create_image(product_id, image_url)

        product = products_dao.get_product(product_id)
        product_dict = product_to_dict(product)
        product_dict["images"] = [
            product_image_to_dict(img)
            for img in images_dao.list_images_by_product(product_id)
        ]
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
                image_path = os.path.join(
                    current_app.config["UPLOAD_FOLDER"],
                    os.path.basename(image["imageURL"]),
                )
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
            "id_category",
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
                    image_path = os.path.join(
                        current_app.config["UPLOAD_FOLDER"],
                        os.path.basename(image["imageURL"]),
                    )
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
        product_dict["images"] = [
            product_image_to_dict(img)
            for img in images_dao.list_images_by_product(product_id)
        ]
        return jsonify({"message": "Product updated successfully", "product": product_dict}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 400


def search_products(query_params):
    """
    Recherche complète de produits avec filtres SQL.
    Tous les filtres sont appliqués côté backend via requêtes SQL pures MySQL.
    Pas de filtrage frontend - tout se fait dans la base de données.
    """
    try:
        conditions = []
        params = []

        # 1. Recherche par nom, marque ou description (recherche textuelle)
        search_query = query_params.get("search") or query_params.get("name")
        if search_query:
            # Recherche dans product_name, brand, et product_description
            conditions.append("(product_name LIKE %s OR brand LIKE %s OR product_description LIKE %s)")
            search_pattern = f"%{search_query}%"
            params.extend([search_pattern, search_pattern, search_pattern])

        # 2. Filtre par marque(s) - supporte plusieurs marques
        brands = []
        brand_param = query_params.get("brand") or query_params.get("brands")
        if brand_param and not search_query:  # Si search_query existe, on ignore brand séparé
            # Supporte plusieurs marques séparées par des virgules
            if isinstance(brand_param, str) and ',' in brand_param:
                brands = [b.strip() for b in brand_param.split(',')]
            elif isinstance(brand_param, list):
                brands = brand_param
            else:
                brands = [brand_param]
            
            if brands:
                placeholders = ",".join(["%s"] * len(brands))
                conditions.append(f"brand IN ({placeholders})")
                params.extend([f"%{b}%" for b in brands])

        # 3. Filtre par catégorie(s) - supporte plusieurs catégories
        category_ids = []
        category_param = query_params.get("category_id") or query_params.get("category_ids")
        if category_param:
            # Supporte plusieurs IDs séparés par des virgules
            if isinstance(category_param, str) and ',' in category_param:
                category_ids = [int(cid.strip()) for cid in category_param.split(',')]
            elif isinstance(category_param, list):
                category_ids = [int(cid) for cid in category_param]
            else:
                category_ids = [int(category_param)]
        
        # Si pas d'ID mais un nom de catégorie
        if not category_ids:
            category = query_params.get("category")
            if category:
                matched = categories_dao.get_category_by_name(category)
                if matched:
                    category_ids = [matched["id_category"]]
        
        if category_ids:
            placeholders = ",".join(["%s"] * len(category_ids))
            conditions.append(f"id_category IN ({placeholders})")
            params.extend(category_ids)

        # 4. Filtre par sous-catégorie(s)
        subcategory_ids = []
        subcategory_param = query_params.get("subcategory_id") or query_params.get("subcategory_ids")
        if subcategory_param:
            # Supporte plusieurs IDs séparés par des virgules
            if isinstance(subcategory_param, str) and ',' in subcategory_param:
                subcategory_ids = [int(sid.strip()) for sid in subcategory_param.split(',')]
            elif isinstance(subcategory_param, list):
                subcategory_ids = [int(sid) for sid in subcategory_param]
            else:
                subcategory_ids = [int(subcategory_param)]
        
        if subcategory_ids:
            placeholders = ",".join(["%s"] * len(subcategory_ids))
            conditions.append(f"id_SubCategory IN ({placeholders})")
            params.extend(subcategory_ids)

        # 5. Filtre par prix (min et max)
        min_price = query_params.get("minPrice") or query_params.get("min_price")
        max_price = query_params.get("maxPrice") or query_params.get("max_price")
        if min_price and max_price:
            conditions.append("price BETWEEN %s AND %s")
            params.extend([float(min_price), float(max_price)])
        elif min_price:
            conditions.append("price >= %s")
            params.append(float(min_price))
        elif max_price:
            conditions.append("price <= %s")
            params.append(float(max_price))

        # 6. Filtre par disponibilité (stock)
        stock = query_params.get("stock") or query_params.get("available")
        if stock:
            if stock.lower() == "available" or stock.lower() == "true":
                conditions.append("stock > 0")
            elif stock.lower() == "out" or stock.lower() == "false" or stock.lower() == "unavailable":
                conditions.append("stock = 0")

        # 7. Filtre par vendeur (seller_id)
        seller_id = query_params.get("seller_id") or query_params.get("sellerId")
        if seller_id:
            try:
                seller_id_int = int(seller_id)
                conditions.append("id_seller = %s")
                params.append(seller_id_int)
            except (ValueError, TypeError):
                pass  # Ignore invalid seller_id

        # 8. Filtre par note minimale (rating)
        min_rating = query_params.get("minRating") or query_params.get("rating")
        if min_rating:
            conditions.append("rating >= %s")
            params.append(float(min_rating))

        # 8. Tri (ORDER BY) - supporte plusieurs options
        sort_by = query_params.get("sortBy") or query_params.get("sort")
        order_by = None
        if sort_by:
            sort_mapping = {
                "price_asc": "price ASC",
                "price_desc": "price DESC",
                "name_asc": "product_name ASC",
                "name_desc": "product_name DESC",
                "rating_desc": "rating DESC",
                "rating_asc": "rating ASC",
                "newest": "createdAtt DESC",
                "oldest": "createdAtt ASC"
            }
            order_by = sort_mapping.get(sort_by, "createdAtt DESC")
        else:
            order_by = "createdAtt DESC"

        # 9. Pagination
        page = int(query_params.get("page", 1))
        per_page = int(query_params.get("perPage") or query_params.get("limit", 24))
        offset = (page - 1) * per_page

        # Compter le total pour la pagination
        total = products_dao.count_products(conditions, params)

        # Récupérer les produits avec pagination
        products = products_dao.search_products(conditions, params, order_by=order_by, limit=per_page, offset=offset)
        
        # Construire la réponse avec les informations complètes
        result = []
        for product in products:
            product_dict = product_to_dict(product)
            
            # Ajouter les images
            images = images_dao.list_images_by_product(product["id_product"])
            product_dict["images"] = [product_image_to_dict(img) for img in images]
            
            # Ajouter la catégorie si disponible
            if product.get("id_category"):
                category = categories_dao.get_category(product["id_category"])
                if category:
                    product_dict["category"] = category_to_dict(category)
            
            # Ajouter la sous-catégorie si disponible
            if product.get("id_SubCategory"):
                subcategory = subcategories_dao.get_subcategory(product["id_SubCategory"])
                if subcategory:
                    product_dict["subcategory"] = subcategory_to_dict(subcategory)
            
            result.append(product_dict)

        # Retourner avec métadonnées de pagination
        total_pages = (total + per_page - 1) // per_page if total > 0 else 0
        
        return jsonify({
            "products": result,
            "pagination": {
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1
            }
        }), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_top_sellers(limit=5):
    """Get top sellers by product count."""
    try:
        top_sellers_data = products_dao.get_top_sellers_by_product_count(limit)
        result = []
        
        for seller_data in top_sellers_data:
            seller_id = seller_data["id_seller"]
            product_count = seller_data["product_count"]
            
            # Get seller user info
            seller = users_dao.get_user_by_id(seller_id)
            if not seller or seller["rolee"] != "seller":
                continue
                
            seller_dict = user_to_dict(seller)
            
            # Get seller profile (shop name, etc.)
            profile = seller_profiles_dao.get_profile_by_user_id(seller_id)
            if profile:
                seller_dict["seller_profile"] = seller_profile_to_dict(profile)
            
            # Get first product image as shop image
            products = products_dao.list_products_by_seller(seller_id)
            shop_image = None
            if products and len(products) > 0:
                first_product_images = images_dao.list_images_by_product(products[0]["id_product"])
                if first_product_images and len(first_product_images) > 0:
                    shop_image = first_product_images[0]["imageURL"]
            
            seller_dict["product_count"] = product_count
            seller_dict["shop_image"] = shop_image
            result.append(seller_dict)
            
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500