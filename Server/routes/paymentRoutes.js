const express = require("express");

const {
    createPayment
} = require("../Controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",authMiddleware,createPayment);

module.exports = router;

