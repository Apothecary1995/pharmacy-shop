module.exports = (sequelize, Sequelize) => {
  const Prescription = sequelize.define("prescription", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    }
  });
  return Prescription;
};