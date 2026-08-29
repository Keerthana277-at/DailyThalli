const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const createAdmin = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);

        const hashedPassword = await bcrypt.hash("Admin@123",10);

        const admin = new User({
            name:"admin",
            email:"admin@dailythali.com",
            password:hashedPassword,
            role:"admin"
        });

        await admin.save();

        console.log("Admin created successfully!!");

        mongoose.connection.close();
    }catch(error){
        console.log("Error:",error.message);
    }
};

createAdmin();