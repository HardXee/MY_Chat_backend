import express from "express"
const router = express.Router();
import { searchUser,sendRequest,getRequestCount,getReceiverRequests,acceptRequest,getFrends } from "../controllers/requestController.js";


// Register user
router.get('/searchUser',searchUser)
router.post('/sendRequest',sendRequest)
router.get('/getRequestsCount',getRequestCount)
router.get('/getreceivedRequests',getReceiverRequests)
router.post('/acceptRequest/:sender_id' ,acceptRequest)
router.get('/getFrends' ,getFrends)
    



export default router;




    






