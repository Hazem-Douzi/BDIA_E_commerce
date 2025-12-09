module.exports= (connection, DataTypes) => {


const Client = connection.define('client', {

  fullName: { type: DataTypes.STRING, allowNull: false,defaultValue:"anonymous" },
  age: { type: DataTypes.INTEGER },
  phoneNumber: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false},
  address: { type: DataTypes.STRING },
  picture: { type: DataTypes.TEXT('long')  } 
},
{
      timestamps: false,
})
return Client

}