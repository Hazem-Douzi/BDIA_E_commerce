const express = require("express")
const router = express.Router()
const {getAll,deleteClient,getClientById,UpdateClient} = require("../controllers/Client-controller");
router.get("/all", getAll);  
router.patch("/update/:id", UpdateClient); 
router.delete("/delete/:id", deleteClient); 
router.get("/:id", getClientById);
module.exports = router