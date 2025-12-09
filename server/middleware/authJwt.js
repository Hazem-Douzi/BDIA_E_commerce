const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyToken=(req, res, next) =>{
const authHeader = req.header('Authorization');

if (!authHeader) return res.status(401).send('Access denied');
const token = authHeader.split(' ')[1];
 if (!token) return res.status(401).send('Token missing');

try {
 const decoded = jwt.verify(token, process.env.JWT_SECRET);
 req.user = decoded;
 next();

 } catch (error) {
 res.status(401).send('Invalid token');
 }
 };

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).send("Access denied: Insufficient permissions");
    }
    next();
  };
};
module.exports ={verifyToken,checkRole}