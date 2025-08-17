import { Router } from 'express';
const msgrouter = Router()

import sendmsg from '../../controllers/Message/msgController.js';
import getSenderId from '../../controllers/Message/senderIDController.js';
import getConversationByDate from '../../controllers/Message/getConversation.js';

msgrouter.post("/sendmessage", sendmsg);

msgrouter.post("/getsenderid", getSenderId);

msgrouter.get("/conversation/:senderId", getConversationByDate);

export default msgrouter;