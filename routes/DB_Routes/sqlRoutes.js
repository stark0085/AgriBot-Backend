import { Router } from 'express';
const router = Router()
import { message_get } from '../../controllers/DB/getMessage';
import { message_post } from '../../controllers/DB/postMessage';
import { getFullChat } from '../../controllers/DB/getFullChat';

router.get('/message', message_get);
router.post('/message',message_post);
router.post('/getFullChat',getFullChat); // on the basis of room id 

export default router;