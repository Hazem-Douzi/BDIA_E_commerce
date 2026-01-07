module.exports= (connection, DataTypes) => { 


  const Photo = connection.define('photo', {

  url: { type: DataTypes.STRING, allowNull: false },
},
{
  timestamps : false

})

return Photo
}