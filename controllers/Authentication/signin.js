import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../../models/user_reg.js";

export default async function signin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ code: 1, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ code: 1, message: 'User Not Found' });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword) {
            return res.status(400).json({ code: 1, message: 'Invalid password' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(400).json({ code: 1, message: "Missing JWT Secret" });
        }
                
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.TIME_TO_LIVE || "30d"}
        );

        return res.status(200).json({ code: 0, message: 'Signed in successfully', token: token });

    } catch (error) {
        return res.status(500).json({ code: 1, message: "Request Timed Out", error: error });
    }
}
