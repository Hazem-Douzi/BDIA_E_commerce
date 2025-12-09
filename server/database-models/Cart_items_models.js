module.exports= (connection, DataTypes) => { 

const CartItem = connection.define('cartItem', {
  
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productName: { type: DataTypes.STRING },
  productDescription: { type: DataTypes.TEXT },
  productPhoto: { type: DataTypes.STRING },
  unitPrice: { type: DataTypes.FLOAT },         // price per item
  quantity: { type: DataTypes.INTEGER },        // quantity chosen
  totalPrice: {
    type: DataTypes.FLOAT,                      // unitPrice * quantity
    get() {
      return this.getDataValue('unitPrice') * this.getDataValue('quantity');
    }
  }
},
{
  timestamps : false
});
return CartItem

}