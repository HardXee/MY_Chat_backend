import express from 'express'
const router = express.Router();

import { getMyMessages } from '../controllers/messageController.js';


router.get('/getMymessages/:id/:updatedAt',getMyMessages);

export default router;