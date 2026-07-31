import Room from '../models/Room.js';
import { generateRoomId } from '../utils/generateRoomId.js';
import { findRoomByRoomId } from '../utils/findRoomByRoomId.js';

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
    let existingRoom = await findRoomByRoomId(roomId);

    while (existingRoom) {
      roomId = generateRoomId();
      existingRoom = await findRoomByRoomId(roomId);
    }

    // Create room with host participant
    const newRoom = await Room.create({
      roomId,
      hostSocketId,
      participants: [
        {
          socketId: hostSocketId,
          username: username.trim(),
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

    const room = await findRoomByRoomId(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    const trimmedUsername = username.trim();

    // Check if username is already taken by another participant in this room
    const isUsernameTaken = room.participants.some(
      (participant) => participant.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (isUsernameTaken) {
      return res.status(409).json({
        success: false,
        message: 'Username is already taken in this room',
      });
    }

    // Add new participant
    room.participants.push({
      socketId,
      username: trimmedUsername,
      role: 'Participant',
    });

    await room.save();

    return res.status(200).json({
      success: true,
      message: 'Joined room successfully',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get room details by roomId
 * GET /api/rooms/:roomId
 */
export const getRoomByRoomId = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'RoomId parameter is required',
      });
    }

    const room = await findRoomByRoomId(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Room details retrieved successfully',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of participants in a room
 * GET /api/rooms/:roomId/participants
 */
export const getRoomParticipants = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'RoomId parameter is required',
      });
    }

    const room = await findRoomByRoomId(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Participants retrieved successfully',
      data: room.participants,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update room video ID
 * PATCH /api/rooms/:roomId/video
 */
export const updateRoomVideo = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { videoId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'RoomId parameter is required',
      });
    }

    if (videoId === undefined || videoId === null) {
      return res.status(400).json({
        success: false,
        message: 'VideoId is required',
      });
    }

    const room = await findRoomByRoomId(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    room.currentVideoId = String(videoId).trim();
    await room.save();

    return res.status(200).json({
      success: true,
      message: 'Room video updated successfully',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

