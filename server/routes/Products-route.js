const express = require("express")
// const {searchProduct} = require("../controllers/products-controller.js")
const router = express.Router()

const {getAll,addProduct,deleteProduct,updateProduct,getAllProducts} = require("../controllers/products-controller.js");
const {searchProduct,updateOffer} = require("../controllers/productsSearch-cotroller.js")

router.get("/all", getAll);     
router.get("/spec/:sellerId", getAllProducts);  
router.get("/search", searchProduct); 


router.post("/add", addProduct);    

router.delete("/delete/:id", deleteProduct); 

router.put("/update/:id", updateProduct);
router.patch('/offer/:id',updateOffer);


module.exports = router