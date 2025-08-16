import User from "../models/user.cjs"

export const access_token_post = async (req, res)=>{
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ code: 1, error: "Email is required" });
    }
    try {
        const user = await User.create({email, token, createdAt})
        return res.status(200).json({ code: 0, message: "User Added Successfully", user: user});
    } catch (error) {
        res.status(500).json({ code: -1, message: 'Internal server error', error: error});
    }
}

export async function access_token_get(req, res) {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ code: 1, message: "Email is required" });
    }
    var d = getCurrTime()

    try{
        const data = await User.find({email: email})
        const Dt = getTimeDifference(data[0].createdAt)
        if(Dt.hours === 0 && Dt.minutes <1 && Dt.seconds<60)
            res.status(200).json({ code: 0, message: "Authorization successful"});
        else{
            const userId = data[0]._id.toString();
            const itemDeleted = await User.deleteOne({ _id: userId });
            res.status(200).json({code: 5, message: "Token Expired, Log in again to Continue"})
        }
    } catch (error) {
        res.status(500).json({ code: -1, message: 'Internal server error', error: error});
    }
}