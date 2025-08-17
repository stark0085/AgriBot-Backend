import Message from "../../models/msg_reg.js"; 

export default async function createMessage(req, res) {
    try {
        const { senderId, text } = req.body;

        if (!senderId) {
            return res.status(400).json({ code: 1, message: 'Sender ID is required' });
        }
        if (!text) {
            return res.status(400).json({ code: 1, message: 'Message is required' });
        }

        // 2. Get the bot's ID from your environment variables.
        const botId = process.env.AI_BOT_USER_ID;
        if (!botId) {
            console.error("AI_BOT_USER_ID is not set in environment variables.");
            return res.status(500).json({ code: 1, message: 'Server configuration error, AI_BOT_USER_ID is missing' });
        }
        
        const newMessage = new Message({
            senderId: senderId,
            receiverId: botId,
            text: text,
        });

        const savedMessage = await newMessage.save();
        return res.status(201).json({ 
            code: 0,
            message: 'Message sent successfully', 
            data: savedMessage 
        });

    } catch (error) {
        console.error("Error in createMessage controller:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ code: 1, message: 'Invalid senderId format.' });
        }
        return res.status(500).json({ code: 1, message: "An internal server error occurred" });
    }
}