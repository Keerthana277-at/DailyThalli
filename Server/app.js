const express = require("express");
const cors = require("cors");
const app = express();
   app.use(cors({
     origin: ["https://daily-thalli.vercel.app", "http://localhost:5173"],
     credentials: true
   }));
app.use(express.json());  
app.use("/api/auth",authRoutes); 
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");


const cutomerRoutes = require("./routes/customerRoutes");
const menuRoutes = require("./routes/menuRoutes");

const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


app.use("/api/customers",cutomerRoutes);

const publicRoutes = require("./routes/publicRoutes");
app.get("/api/test",authMiddleware,(req,res)=>{
    res.json({
        message:"Success",
        user:req.user
    });
});
app.use("/api/orders",orderRoutes);
app.use("/api/menu",menuRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/public",publicRoutes);
app.get("/",(req,res)=>{
    res.send("Daily thalli Backend running.....");
});

module.exports = app;