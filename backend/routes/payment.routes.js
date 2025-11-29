const express = require('express');
const router = express.Router(); // 👈 Express Router'ı tanımlayın
const controller = require("../controllers/payment.controller");
const { authJwt } = require("../middleware");


router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.post('/intent', [authJwt.verifyToken], controller.createPaymentIntent);

module.exports = router;
