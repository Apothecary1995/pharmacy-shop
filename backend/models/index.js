const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  pool: { ...dbConfig.pool }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelleri yükle
db.users = require("./user.model.js")(sequelize, Sequelize);
db.drugs = require("./drug.model.js")(sequelize, Sequelize);
db.prescriptions = require("./prescription.model.js")(sequelize, Sequelize);
db.orders = require("./order.model.js")(sequelize, Sequelize);
db.orderItems = require("./orderItem.model.js")(sequelize, Sequelize);


db.users.hasMany(db.prescriptions, { foreignKey: "userId" });
db.prescriptions.belongsTo(db.users, { foreignKey: "userId" });

db.users.hasMany(db.orders, { foreignKey: "userId" });
db.orders.belongsTo(db.users, { foreignKey: "userId" });


db.prescriptions.hasOne(db.orders, { foreignKey: "prescriptionId" });
db.orders.belongsTo(db.prescriptions, { foreignKey: "prescriptionId" });


db.orders.hasMany(db.orderItems, { foreignKey: "orderId" });
db.orderItems.belongsTo(db.orders, { foreignKey: "orderId" });


db.drugs.hasMany(db.orderItems, { foreignKey: "drugId" });
db.orderItems.belongsTo(db.drugs, { foreignKey: "drugId" });


module.exports = db;