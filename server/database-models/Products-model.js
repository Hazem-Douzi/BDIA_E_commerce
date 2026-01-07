module.exports = (connection, DataTypes) => {
  const Product = connection.define('product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    price: { type: DataTypes.FLOAT, allowNull: false },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
    brand: { type: DataTypes.STRING },
    rate: { type: DataTypes.FLOAT, defaultValue: 0 },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    negociable: { type: DataTypes.BOOLEAN, defaultValue: false },
    offer : {type : DataTypes.FLOAT, defaultValue: 0 },
    promo: { type: DataTypes.FLOAT, defaultValue: 0 },
    delivered: { type: DataTypes.BOOLEAN, defaultValue: false },
    category: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },

    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sellers', 
        key: 'id'
      },
      onDelete: 'CASCADE'
    }

  }, {
    timestamps: false
  });

  return Product;
};
