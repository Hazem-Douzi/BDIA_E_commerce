from flask import Flask
from flask_cors import CORS
from backend.config import Config
from backend.database.connection import get_db_manager

def create_app(config_class=Config):
    """Application factory pour Flask"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Configure CORS to handle preflight requests properly
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "supports_credentials": True,
            "expose_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Configuration du dossier uploads
    import os
    upload_folder = app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    # Enregistrement des routes
    from backend.routes import (
        auth_routes, product_routes, seller_routes, client_routes, 
        photo_routes, admin_routes, cart_routes, order_routes, 
        review_routes, payment_routes, category_routes, wishlist_routes
    )
    
    app.register_blueprint(auth_routes.bp, url_prefix='/api/auth')
    app.register_blueprint(product_routes.bp, url_prefix='/api/product')
    app.register_blueprint(seller_routes.bp, url_prefix='/api/seller')
    app.register_blueprint(client_routes.bp, url_prefix='/api/client')
    app.register_blueprint(photo_routes.bp, url_prefix='/api/photos')
    app.register_blueprint(admin_routes.bp, url_prefix='/api/admin')
    app.register_blueprint(cart_routes.bp, url_prefix='/api/cart')
    app.register_blueprint(order_routes.bp, url_prefix='/api/order')
    app.register_blueprint(review_routes.bp, url_prefix='/api/review')
    app.register_blueprint(payment_routes.bp, url_prefix='/api/payment')
    app.register_blueprint(category_routes.bp, url_prefix='/api/category')
    app.register_blueprint(wishlist_routes.bp, url_prefix='/api/wishlist')
    
    # Add direct route for /api/category (without trailing slash) to prevent CORS redirect issues
    @app.route('/api/category', methods=['GET', 'OPTIONS'])
    def get_categories_direct():
        """Direct route handler for /api/category to avoid redirect during CORS preflight"""
        from flask import request
        if request.method == 'OPTIONS':
            # CORS will handle this, but we return early to avoid any processing
            return '', 200
        from backend.controllers import admin_controller
        return admin_controller.get_all_categories()
    
    # Add direct route for /api/order (without trailing slash) to prevent CORS redirect issues
    @app.route('/api/order', methods=['POST', 'OPTIONS'])
    def create_order_direct():
        """Direct route handler for /api/order to avoid redirect during CORS preflight"""
        from flask import request, jsonify, current_app
        import jwt
        
        if request.method == 'OPTIONS':
            return '', 200
        
        # Verify token manually
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Access denied'}), 401
        
        try:
            token = auth_header.split(' ')[1]  # Format: "Bearer <token>"
        except IndexError:
            return jsonify({'message': 'Token missing'}), 401
        
        try:
            decoded = jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=['HS256'])
            user = decoded
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        if user.get('role') != 'client':
            return jsonify({'message': 'Unauthorized: Only clients can create orders'}), 403
        
        from backend.controllers import order_controller
        data = request.get_json() or {}
        client_id = user.get('id')
        return order_controller.create_order(client_id, data)

    @app.teardown_appcontext
    def close_db_connection(exception=None):
        del exception
        get_db_manager().close_connection()
    
    # Route pour servir les fichiers uploads
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        from flask import send_from_directory
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
    return app
