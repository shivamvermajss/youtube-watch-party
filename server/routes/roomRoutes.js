import express from 'express';
import { createRoom, getRoomDetails, joinRoom } from '../controllers/roomController.js';

const router = express.Router();

// Placeholder route definitions
router.post('/create', createRoom);
router.get('/:roomId', getRoomDetails);
router.post('/join', joinRoom);

export default router;
