from flask import jsonify, request
import stripe
import os
from backend.database.dao import orders as orders_dao
from backend.database.dao import payments as payments_dao
from backend.controllers.serializers import payment_to_dict

# Stripe Configuration
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')
STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY', '')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

# Initialize Stripe
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY


def create_stripe_checkout_session(order_id, client_id, amount, currency='mad'):
    """Create a Stripe Checkout Session for an order."""
    try:
        # Verify order exists and belongs to client
        order = orders_dao.get_order(order_id)
        if not order:
            return jsonify({"message": "Order not found"}), 404
        
        if order["id_client"] != client_id:
            return jsonify({"message": "Unauthorized"}), 403

        # Check if payment already exists
        existing_payment = payments_dao.get_payment_by_order(order_id)
        if existing_payment:
            return jsonify({"message": "Payment already exists for this order"}), 400

        if not STRIPE_SECRET_KEY:
            return jsonify({"message": "Stripe not configured. Please set STRIPE_SECRET_KEY"}), 500

        # Validate currency - Stripe supports specific currencies (usd, eur, gbp, etc.)
        # MAD (Moroccan Dirham) is not supported, so we'll use USD as fallback
        supported_currencies = ['usd', 'eur', 'gbp', 'cad', 'aud', 'jpy', 'chf', 'nzd', 'sek', 'nok', 'dkk', 'pln', 'czk', 'huf', 'ron', 'bgn', 'hrk', 'rub', 'try', 'inr', 'brl', 'mxn', 'sgd', 'hkd', 'myr', 'thb', 'php', 'idr', 'krw', 'cny']
        if currency.lower() not in supported_currencies:
            # Default to USD if currency is not supported
            currency = 'usd'
            # Optionally, you could return an error instead:
            # return jsonify({"message": f"Currency '{currency}' is not supported by Stripe. Supported currencies: {', '.join(supported_currencies[:10])}..."}), 400

        # Convert amount to cents (Stripe uses smallest currency unit)
        amount_in_cents = int(float(amount) * 100)

        # Create Stripe Checkout Session
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': currency.lower(),
                        'product_data': {
                            'name': f'Order #{order_id}',
                            'description': f'Payment for order #{order_id}',
                        },
                        'unit_amount': amount_in_cents,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f'{FRONTEND_URL}/checkout/success?orderId={order_id}&session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url=f'{FRONTEND_URL}/checkout/payment?orderId={order_id}&method=stripe&canceled=true',
                metadata={
                    'order_id': str(order_id),
                    'client_id': str(client_id),
                },
                customer_email=None,  # Can be set if you have customer email
            )

            # Create payment record in database with pending status
            payment_id = payments_dao.create_payment(
                order_id=order_id,
                amount=amount,
                method="card",  # Stripe payments are card payments
                status="pending",
                transaction_id=checkout_session.id  # Store Stripe session ID
            )

            return jsonify({
                "message": "Stripe checkout session created successfully",
                "session_id": checkout_session.id,
                "payment_url": checkout_session.url,
                "payment_id": payment_id
            }), 201

        except stripe.error.StripeError as e:
            return jsonify({
                "message": "Stripe error",
                "error": str(e)
            }), 500

    except Exception as error:
        return jsonify({"message": str(error)}), 500


def verify_stripe_payment(session_id):
    """Verify Stripe payment status using session ID."""
    try:
        if not STRIPE_SECRET_KEY:
            return jsonify({"message": "Stripe not configured"}), 500

        # Retrieve the Stripe Checkout Session
        session = stripe.checkout.Session.retrieve(session_id)

        # Extract order_id from metadata
        order_id = session.metadata.get('order_id') if session.metadata else None

        if not order_id:
            return jsonify({
                "message": "Order ID not found in session metadata"
            }), 400

        # Check payment status
        payment_status = session.payment_status  # 'paid', 'unpaid', 'no_payment_required'

        return jsonify({
            "session_id": session_id,
            "payment_status": payment_status,
            "status": "paid" if payment_status == "paid" else "pending",
            "order_id": order_id,
            "verified": payment_status == "paid"
        }), 200

    except stripe.error.StripeError as e:
        return jsonify({
            "message": "Stripe verification error",
            "error": str(e)
        }), 500
    except Exception as error:
        return jsonify({"message": str(error)}), 500


def webhook_stripe_payment():
    """Handle Stripe webhook for payment status updates."""
    try:
        payload = request.get_data(as_text=True)
        sig_header = request.headers.get('Stripe-Signature')
        webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET', '')

        if not webhook_secret:
            # If no webhook secret, try to process without verification (not recommended for production)
            event = stripe.Event.construct_from(
                request.get_json(),
                stripe.api_key
            )
        else:
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, webhook_secret
                )
            except ValueError as e:
                return jsonify({"message": "Invalid payload"}), 400
            except stripe.error.SignatureVerificationError as e:
                return jsonify({"message": "Invalid signature"}), 400

        # Handle the event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            order_id = session['metadata'].get('order_id') if session.get('metadata') else None

            if order_id:
                # Find payment by transaction_id (Stripe session ID)
                payment = payments_dao.get_payment_by_order(int(order_id))
                if payment and payment.get('id_transaction') == session['id']:
                    # Update payment status
                    if session['payment_status'] == 'paid':
                        payments_dao.update_payment_status(payment["id_payment"], "succes")
                        orders_dao.update_order_status(int(order_id), {"payment_status": "paid"})
                    else:
                        payments_dao.update_payment_status(payment["id_payment"], "pending")

        elif event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            # Handle payment_intent if needed

        return jsonify({"message": "Webhook processed successfully"}), 200

    except Exception as error:
        return jsonify({"message": str(error)}), 500


def get_stripe_config():
    """Get Stripe publishable key for frontend."""
    return jsonify({
        "publishable_key": STRIPE_PUBLISHABLE_KEY,
        "configured": bool(STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY)
    }), 200
