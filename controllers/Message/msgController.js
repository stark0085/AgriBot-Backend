import Message from "../../models/msg_reg.js";
import User from "../../models/user_reg.js";
import axios from 'axios';

export default async function createMessage(req, res) {
    try {
        const { email, query } = req.body;

        if (!email || !query) {
            return res.status(400).json({ code: 1, message: 'Email and query are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ code: 1, message: 'User not found' });
        }
        const senderId = user._id;

        const botId = process.env.AI_BOT_USER_ID;
        if (!botId) {
            console.error("AI_BOT_USER_ID is not set.");
            return res.status(500).json({ code: 1, message: 'Server configuration error' });
        }

        const userMessage = new Message({
            senderId: senderId,
            receiverId: botId,
            text: query
        });
        await userMessage.save();

        let botResponseText;

        try {
            const apiResponse = await axios.post('https://agri-bot-production.up.railway.app/chat', {
                query: query 
            });
            
            botResponseText = apiResponse.data.response; 

        } catch (apiError) {
            console.error("Internal API call failed:", apiError.message);
            botResponseText = "Sorry, I'm having trouble connecting to the AI service right now.";
        }

        const botMessage = new Message({
            senderId: botId,
            receiverId: senderId,
            text: botResponseText, // FIX 3: Use "text" here as well
        });
        await botMessage.save();

        return res.status(201).json({ 
            reply: botResponseText,
        });

    } catch (error) {
        console.error("Error in createMessage controller:", error);
        return res.status(500).json({ code: 1, message: "An internal server error occurred" });
    }
}
