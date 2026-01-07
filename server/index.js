const PORT = 8080;
const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const cors = require("cors");
const authRoutes = require("./routes/Auth-route");
const app = express();
console.log("JWT_SECRET =", process.env.JWT_SECRET);

const db = require("./database-models")
const productsRoutes= require("./routes/Products-route.js")
const photosRoutes= require("./routes/photosRoutes.js")
const SellerRoutes= require("./routes/Seller-route.js")
const ClientRoutes= require("./routes/Client-route.js")
app.use(express.static(__dirname + "/../client/"));
app.use(cors())
app.use(express.json());
app.use('/uploads', express.static('/uploads/'));

app.use("/api/product",productsRoutes)
app.use("/api/photos",photosRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/seller',SellerRoutes)
app.use('/api/client',ClientRoutes)
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
