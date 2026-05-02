import express from "express"
const router = express.Router();

import {test,register,login} from '../controllers/authController.js'


// testing the  auth route
router.get('/test',test)

// Register user
router.post('/register',register)
router.post('/login',login)





export default router;











