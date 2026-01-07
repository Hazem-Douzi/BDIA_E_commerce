from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from backend.config import Config

# Initialisation des extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    """Application factory pour Flask"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialisation des extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS']
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
        review_routes, payment_routes, category_routes
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
    
    # Route pour servir les fichiers uploads
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        from flask import send_from_directory
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
    return app
