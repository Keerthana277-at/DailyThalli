const express = require("express");

const {
    createPayment,
    getPayments
} = require("../Controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",authMiddleware,createPayment);

router.get("/",authMiddleware,getPayments);

module.exports = router;

