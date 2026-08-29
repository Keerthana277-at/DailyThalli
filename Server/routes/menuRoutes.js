const express = require("express");


const {
    createMenuItem,
    getMenuItems,
    getMenuItemsByID,
    updateMenuItem,
    deleteItem 
} = require("../Controllers/menuController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",authMiddleware,createMenuItem);

router.get("/",authMiddleware,getMenuItems);

router.get("/:id",authMiddleware,getMenuItemsByID);

router.put("/:id",authMiddleware,updateMenuItem);

router.delete("/:id",authMiddleware,deleteItem);

module.exports = router;