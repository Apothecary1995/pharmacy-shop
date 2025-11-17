const db = require("../models");
const Drug = db.drugs;
const { Op } = require("sequelize");

exports.findAll = (req, res) => {
  Drug.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error retrieving drugs." });
    });
};

exports.findOne = (req, res) => {
  Drug.findByPk(req.params.id)
    .then(data => {
      if (data) res.send(data);
      else res.status(404).send({ message: "Drug not found." });
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving drug." });
    });
};


exports.create = (req, res) => {
  Drug.create(req.body)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error creating drug." });
    });
};

exports.update = (req, res) => {
  Drug.update(req.body, { where: { id: req.params.id } })
    .then(num => {
      if (num == 1) res.send({ message: "Drug updated successfully." });
      else res.send({ message: `Cannot update Drug with id=${req.params.id}.` });
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating drug." });
    });
};

exports.delete = (req, res) => {
  Drug.destroy({ where: { id: req.params.id } })
    .then(num => {
      if (num == 1) res.send({ message: "Drug deleted successfully." });
      else res.send({ message: `Cannot delete Drug with id=${req.params.id}.` });
    })
    .catch(err => {
      res.status(500).send({ message: "Error deleting drug." });
    });
};