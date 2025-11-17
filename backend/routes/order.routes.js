const controller = require("../controllers/order.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // User
  app.post("/api/orders", [authJwt.verifyToken], controller.create);
  app.get("/api/orders/my-orders", [authJwt.verifyToken], controller.findByUser);

  // Admin
  app.get("/api/orders", [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
  app.put("/api/orders/status", [authJwt.verifyToken, authJwt.isAdmin], controller.updateStatus);
};