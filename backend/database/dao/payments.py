from backend.database.connection import get_db_manager


def create_payment(order_id, amount, method, status, transaction_id):
    query = (
        "INSERT INTO payment (id_order, payment_amount, method, payment_status, id_transaction) "
        "VALUES (%s, %s, %s, %s, %s)"
    )
    return get_db_manager().execute_query(
        query, (order_id, amount, method, status, transaction_id), commit=True
    )


def get_payment(payment_id):
    query = (
        "SELECT id_payment, id_order, payment_amount, method, payment_status, id_transaction "
        "FROM payment WHERE id_payment = %s"
    )
    return get_db_manager().execute_query(query, (payment_id,), fetch_one=True)


def get_payment_by_order(order_id):
    query = (
        "SELECT id_payment, id_order, payment_amount, method, payment_status, id_transaction "
        "FROM payment WHERE id_order = %s"
    )
    return get_db_manager().execute_query(query, (order_id,), fetch_one=True)


def update_payment_status(payment_id, status):
    query = "UPDATE payment SET payment_status = %s WHERE id_payment = %s"
    return get_db_manager().execute_query(query, (status, payment_id), commit=True)

