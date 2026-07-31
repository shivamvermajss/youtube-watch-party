import Room from '../models/Room.js';
import { findRoomByRoomId } from '../utils/findRoomByRoomId.js';

// In-memory store for pending disconnect grace period timeouts
// Key: `${roomId}_${username.toLowerCase()}` -> Timeout ID
const disconnectTimeouts = new Map();

/**
 * Cancel pending disconnect timeout for a user in a room if they reconnected
 */
const cancelDisconnectTimeout = (roomId, username) => {
  if (!roomId || !username) return;
  const key = `${roomId}_${username.trim().toLowerCase()}`;
  if (disconnectTimeouts.has(key)) {
    clearTimeout(disconnectTimeouts.get(key));
    disconnectTimeouts.delete(key);
    console.log(`[Socket] Cancelled disconnect timeout for ${username} in room ${roomId}`);
  }
};

/**
 * Schedule participant removal after a 5-second grace period upon disconnection
 */
const scheduleUserLeave = (io, roomId, username) => {
  if (!roomId || !username) return;
  const trimmedUsername = username.trim();
  const key = `${roomId}_${trimmedUsername.toLowerCase()}`;

  // Cancel any existing timeout for this user first
  if (disconnectTimeouts.has(key)) {
    clearTimeout(disconnectTimeouts.get(key));
  }

  const timeoutId = setTimeout(async () => {
    disconnectTimeouts.delete(key);
    try {
      const room = await findRoomByRoomId(roomId);
      if (!room) return;

      const participantIndex = room.participants.findIndex(
        (p) => p.username.toLowerCase() === trimmedUsername.toLowerCase()
      );

      if (participantIndex === -1) return;

      // Remove participant from MongoDB after 5s grace period
      room.participants.splice(participantIndex, 1);

      if (room.participants.length === 0) {
        // Delete room if all participants left
        await Room.deleteOne({ _id: room._id });
        console.log(`[Socket] Room Deleted: ${roomId} (all participants left)`);
      } else {
        // Transfer Host to oldest participant if the Host disconnected permanently
        if (room.hostUsername && room.hostUsername.toLowerCase() === trimmedUsername.toLowerCase()) {
          const newHost = room.participants[0];
          newHost.role = 'Host';
          room.hostUsername = newHost.username;
          room.hostSocketId = newHost.socketId;
          console.log(`[Socket] Host transferred in ${roomId} to ${newHost.username}`);
        }

        await room.save();

        // Broadcast user-left to remaining participants in the room
        io.to(roomId).emit('user-left', {
          username: trimmedUsername,
          room,
        });

        console.log(`[Socket] User ${trimmedUsername} removed from room ${roomId} after timeout expiration`);
      }
    } catch (error) {
      console.error(`[Socket Error] Disconnect timeout execution failed: ${error.message}`);
    }
  }, 5000);

  disconnectTimeouts.set(key, timeoutId);
  console.log(`[Socket] Scheduled 5s disconnect timeout for ${trimmedUsername} in room ${roomId}`);
};

/**
 * Handle participant leaving a room or disconnecting
 */
const handleUserLeave = async (io, socket) => {
  try {
    const room = await Room.findOne({ 'participants.socketId': socket.id });
    if (!room) return;

    const participant = room.participants.find((p) => p.socketId === socket.id);
    if (!participant) return;

    const username = participant.username;
    const roomId = room.roomId;

    socket.leave(roomId);

    // Schedule 5-second grace period before actual removal
    scheduleUserLeave(io, roomId, username);
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

        // Cancel any pending disconnect removal timeout for this user
        cancelDisconnectTimeout(roomId, trimmedUsername);

        // Join Socket.IO room channel
        socket.join(room.roomId);

        // Identify participant by username (not socket.id)
        let participant = room.participants.find(
          (p) => p.username.toLowerCase() === trimmedUsername.toLowerCase()
        );

        if (participant) {
          // Update socketId for reconnecting participant
          participant.socketId = socket.id;

          // Host recovery: restore Host role if username matches hostUsername or participant was Host
          if (
            (room.hostUsername && room.hostUsername.toLowerCase() === trimmedUsername.toLowerCase()) ||
            participant.role === 'Host'
          ) {
            participant.role = 'Host';
            room.hostUsername = participant.username;
            room.hostSocketId = socket.id;
          }
        } else {
          // Create new participant
          const isHost =
            room.participants.length === 0 ||
            (room.hostUsername && room.hostUsername.toLowerCase() === trimmedUsername.toLowerCase());

          const role = isHost ? 'Host' : 'Participant';

          participant = {
            socketId: socket.id,
            username: trimmedUsername,
            role,
          };

          room.participants.push(participant);

          if (isHost) {
            room.hostUsername = trimmedUsername;
            room.hostSocketId = socket.id;
          }
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

// Backwards compatibility alias
export const initializeSocketHandlers = initializeSocket;
