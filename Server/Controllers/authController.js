const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req,res) => {
    try{
        const { email,password } = req.body;

        const user = await User.findOne({ email });

        if(!user)
            return res.status(401).json({
                message:"Invalid email or password"
            });
    

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if(!isPasswordCorrect)
        return res.status(401).json({
            message:"Invalid email or password"
        });


const token = jwt.sign(
    {
        id:user._id,
        role:user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn:"1d"
    }
);

 return res.status(200).json({
    message:"Login successfull",
    token:token,
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    }
 });

    }catch(error){
        console.log("Login Error:",error.message);

        res.status(500).json({
            message:"Server error"
        });
    }
};    

module.exports = { login };