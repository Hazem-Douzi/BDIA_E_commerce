const { Product} = require("../database-models")

module.exports.getAllProducts = async (req, res) => {
  try {
    const {sellerId}=req.params
    const products = await Product.findAll({ where: { sellerId: sellerId } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get all products
module.exports.getAll = async (req, res) => {
  try {
    const response = await Product.findAll();
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

// Add a new product
module.exports.addProduct = async (req, res) => {
  try {
    const comingProd = req.body;
    console.log("comingProd",comingProd)
    const product = await Product.create( comingProd)
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete a product
module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await Product.destroy({ where: { id } });
    if (!deletedProduct) {
      return res.status(404).send("product not found");
    }
    res.status(200).send("product deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Update a product
module.exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const request = req.body;
    const updatedProduct = await Product.update(request, { where: { id } });
    if (!updatedProduct || updatedProduct[0] === 0) {
      return res.status(404).send("product not found");
    }
    res.status(200).send("product updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

