const controller = require("../controllers/prescription.controller");
const { authJwt, upload } = require("../middleware");

module.exports = function(app) {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // User
  app.post("/api/prescriptions/upload", [authJwt.verifyToken, upload.single('prescription')], controller.upload);
  app.get("/api/prescriptions/my-prescriptions", [authJwt.verifyToken], controller.findByUser);

  // Admin
  app.get("/api/prescriptions/pending", [authJwt.verifyToken, authJwt.isAdmin], controller.findPending);
  app.put("/api/prescriptions/status", [authJwt.verifyToken, authJwt.isAdmin], controller.updateStatus);
};