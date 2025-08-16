import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user_reg.js";

export default async function signup(req, res) {
    try {
        const { state, district, email, password } = req.body;

        if (!state || !district || !email || !password) {
            return res.status(400).json({ code: 1, message: "State, district, email and password are required" });
        }

        const emailData = await User.findOne({ email: email });
        if (emailData) {
            return res.status(400).json({ code: 1, message: 'Email is already registered'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in environment variables");
        }
        
        const token = jwt.sign(
            { email, state, district },
            process.env.JWT_SECRET,
            { expiresIn: process.env.TIME_TO_LIVE || "30d"}
        );

        const newUser = new User({
            email: email,
            state: state,
            district: district,
            password: hashedPassword
        });
        await newUser.save();

        return res.status(200).json({ code: 0, message: "Signed up successfully", token: token });

    } catch (error) {
        console.error("SIGN-UP ERROR:", error); 
        
        return res.status(500).json({ 
            code: 1, 
            message: "An internal server error occurred.", 
            error: error.message 
        });
    }
}