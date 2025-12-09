module.exports= (connection, DataTypes) => {
  
const Comment = connection.define('comment', {

  content: { type: DataTypes.TEXT },
  rating: { type: DataTypes.INTEGER }, 
},
{
  timestamps : false
})
return Comment

}



