import Room from '../models/Room.js';
import { findRoomByRoomId } from '../utils/findRoomByRoomId.js';

/**
 * Handle participant leaving a room or disconnecting
 * Removes participant from MongoDB, reassigns host if needed, or deletes empty room.
 */
const handleUserLeave = async (io, socket) => {
  try {
    const room = await Room.findOne({ 'participants.socketId': socket.id });
    if (!room) return;

    const participant = room.participants.find((p) => p.socketId === socket.id);
    const username = participant ? participant.username : 'User';
    const roomId = room.roomId;

    // Filter out leaving participant
    room.participants = room.participants.filter((p) => p.socketId !== socket.id);

    if (room.participants.length === 0) {
      // Delete room if no participants remain
      await Room.deleteOne({ _id: room._id });
      console.log(`[Socket] Room Deleted: ${roomId} (all participants left)`);
    } else {
      // Reassign host if host left
      if (room.hostSocketId === socket.id) {
        room.hostSocketId = room.participants[0].socketId;
        room.participants[0].role = 'Host';
      }

      await room.save();

      // Broadcast user-left to remaining users in the room
      io.to(roomId).emit('user-left', {
        username,
        socketId: socket.id,
        room,
      });

      console.log(`[Socket] Room Left: ${roomId} by ${username} (${socket.id})`);
    }

    socket.leave(roomId);
  } catch (error) {
    console.error(`[Socket Error] Failed to handle user leave: ${error.message}`);
  }
};

/**
 * Initialize Socket.IO connection event listeners
 */
export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] User Connected: ${socket.id}`);

    // Event: join-room
    socket.on('join-room', async (data) => {
      try {
        const { roomId, username } = data || {};

        if (!roomId || !username) {
          return socket.emit('error', {
            success: false,
            message: 'RoomId and username are required',
          });
        }

        const room = await findRoomByRoomId(roomId);

        if (!room) {
          return socket.emit('error', {
            success: false,
            message: 'Room not found',
          });
        }

        const trimmedUsername = username.trim();

        // Check if username is already taken by another participant in the room
        const isUsernameTaken = room.participants.some(
          (p) => p.socketId !== socket.id && p.username.toLowerCase() === trimmedUsername.toLowerCase()
        );

        if (isUsernameTaken) {
          return socket.emit('error', {
            success: false,
            message: 'Username is already taken in this room',
          });
        }

        // Join Socket.IO room channel
        socket.join(room.roomId);

        // Update or add participant to room in MongoDB
        const existingParticipantIndex = room.participants.findIndex(
          (p) => p.socketId === socket.id
        );

        if (existingParticipantIndex !== -1) {
          room.participants[existingParticipantIndex].username = trimmedUsername;
        } else {
          const role = room.participants.length === 0 ? 'Host' : 'Participant';
          room.participants.push({
            socketId: socket.id,
            username: trimmedUsername,
            role,
          });
        }

        await room.save();

        console.log(`[Socket] Room Joined: ${room.roomId} by ${trimmedUsername} (${socket.id})`);

        // Emit room-joined to the connecting user
        socket.emit('room-joined', {
          success: true,
          message: 'Joined room successfully',
          room,
        });

        // Broadcast user-joined to all other users in the room
        socket.to(room.roomId).emit('user-joined', {
          username: trimmedUsername,
          socketId: socket.id,
          room,
        });
      } catch (error) {
        console.error(`[Socket Error] Error in join-room: ${error.message}`);
        socket.emit('error', {
          success: false,
          message: 'Internal server error while joining room',
        });
      }
    });

    // Event: leave-room
    socket.on('leave-room', async () => {
      await handleUserLeave(io, socket);
    });

    // Event: disconnect
    socket.on('disconnect', async () => {
      console.log(`[Socket] User Disconnected: ${socket.id}`);
      await handleUserLeave(io, socket);
    });
  });
};

// Backwards compatibility alias if needed
export const initializeSocketHandlers = initializeSocket;
