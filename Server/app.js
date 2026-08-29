const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const app = express();

const cutomerRoutes = require("./routes/customerRoutes");
const menuRoutes = require("./routes/menuRoutes");

const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
app.use(express.json());
app.use(cors());
app.use("/api/customers",cutomerRoutes);
app.use("/api/auth",authRoutes);
app.get("/api/test",authMiddleware,(req,res)=>{
    res.json({
        message:"Success",
        user:req.user
    });
});
app.use("/api/orders",orderRoutes);
app.use("/api/menu",menuRoutes);
app.use("/api/payments",paymentRoutes);
app.get("/",(req,res)=>{
    res.send("Daily thalli Backend running.....");
});

module.exports = app;