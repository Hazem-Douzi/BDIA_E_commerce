import os
import time
from flask import jsonify, current_app
from backend.database.dao import product_images as images_dao
from backend.controllers.serializers import product_image_to_dict


def allowed_file(filename):
    """Check allowed file extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in current_app.config["ALLOWED_EXTENSIONS"]


def add_photo(product_id, files):
    """Add photos for a product."""
    try:
        if not files:
            return jsonify({"error": "No files provided"}), 400

        photo_entries = []
        for file in files:
            if file and allowed_file(file.filename):
                timestamp = int(time.time() * 1000)
                ext = file.filename.rsplit(".", 1)[1].lower()
                filename = f"{timestamp}.{ext}"
                file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
                file.save(file_path)

                image_id = images_dao.create_image(product_id, f"/uploads/{filename}")
                photo_entries.append(product_image_to_dict({
                    "id_product_image": image_id,
                    "imageURL": f"/uploads/{filename}",
                    "id_product": product_id,
                }))

        return jsonify({"message": "Images uploaded successfully", "photoEntries": photo_entries}), 200
    except Exception as error:
        return jsonify({"error": "Upload failed", "details": str(error)}), 500


def get_images_by_product(product_id):
    """Get all images for a product."""
    try:
        photos = images_dao.list_images_by_product(product_id)
        return jsonify([product_image_to_dict(photo) for photo in photos]), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 404
