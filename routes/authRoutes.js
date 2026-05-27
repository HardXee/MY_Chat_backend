import express from "express"
const router = express.Router();

import {test,register,login,forgotPassword,resetPassword,logout} from '../controllers/authController.js'


// testing the  auth route
router.get('/test',test)

// Register user
router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.post('/forgotpassword',forgotPassword)
router.post('/resetpassword',resetPassword)



export default router;











