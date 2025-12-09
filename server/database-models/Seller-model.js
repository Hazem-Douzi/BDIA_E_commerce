module.exports= (connection, DataTypes) => { 
  
  const Seller =connection.define('seller', {
  
  fullName: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER },
  phoneNumber: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING},
  address: { type: DataTypes.STRING },
  picture: { type: DataTypes.TEXT('long') },
  password: { type: DataTypes.STRING, allowNull: false},
},
{
  timestamps : false
})
return Seller

}