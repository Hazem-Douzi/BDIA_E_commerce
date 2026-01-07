const { Client} = require("../database-models")

module.exports.getAll = async (req, res) => {
  try {
    const response = await Client.findAll();
    res.status(200).send(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
};
module.exports.deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedClient = await Client.destroy({ where: { id } });
    if (!deletedClient) {
      return res.status(404).send("client not found");
    }
    res.status(200).send("client deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
module.exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    
    if (!client) {
      return res.status(404).send("client not found");
    }
    
    // Remove password from response for security
    const { password, ...clientData } = client.toJSON();
    res.status(200).json(clientData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const bcrypt = require('bcryptjs');

module.exports.UpdateClient = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    console.log(updates)

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

     await Client.update(updates, { where: { id } });


    return res.status(200).send("client updated successfully");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};