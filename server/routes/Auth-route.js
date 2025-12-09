const express = require('express');
const { registerUser, loginUser } = require('../controllers/Auth-controller');
 const  {verifyToken}=require("../middleware/authJwt")
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
//protected route that requires the user to be logged in before they enter the website
router.get('/', verifyToken, (req, res) => {
 res.status(200).send( 'Protected route accessed');
 });

module.exports = router;