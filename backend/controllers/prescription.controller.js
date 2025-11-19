const db = require("../models");
const Prescription = db.prescriptions;
const User = db.users;


exports.upload = (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a prescription file so we acn approve" });
  }

  Prescription.create({
    userId: req.userId,
    imageUrl: req.file.path 
  })
  .then(data => {
    res.send({ message: "Prescription uploaded successfully Check your e-mail ", prescription: data });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};


exports.findByUser = (req, res) => {
  Prescription.findAll({
    where: { userId: req.userId },
    order: [['createdAt', 'DESC']]
  })
  .then(data => res.send(data))
  .catch(err => res.status(500).send({ message: err.message }));
};


exports.findPending = (req, res) => {
  Prescription.findAll({
    where: { status: 'pending' },
    include: [{ model: User, attributes: ['id', 'username', 'email'] }],
    order: [['createdAt', 'ASC']]
  })
  .then(data => res.send(data))
  .catch(err => res.status(500).send({ message: err.message }));
};


exports.updateStatus = (req, res) => {
  const { prescriptionId, status } = req.body; 

  Prescription.findByPk(prescriptionId)
    .then(prescription => {
      if (!prescription) {
        return res.status(404).send({ message: "Prescription not found" });
      }
      prescription.status = status;
      return prescription.save();
    })
    .then(() => {
      res.send({ message: `Prescription ${status} successfully` });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};