module.exports= (connection, DataTypes) => { 
  
const Cart = connection.define('cart', {
  

id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
},
{
  timetamps : false
})
return Cart

}