const { Photo} = require("../database-models")
const multer = require('multer');
const path = require('path');
let fileName = '';

// Configure Multer storage
const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure the 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    fileName = Date.now() + '.' + file.mimetype.split("/")[1];
    cb(null, fileName); // Corrected from 'redirect' to 'cb'
  }
});

// Create Multer upload middleware
const upload = multer({ storage: myStorage });

// Controller function (must be used inside a route, not as export with route path)
const addPhoto = async (req, res) => {
  const { productId } = req.params;
  const files = req.files;

  try {
    const photoEntries = files.map((file) => ({
      productId,
      url: `/uploads/${file.filename}` // Adjust based on your frontend needs
    }));

    await Photo.bulkCreate(photoEntries); // Ensure photoModel is imported
    res.status(200).json({ message: "Images uploaded successfully", photoEntries });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};
const getImg= async (req, res) => {
  try {
    const Id=req.params.id
    console.log("")
    const response = await Photo.findAll({ where: { productId: Id } });
    res.status(200).send(response);
  } catch (error) {
    // res.status(404).send(error.message);
    throw error
  }
};


module.exports = {
  upload,
  addPhoto,getImg
};

