
const { Product,Seller} = require("../database-models")
const { Op } = require("sequelize");

module.exports.searchProduct = async (req, res) => {
  const {name, brand, state, category,minPrice, maxPrice, available,date,/* fullName, phoneNumber,address*/} = req.query
  console.log("filter", req.query)
  try {
    const searchTerm = {}
    // const fitlerSeller = {}

    if (name) {

      searchTerm.name = { [Op.like]: `%${name}%` }
    }

    if (brand) {
      searchTerm.brand = { [Op.like]: `%${brand}%` }
    }

    if (state) {
      searchTerm.state = state
    }

    if (category) {
      searchTerm.category = { [Op.like]: `%${category}%` }
    }

    if (minPrice && maxPrice) {
      searchTerm.price = {
        [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
      }
    } else if (minPrice) {
      searchTerm.price = { [Op.gte]: parseFloat(minPrice) }
    } else if (maxPrice) {
      searchTerm.price = { [Op.lte]: parseFloat(maxPrice) }
    }

    if (typeof available !== "undefined") {
       searchTerm.available = available === "true";
     }


    if (date) {
      searchTerm.date = { [Op.like]: `%${date}%` }
    }

    // if (fullName) {
    //   fitlerSeller.fullName = { [Op.like]: `%${fullName}%` }
    // }

    // if (phoneNumber) {
    //   fitlerSeller.phoneNumber =  phoneNumber 
    // }

    //  if (address) {
    //   fitlerSeller.address = { [Op.like]: `%${address}%` }
    // }

console.log("searchTerm",searchTerm)
    const products = await Product.findAll({
      where: searchTerm,
      // include: [{
      //   model: Seller,
      //   where: fitlerSeller,
      //   attributes: ['id', 'fullName', 'phoneNumber'] 
      // }]
    })


// console.log("products",products)
    return res.status(200).send(products)
  } catch (error) {
    console.error(error)
    res.status(404).send("not found")
  }
}


exports.updateOffer = async (req, res) => {
  const { id } = req.params;
  const { offer } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" })

    product.offer = offer
    await product.save()

    res.status(200).json({ message: "Offer updated", product })
  } catch (error) {
    console.error("Offer update failed", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

