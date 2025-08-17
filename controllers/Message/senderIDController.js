import User from "../../models/user_reg.js";

export default async function createMessage(req, res) {
    try {
        const { email, text } = req.body;
        if (!email) {
            return res.status(400).json({ code: 1, message: 'User email is required' });
        }
        if (!text) {
            return res.status(400).json({ code: 1, message: 'Message text is required' });
        }
        const user = await User.findOne({ email: email });

        // Handle case where no user is found with the provided email.
        if (!user) {
            return res.status(404).json({ code: 1, message: `User with email ${email} not found` });
        }

        // 3. Get the user's MongoDB _id to use as the senderId.
        const senderId = user._id;
        return res.status(201).json({
            code: 0,
            senderId: senderId,
        });

    } catch (error) {
        console.error("Error in createMessage controller:", error);
        return res.status(500).json({ code: 1, message: "An internal server error occurred" });
    }
}