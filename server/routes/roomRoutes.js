import express from 'express';
import { createRoom, joinRoom } from '../controllers/roomController.js';

const router = express.Router();

// Room management endpoints
router.post('/create', createRoom);
router.post('/join', joinRoom);

export default router;
