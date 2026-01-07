import os
import time
from werkzeug.utils import secure_filename
from flask import jsonify, request, current_app
from backend import db
from backend.models import ProductImage

def allowed_file(filename):
    """Vérifie si le fichier a une extension autorisée"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


def add_photo(product_id, files):
    """Ajoute des photos pour un produit"""
    try:
        if not files:
            return jsonify({'error': 'No files provided'}), 400
        
        photo_entries = []
        for file in files:
            if file and allowed_file(file.filename):
                # Générer un nom de fichier unique
                timestamp = int(time.time() * 1000)
                ext = file.filename.rsplit('.', 1)[1].lower()
                filename = f"{timestamp}.{ext}"
                
                # Sauvegarder le fichier
                file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                
                # Créer l'entrée photo
                photo = ProductImage(
                    id_product=product_id,
                    imageURL=f'/uploads/{filename}'
                )
                db.session.add(photo)
                photo_entries.append(photo.to_dict())
        
        db.session.commit()
        return jsonify({'message': 'Images uploaded successfully', 'photoEntries': photo_entries}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({'error': 'Upload failed', 'details': str(error)}), 500


def get_images_by_product(product_id):
    """Récupère toutes les images d'un produit"""
    try:
        photos = ProductImage.query.filter_by(id_product=product_id).all()
        return jsonify([photo.to_dict() for photo in photos]), 200
    except Exception as error:
        return jsonify({'message': str(error)}), 404
