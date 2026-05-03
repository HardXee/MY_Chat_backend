import express from "express"
const router = express.Router();
import { searchUser,sendRequest } from "../controllers/requestController.js";


// Register user
router.post('/sendRequest',searchUser)
router.post('/sendRequest',sendRequest)






export default router;











