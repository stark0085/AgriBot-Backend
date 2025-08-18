import Message from "../../models/msg_reg.js";
import User from "../../models/user_reg.js"; // 1. Import the User model

export default async function getConversationByDate(req, res) {
    try {
        // 2. Get email from the URL parameters instead of senderId.
        const { email } = req.params;
        // 3. Get the date from the query string.
        const { date } = req.query;

        // --- Validation --
        if (!email) {
            return res.status(400).json({ code: 1, message: 'Email is required in the URL path' });
        }
        if (!date) {
            return res.status(400).json({ code: 1, message: 'A date query parameter is required (e.g., ?date=YYYY-MM-DD)' });
        }
        // A simple regex to check if the date format is plausible.
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ code: 1, message: 'Invalid date format. Please use YYYY-MM-DD.' });
        }

        // 4. Find the user by their email to get their MongoDB _id.
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ code: 1, message: 'User with this email not found.' });
        }
        const userId = user._id; // Get the user's ID

        // 5. Create a date range for the entire day in UTC.
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        // 6. Get the bot's ID from environment variables.
        const botId = process.env.AI_BOT_USER_ID;
        if (!botId) {
            console.error("AI_BOT_USER_ID is not set in environment variables.");
            return res.status(500).json({ code: 1, message: 'Server configuration error' });
        }

        // 7. Find all messages within the date range that involve the user (using their found ID) and the bot.
        const conversation = await Message.find({
            // Condition 1: The message must be created within the specified day.
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            // Condition 2: The message must be between the user and the bot.
            $or: [
                { senderId: userId, receiverId: botId }, // User to Bot
                { senderId: botId, receiverId: userId }  // Bot to User
            ]
        }).sort({ createdAt: 'asc' }); // Sort messages chronologically.

        // --- Success Response ---
        return res.status(200).json({
            code: 0,
            message: 'Conversation fetched successfully',
            data: conversation
        });

    } catch (error) {
        // --- Error Handling ---
        console.error("Error in getConversationByDate controller:", error);
        if (error.name === 'CastError') {
            // This error is less likely now since we're looking up the user first.
            return res.status(400).json({ code: 1, message: 'Invalid ID format.' });
        }
        return res.status(500).json({ code: 1, message: "An internal server error occurred" });
    }
}
