
const express = require("express");

const {
    createMenuItem,
    getMenuItems,
    getMenuItemsByID,
    updateMenuItem,
    deleteItem
} = require("../Controllers/menuController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin only: create food items
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createMenuItem
);

// Logged-in users: view menu
router.get("/", authMiddleware, getMenuItems);

router.get("/:id", authMiddleware, getMenuItemsByID);

// Admin only: edit and delete food items
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateMenuItem
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteItem
);

module.exports = router;
