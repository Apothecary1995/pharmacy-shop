const controller = require("../controllers/drug.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // Public
  app.get("/api/drugs", controller.findAll);
  app.get("/api/drugs/:id", controller.findOne);

  // Admin
  app.post("/api/drugs", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
  app.put("/api/drugs/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
  app.delete("/api/drugs/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);
};