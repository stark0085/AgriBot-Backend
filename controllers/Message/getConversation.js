import Message from "../../models/msg_reg.js"; 

export default async function getConversationByDate(req, res) {
    try {
        // 1. Get the user's ID from the URL parameters.
        const { senderId } = req.params;
        // 2. Get the date from the query string (e.g., /api/messages/someUserId?date=2025-08-17).
        const { date } = req.query;

        // --- Basic Validation ---
        if (!senderId) {
            return res.status(400).json({ code: 1, message: 'Sender ID is required in the URL path' });
        }
        if (!date) {
            return res.status(400).json({ code: 1, message: 'A date query parameter is required (e.g., ?date=YYYY-MM-DD)' });
        }
        // A simple regex to check if the date format is plausible.
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ code: 1, message: 'Invalid date format. Please use YYYY-MM-DD.' });
        }
        // --- End Validation ---

        // 3. Create a date range for the entire day in UTC.
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        // 4. Get the bot's ID from environment variables.
        const botId = process.env.AI_BOT_USER_ID;
        if (!botId) {
            console.error("AI_BOT_USER_ID is not set in environment variables.");
            return res.status(500).json({ code: 1, message: 'Server configuration error' });
        }

        // 5. Find all messages within the date range that involve the user and the bot.
        const conversation = await Message.find({
            // Condition 1: The message must be created within the specified day.
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            // Condition 2: The message must be between the user and the bot.
            $or: [
                { senderId: senderId, receiverId: botId }, // User to Bot
                { senderId: botId, receiverId: senderId }  // Bot to User
            ]
        }).sort({ createdAt: 'asc' }); // Sort messages chronologically.

        return res.status(200).json({ 
            code: 0,
            message: 'Conversation fetched successfully', 
            data: conversation 
        });

    } catch (error) {
        console.error("Error in getConversationByDate controller:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ code: 1, message: 'Invalid senderId format.' });
        }
        return res.status(500).json({ code: 1, message: "An internal server error occurred" });
    }
}