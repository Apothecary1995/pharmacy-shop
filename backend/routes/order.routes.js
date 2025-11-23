const controller = require("../controllers/order.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/orders",
    [authJwt.verifyToken],
    controller.create
  );

  app.get(
    "/api/orders/user",
    [authJwt.verifyToken],
    controller.findByUser
  );
  
 
  app.get(
    "/api/orders",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findAll
  );
  

  app.put(
    "/api/orders/status",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateStatus
  );
};