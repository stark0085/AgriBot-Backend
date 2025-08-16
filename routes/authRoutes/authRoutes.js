import { Router } from 'express';
const authrouter = Router()
// import { signin } from '../../controllers/Authentication/signin';
import signup from '../../controllers/Authentication/signup.js';
import fetchUsers from '../../controllers/Authentication/fetchUsers.js';
import signin from '../../controllers/Authentication/signin.js';

authrouter.post("/signin", signin)
authrouter.post("/signup", signup)
authrouter.post("/fetchUsers", fetchUsers)

export default authrouter;  