
const express = require("express");

const {
    createPayment,
    getPayments,
    deletePayment
} = require("../Controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createPayment);

router.get("/", authMiddleware, getPayments);

router.delete("/:id", authMiddleware, deletePayment);

module.exports = router;
