const express = require("express");

const {
    createCustomer,
    getCustomers,
    getCustomersByID,
    updateCustomer,
    deleteCustomer
} = require("../Controllers/customerController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",authMiddleware,createCustomer);
router.get("/",authMiddleware,getCustomers);
router.get("/:id",authMiddleware,getCustomersByID);
router.put("/:id",authMiddleware,updateCustomer);
router.delete("/:id",authMiddleware,deleteCustomer);

module.exports = router;