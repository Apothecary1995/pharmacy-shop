module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    prescriptionId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    totalPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('pending_approval', 'verified', 'shipped', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'pending_approval'
    },
    shippingAddress: {
      type: Sequelize.TEXT, 
      allowNull: false
    },
    paymentMethod: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    paymentStatus: {
      type: Sequelize.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    }
  });
  return Order;
};