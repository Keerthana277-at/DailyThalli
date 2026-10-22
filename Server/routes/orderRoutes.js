
const express = require("express");

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require("../Controllers/orderConstroller");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Logged-in customers can place orders.
// The controller must verify their customer identity.
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createOrder
);

// The controller must return all orders to admins,
// but only the current customer's orders to customers.
router.get("/", authMiddleware, getOrders);

router.get("/:id", authMiddleware, getOrderById);

// Only admins can change order status.
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateOrder
);

// Only admins can delete orders.
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteOrder
);

module.exports = router;
