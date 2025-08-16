import jwt from "jsonwebtoken";
import User from "../../models/user_reg.js";

export default async function fetchUsers(req, res) {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ code: 1, message: "Token required" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Missing JWT Secret" });
        }
        jwt.verify(token, process.env.JWT_SECRET);

        const allUsers = await User.find({});
        return res.status(200).json({ code: 0, message: "Fetched Users Successfully", users: allUsers });

    } catch (error) {
        console.error("Fetch user error:", error);
        return res.status(401).json({ code: 1, message: "Unauthorized User", error: error });
    }
}