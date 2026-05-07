import express from "express"
const router = express.Router();
import { searchUser,sendRequest,getRequestCount,getReceiverRequests } from "../controllers/requestController.js";


// Register user
router.get('/searchUser',searchUser)
router.post('/sendRequest',sendRequest)
router.get('/getRequestsCount',getRequestCount)
router.get('/getreceivedRequests',getReceiverRequests)






export default router;




    






