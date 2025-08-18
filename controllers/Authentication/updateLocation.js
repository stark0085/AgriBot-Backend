import User from "../../models/user_reg.js";

export default async function updateLocation(req, res) {
    try {
        const { email, state, district } = req.body;

        if (!email || !state || !district) {
            return res.status(400).json({ 
                code: 1, 
                message: 'Email, state, and district are required' 
            });
        }
        const updatedUser = await User.findOneAndUpdate(
            { email }, 
            { state, district },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(400).json({ code: 1, message: 'User Not Found' });
        }
        
        return res.status(200).json({ 
            code: 0, 
            message: 'Details updated successfully',
            state: updatedUser.state,
            district: updatedUser.district
        });

    } catch (error) {
        console.error("UPDATE-LOCATION-ERROR:", error);
        return res.status(500).json({ 
            code: 1, 
            message: "An internal server error occurred.", 
            error: error.message 
        });
    }
}