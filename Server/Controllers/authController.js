const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const login = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body);
        console.log("CONTENT TYPE:", req.headers["content-type"]);

        const { email, password } = req.body;

        console.log("Email:", email);
        console.log("Password received:", !!password);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Login Error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};



const register = async (req, res) => {
    try {
        const { name, email, password, phone, department } = req.body;

        // Validate all required fields
        if (
            !name?.trim() ||
            !email?.trim() ||
            !password ||
            !phone?.trim() ||
            !department?.trim()
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check whether the email already exists
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the login account with the customer role
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "customer"
        });

        try {
            // Create the customer profile linked to the user
            await Customer.create({
                user: user._id,
                name: name.trim(),
                phone: phone.trim(),
                department: department.trim()
            });
        } catch (error) {
            // Roll back the user account if profile creation fails
            await User.findByIdAndDelete(user._id);
            throw error;
        }

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        console.error("Registration error:", error.message);

        return res.status(500).json({
            message: "Unable to register account"
        });
    }
};


module.exports = { login,register };