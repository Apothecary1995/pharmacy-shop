module.exports = (sequelize, Sequelize) => {
  const Drug = sequelize.define("drug", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    requiresPrescription: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    usageInfo: {
      type: Sequelize.TEXT
    },
    sideEffects: {
      type: Sequelize.TEXT
    },
    category: {
      type: Sequelize.STRING(100)
    }
  });
  return Drug;
};