import express from 'express';
import {
  createRoom,
  joinRoom,
  getRoomByRoomId,
  getRoomParticipants,
} from '../controllers/roomController.js';

const router = express.Router();

// Room Management Routes
router.post('/create', createRoom);
router.post('/join', joinRoom);
router.get('/:roomId', getRoomByRoomId);
router.get('/:roomId/participants', getRoomParticipants);

export default router;
