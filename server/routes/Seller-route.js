const express = require("express")
const router = express.Router()
const {getAll, deleteSeller, getSellerById,UpdateSeller} = require("../controllers/Seller-controller");
router.patch("/update/:id", UpdateSeller); 
router.get("/all", getAll);  
router.delete("/delete/:id", deleteSeller); 
router.get("/:id", getSellerById);

module.exports = router