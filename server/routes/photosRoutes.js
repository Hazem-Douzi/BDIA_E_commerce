const express = require('express');
const router = express.Router();
const { upload, addPhoto,getImg } = require('../controllers/photo_controller');

// Upload endpoint (accepts up to 5 images for a product)
router.post('/upload/:productId', upload.array("images", 5), addPhoto);
router.get("/:id",getImg)

module.exports = router;
