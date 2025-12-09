const { Sequelize, DataTypes } = require("sequelize");
const config=require("./config")


const Product  = require("./Products-model.js")
const Seller   = require("./Seller-model.js")
const Client   = require("./Client-model.js")
const Photo    = require("./Photo_model.js")
const Comment  = require("./comments.js")

console.log("product",Product)

const connection = new Sequelize(config.dbName, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

const testConnection = async () => {
  try {
    await connection.authenticate(); 
    console.log(" Connection has been established successfully.");
  } catch (error) {
    console.error(" Unable to connect to the database:", error);
  }
};
testConnection();
 
async function syncTables() {
  await connection.sync({ alter: true }); 
  console.log("All models were synchronized successfully.");
}
// syncTables()





const db={}

db.Sequelize=Sequelize
db.connection=connection
db.Product=Product(connection,DataTypes)
db.Seller=Seller(connection,DataTypes)
db.Client=Client(connection,DataTypes)
db.Photo=Photo(connection,DataTypes)
db.Comment=Comment (connection,DataTypes)





db.Product.hasMany(db.Comment);  
db.Comment.belongsTo(db.Product);

db.Client.hasMany(db.Comment); 
db.Comment.belongsTo(db.Client);

db.Product.hasMany(db.Photo);   
db.Photo.belongsTo(db.Product);

db.Seller.hasMany(db.Product, { foreignKey: 'sellerId' });
db.Product.belongsTo(db.Seller, { foreignKey: 'sellerId' });









module.exports=db