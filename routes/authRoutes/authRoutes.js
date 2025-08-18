import { Router } from 'express';
const authrouter = Router()
// import { signin } from '../../controllers/Authentication/signin';
import signup from '../../controllers/Authentication/signup.js';
import fetchUsers from '../../controllers/Authentication/fetchUsers.js';
import signin from '../../controllers/Authentication/signin.js';
import updateLocation from '../../controllers/Authentication/updateLocation.js';

authrouter.post("/signin", signin)
authrouter.post("/signup", signup)
authrouter.post("/fetchUsers", fetchUsers)
authrouter.post("/updateLocation", updateLocation)

export default authrouter;  