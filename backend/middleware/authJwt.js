const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user && user.role === "admin") {
      next();
      return;
    }
    res.status(403).send({ message: "Require Admin Role!" });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
};

module.exports = authJwt;