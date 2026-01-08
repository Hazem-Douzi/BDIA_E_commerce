from backend.database.dao.utils import to_iso, to_float


def user_to_dict(row):
    if not row:
        return None
    return {
        "id_user": row.get("id_user"),
        "full_name": row.get("full_name"),
        "email": row.get("email"),
        "rolee": row.get("rolee"),
        "phone": row.get("phone"),
        "adress": row.get("adress"),
        "createdAT": to_iso(row.get("createdAT")),
    }


def category_to_dict(row):
    if not row:
        return None
    return {
        "id_category": row.get("id_category"),
        "category_name": row.get("category_name"),
        "category_description": row.get("category_description"),
        "image": row.get("image"),
    }


def subcategory_to_dict(row):
    if not row:
        return None
    return {
        "id_SubCategory": row.get("id_SubCategory"),
        "SubCategory_name": row.get("SubCategory_name"),
        "id_category": row.get("id_category"),
        "SubCategory_description": row.get("SubCategory_description"),
    }


def product_to_dict(row):
    if not row:
        return None
    return {
        "id_product": row.get("id_product"),
        "product_name": row.get("product_name"),
        "brand": row.get("brand"),
        "product_description": row.get("product_description"),
        "price": to_float(row.get("price")),
        "stock": row.get("stock"),
        "rating": row.get("rating"),
        "id_seller": row.get("id_seller"),
        "id_category": row.get("id_category"),
        "id_SubCategory": row.get("id_SubCategory"),
        "createdAtt": to_iso(row.get("createdAtt")),
        "updatedAt": to_iso(row.get("updatedAt")),
    }


def product_image_to_dict(row):
    if not row:
        return None
    return {
        "id_product_image": row.get("id_product_image"),
        "imageURL": row.get("imageURL"),
        "id_product": row.get("id_product"),
    }


def review_to_dict(row):
    if not row:
        return None
    return {
        "id_review": row.get("id_review"),
        "rating_review": row.get("rating_review"),
        "commentt": row.get("commentt"),
        "id_product": row.get("id_product"),
        "id_client": row.get("id_client"),
        "review_createdAt": to_iso(row.get("review_createdAt")),
    }


def cart_to_dict(row):
    if not row:
        return None
    return {
        "id_cart": row.get("id_cart"),
        "id_client": row.get("id_client"),
        "cart_createdAt": to_iso(row.get("cart_createdAt")),
    }


def cart_item_to_dict(row):
    if not row:
        return None
    return {
        "id_cart_item": row.get("id_cart_item"),
        "id_cart": row.get("id_cart"),
        "id_product": row.get("id_product"),
        "quantity": row.get("quantity"),
    }


def order_to_dict(row):
    if not row:
        return None
    return {
        "id_order": row.get("id_order"),
        "id_client": row.get("id_client"),
        "total_amount": to_float(row.get("total_amount")),
        "payment_status": row.get("payment_status"),
        "order_status": row.get("order_status"),
        "order_createdAt": to_iso(row.get("order_createdAt")),
    }


def payment_card_to_dict(row):
    if not row:
        return None
    return {
        "id_payment_card": row.get("id_payment_card"),
        "id_client": row.get("id_client"),
        "card_number": row.get("card_number"),
        "card_holder_name": row.get("card_holder_name"),
        "expiry_date": row.get("expiry_date"),
        "cvv": row.get("cvv"),
        "is_default": bool(row.get("is_default")),
        "created_at": to_iso(row.get("created_at")),
    }


def order_item_to_dict(row):
    if not row:
        return None
    return {
        "id_order_item": row.get("id_order_item"),
        "id_order": row.get("id_order"),
        "id_product": row.get("id_product"),
        "order_item_quantity": row.get("order_item_quantity"),
        "order_item_price": to_float(row.get("order_item_price")),
    }


def payment_to_dict(row):
    if not row:
        return None
    return {
        "id_payment": row.get("id_payment"),
        "id_order": row.get("id_order"),
        "payment_amount": to_float(row.get("payment_amount")),
        "method": row.get("method"),
        "payment_status": row.get("payment_status"),
        "id_transaction": row.get("id_transaction"),
    }


def seller_profile_to_dict(row):
    if not row:
        return None
    return {
        "id_seller_profile": row.get("id_seller_profile"),
        "id_user": row.get("id_user"),
        "shop_name": row.get("shop_name"),
        "shop_description": row.get("shop_description"),
        "verification_status": row.get("verification_status"),
    }
