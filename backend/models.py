from backend import db
from datetime import datetime

class User(db.Model):
    """Modèle pour les utilisateurs (admin, client, seller)"""
    __tablename__ = 'users'
    
    id_user = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    pass_word = db.Column(db.String(100))
    rolee = db.Column(db.Enum("admin", "client", "seller", name='role_enum'))
    phone = db.Column(db.String(100))
    adress = db.Column(db.Text)
    createdAT = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    products = db.relationship('Product', backref='seller_user', foreign_keys='Product.id_seller', lazy=True)
    reviews = db.relationship('Review', backref='client_user', foreign_keys='Review.id_client', lazy=True)
    carts = db.relationship('Cart', backref='client_user', foreign_keys='Cart.id_client', lazy=True)
    orders = db.relationship('Order', backref='client_user', foreign_keys='Order.id_client', lazy=True)
    seller_profile = db.relationship('SellerProfile', backref='user', uselist=False, lazy=True)
    
    def to_dict(self):
        """Convertit le modèle en dictionnaire (sans le mot de passe)"""
        return {
            'id_user': self.id_user,
            'full_name': self.full_name,
            'email': self.email,
            'rolee': self.rolee,
            'phone': self.phone,
            'adress': self.adress,
            'createdAT': self.createdAT.isoformat() if self.createdAT else None
        }


class Category(db.Model):
    """Modèle pour les catégories"""
    __tablename__ = 'category'
    
    id_category = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String(100))
    category_description = db.Column(db.Text)
    image = db.Column(db.String(225))
    
    # Relations
    subcategories = db.relationship('SubCategory', backref='category', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id_category': self.id_category,
            'category_name': self.category_name,
            'category_description': self.category_description,
            'image': self.image
        }


class SubCategory(db.Model):
    """Modèle pour les sous-catégories"""
    __tablename__ = 'SubCategory'
    
    id_SubCategory = db.Column(db.Integer, primary_key=True, autoincrement=True)
    SubCategory_name = db.Column(db.String(100))
    id_category = db.Column(db.Integer, db.ForeignKey('category.id_category'), nullable=False)
    SubCategory_description = db.Column(db.Text)
    
    # Relations
    products = db.relationship('Product', backref='subcategory', lazy=True)
    
    def to_dict(self):
        return {
            'id_SubCategory': self.id_SubCategory,
            'SubCategory_name': self.SubCategory_name,
            'id_category': self.id_category,
            'SubCategory_description': self.SubCategory_description
        }


class Product(db.Model):
    """Modèle pour les produits"""
    __tablename__ = 'product'
    
    id_product = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String(100))
    brand = db.Column(db.String(100))
    product_description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 4))
    stock = db.Column(db.Integer)
    rating = db.Column(db.Float)
    id_seller = db.Column(db.Integer, db.ForeignKey('users.id_user'), nullable=False)
    id_SubCategory = db.Column(db.Integer, db.ForeignKey('SubCategory.id_SubCategory'), nullable=False)
    createdAtt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    images = db.relationship('ProductImage', backref='product', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='product', lazy=True, cascade='all, delete-orphan')
    cart_items = db.relationship('CartItem', backref='product', lazy=True)
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    
    def to_dict(self):
        return {
            'id_product': self.id_product,
            'product_name': self.product_name,
            'brand': self.brand,
            'product_description': self.product_description,
            'price': float(self.price) if self.price else None,
            'stock': self.stock,
            'rating': self.rating,
            'id_seller': self.id_seller,
            'id_SubCategory': self.id_SubCategory,
            'createdAtt': self.createdAtt.isoformat() if self.createdAtt else None,
            'updatedAt': self.updatedAt.isoformat() if self.updatedAt else None
        }


class ProductImage(db.Model):
    """Modèle pour les images des produits"""
    __tablename__ = 'product_image'
    
    id_product_image = db.Column(db.Integer, primary_key=True, autoincrement=True)
    imageURL = db.Column(db.String(225))
    id_product = db.Column(db.Integer, db.ForeignKey('product.id_product'), nullable=False)
    
    def to_dict(self):
        return {
            'id_product_image': self.id_product_image,
            'imageURL': self.imageURL,
            'id_product': self.id_product
        }


class Review(db.Model):
    """Modèle pour les avis"""
    __tablename__ = 'review'
    
    id_review = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rating_review = db.Column(db.Integer)
    commentt = db.Column(db.Text)
    id_product = db.Column(db.Integer, db.ForeignKey('product.id_product'), nullable=False)
    id_client = db.Column(db.Integer, db.ForeignKey('users.id_user'), nullable=False)
    review_createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id_review': self.id_review,
            'rating_review': self.rating_review,
            'commentt': self.commentt,
            'id_product': self.id_product,
            'id_client': self.id_client,
            'review_createdAt': self.review_createdAt.isoformat() if self.review_createdAt else None
        }


