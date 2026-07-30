import Room from '../models/Room.js';
import { generateRoomId } from '../utils/generateRoomId.js';

/**
 * Create a new watch party room
 * POST /api/rooms/create
 */
export const createRoom = async (req, res, next) => {
  try {
    const { username, hostSocketId } = req.body;

    if (!username || !hostSocketId) {
      return res.status(400).json({
        success: false,
        message: 'Username and hostSocketId are required',
      });
    }

    // Generate unique 6-character room code
    let roomId = generateRoomId();
    let existingRoom = await Room.findOne({ roomId });

    while (existingRoom) {
      roomId = generateRoomId();
      existingRoom = await Room.findOne({ roomId });
    }

    // Create new room document
    const newRoom = await Room.create({
      roomId,
      hostSocketId,
      participants: [
        {
          socketId: hostSocketId,
          username,
          role: 'Host',
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: newRoom,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Join an existing watch party room
 * POST /api/rooms/join
 */
export const joinRoom = async (req, res, next) => {
  try {
    const { roomId, username, socketId } = req.body;

    if (!roomId || !username || !socketId) {
      return res.status(400).json({
        success: false,
        message: 'RoomId, username, and socketId are required',
      });
    }

    const formattedRoomId = roomId.toUpperCase();
    const room = await Room.findOne({ roomId: formattedRoomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check if participant already exists in the room
    const existingParticipant = room.participants.find(
      (participant) => participant.socketId === socketId
    );

    if (!existingParticipant) {
      room.participants.push({
        socketId,
        username,
        role: 'Participant',
      });
      await room.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Joined room successfully',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};
