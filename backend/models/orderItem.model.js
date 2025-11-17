module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define("orderItem", {
    orderId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    drugId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    pricePerUnit: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    timestamps: false 
  });
  return OrderItem;
};