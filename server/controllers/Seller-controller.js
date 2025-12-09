const { Seller} = require("../database-models")

module.exports.getAll = async (req, res) => {
  try {
    const response = await Seller.findAll();
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
};
module.exports.deleteSeller = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedSeller = await Seller.destroy({ where: { id } });
    if (!deletedSeller) {
      return res.status(404).send("seller not found");
    }
    res.status(200).send("seller deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
module.exports.getSellerById = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findByPk(id);
    
    if (!seller) {
      return res.status(404).send("Seller not found");
    }
    
    // Remove password from response for security
    const { password, ...sellerData } = seller.toJSON();
    res.status(200).json(sellerData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const bcrypt = require('bcryptjs');

module.exports.UpdateSeller = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

     await Seller.update(updates, { where: { id } });


    return res.status(200).send("seller updated successfully");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
