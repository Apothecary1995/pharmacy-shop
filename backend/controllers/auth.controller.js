const db = require("../models");
const User = db.users;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).send({ message: "All fields must filled" });
    }
    
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).send({ message: "Failed Email already used" });
    }

    await User.create({
      username: req.body.username,
      email: req.body.email,
      password_hash: bcrypt.hashSync(req.body.password, 8)
    });

    res.send({ message: "User registered " });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).send({ message: "User Not found" });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password_hash);
    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Incorrect Password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400 
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};