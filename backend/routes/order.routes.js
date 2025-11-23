const controller = require("../controllers/order.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  

  // User
  app.post("/api/orders", [authJwt.verifyToken], controller.create);
  app.get("/api/orders/my-orders", [authJwt.verifyToken], controller.findByUser);

  // Admin
  app.get("/api/orders", [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
  app.put("/api/orders/status", [authJwt.verifyToken, authJwt.isAdmin], controller.updateStatus);
};