class Cart(db.Model):
    """Modèle pour les paniers"""
    __tablename__ = 'cart'
    
    id_cart = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_client = db.Column(db.Integer, db.ForeignKey('users.id_user'), nullable=False)
    cart_createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    items = db.relationship('CartItem', backref='cart', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id_cart': self.id_cart,
            'id_client': self.id_client,
            'cart_createdAt': self.cart_createdAt.isoformat() if self.cart_createdAt else None
        }


class CartItem(db.Model):
    """Modèle pour les articles du panier"""
    __tablename__ = 'cart_item'
    
    id_cart_item = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_cart = db.Column(db.Integer, db.ForeignKey('cart.id_cart'), nullable=False)
    id_product = db.Column(db.Integer, db.ForeignKey('product.id_product'), nullable=False)
    quantity = db.Column(db.Integer)
    
    def to_dict(self):
        product = self.product.to_dict() if self.product else None
        return {
            'id_cart_item': self.id_cart_item,
            'id_cart': self.id_cart,
            'id_product': self.id_product,
            'quantity': self.quantity,
            'product': product
        }


class Order(db.Model):
    """Modèle pour les commandes"""
    __tablename__ = 'orders'
    
    id_order = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_client = db.Column(db.Integer, db.ForeignKey('users.id_user'), nullable=False)
    total_amount = db.Column(db.Numeric(10, 4))
    payment_status = db.Column(db.Enum("pending", "paid", "failed", name='payment_status_enum'))
    order_status = db.Column(db.Enum("processing", "shipped", "delivered", "cancelled", name='order_status_enum'))
    order_createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    payment = db.relationship('Payment', backref='order', uselist=False, lazy=True)
    
    def to_dict(self):
        return {
            'id_order': self.id_order,
            'id_client': self.id_client,
            'total_amount': float(self.total_amount) if self.total_amount else None,
            'payment_status': self.payment_status,
            'order_status': self.order_status,
            'order_createdAt': self.order_createdAt.isoformat() if self.order_createdAt else None
        }


class OrderItem(db.Model):
    """Modèle pour les articles de commande"""
    __tablename__ = 'order_item'
    
    id_order_item = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_order = db.Column(db.Integer, db.ForeignKey('orders.id_order'), nullable=False)
    id_product = db.Column(db.Integer, db.ForeignKey('product.id_product'), nullable=False)
    order_item_quantity = db.Column(db.Integer)
    order_item_price = db.Column(db.Numeric(10, 4))
    
    def to_dict(self):
        product = self.product.to_dict() if self.product else None
        return {
            'id_order_item': self.id_order_item,
            'id_order': self.id_order,
            'id_product': self.id_product,
            'order_item_quantity': self.order_item_quantity,
            'order_item_price': float(self.order_item_price) if self.order_item_price else None,
            'product': product
        }


class Payment(db.Model):
    """Modèle pour les paiements"""
    __tablename__ = 'payment'
    
    id_payment = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_order = db.Column(db.Integer, db.ForeignKey('orders.id_order'), nullable=False)
    payment_amount = db.Column(db.Numeric(10, 4))
    method = db.Column(db.Enum("card", "cash_on_delivery", "flouci", name='payment_method_enum'))
    payment_status = db.Column(db.Enum("succes", "failed", "pending", name='payment_status_enum'))
    id_transaction = db.Column(db.Integer)
    
    def to_dict(self):
        return {
            'id_payment': self.id_payment,
            'id_order': self.id_order,
            'payment_amount': float(self.payment_amount) if self.payment_amount else None,
            'method': self.method,
            'payment_status': self.payment_status,
            'id_transaction': self.id_transaction
        }


class SellerProfile(db.Model):
    """Modèle pour les profils des vendeurs"""
    __tablename__ = 'seller_profile'
    
    id_seller_profile = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_user = db.Column(db.Integer, db.ForeignKey('users.id_user'), nullable=False, unique=True)
    shop_name = db.Column(db.String(100))
    shop_description = db.Column(db.Text)
    verification_status = db.Column(db.Enum("pending", "verified", "rejected", name='verification_status_enum'))
    
    def to_dict(self):
        return {
            'id_seller_profile': self.id_seller_profile,
            'id_user': self.id_user,
            'shop_name': self.shop_name,
            'shop_description': self.shop_description,
            'verification_status': self.verification_status
        }
