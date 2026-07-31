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

        // Request live playback state from Host if Host is active in room (and is not the joining user)
        const activeHost = room.participants.find(
          (p) => p.role === 'Host' && p.socketId !== socket.id
        );

        if (activeHost && activeHost.socketId) {
          io.to(activeHost.socketId).emit('request-playback-state', {
            requesterSocketId: socket.id,
            roomId: room.roomId,
          });
        } else {
          // Fallback to room DB playback state
          socket.emit('sync-playback-state', {
            currentVideoId: room.currentVideoId,
            currentTime: room.currentTime,
            isPlaying: room.isPlaying,
          });
        }
      } catch (error) {
        console.error(`[Socket Error] Error in join-room: ${error.message}`);
        socket.emit('error', {
          success: false,
          message: 'Internal server error while joining room',
        });
      }
    });

    // Event: playback-state (Sent by Host in response to request-playback-state)
    socket.on('playback-state', async (data) => {
      try {
        const { roomId, requesterSocketId, currentVideoId, currentTime, isPlaying } = data || {};
        if (!roomId || !requesterSocketId) return;

        const room = await findRoomByRoomId(roomId);
        if (room) {
          if (currentVideoId) room.currentVideoId = currentVideoId;
          if (typeof currentTime === 'number') room.currentTime = currentTime;
          if (typeof isPlaying === 'boolean') room.isPlaying = isPlaying;
          await room.save();
        }

        // Send live Host playback state to the joining/refreshing participant
        io.to(requesterSocketId).emit('sync-playback-state', {
          currentVideoId: currentVideoId || room?.currentVideoId || '',
          currentTime: typeof currentTime === 'number' ? currentTime : (room?.currentTime || 0),
          isPlaying: typeof isPlaying === 'boolean' ? isPlaying : (room?.isPlaying || false),
        });
      } catch (error) {
        console.error(`[Socket Error] Error in playback-state: ${error.message}`);
      }
    });

    // Event: host-video-change
    socket.on('host-video-change', async (data) => {
      try {
        const { roomId, username, videoId, currentTime, isPlaying } = data || {};
        if (!roomId || !username || !videoId) return;

        const room = await findRoomByRoomId(roomId);
        if (!room) return;

        const trimmedUsername = username.trim();
        const isHost =
          (room.hostUsername && room.hostUsername.toLowerCase() === trimmedUsername.toLowerCase()) ||
          room.participants.some((p) => p.socketId === socket.id && p.role === 'Host');

        if (!isHost) {
          console.warn(`[Socket Warning] Non-host user ${trimmedUsername} attempted host-video-change in ${roomId}`);
          return;
        }

        room.currentVideoId = videoId.trim();
        room.currentTime = typeof currentTime === 'number' ? currentTime : 0;
        room.isPlaying = typeof isPlaying === 'boolean' ? isPlaying : true;
        await room.save();

        // Broadcast video-changed to all participants in the room
        socket.to(room.roomId).emit('video-changed', {
          videoId: room.currentVideoId,
          currentTime: room.currentTime,
          isPlaying: room.isPlaying,
        });

        console.log(`[Socket] Video change broadcasted in room ${roomId} to ${videoId} by Host ${trimmedUsername}`);
      } catch (error) {
        console.error(`[Socket Error] Error in host-video-change: ${error.message}`);
      }
    });

    // Event: host-play
    socket.on('host-play', async (data) => {
      try {
        const { roomId, username, currentTime } = data || {};
        if (!roomId || !username) return;

        const room = await findRoomByRoomId(roomId);
        if (!room) return;

        const trimmedUsername = username.trim();
        const isHost =
          (room.hostUsername && room.hostUsername.toLowerCase() === trimmedUsername.toLowerCase()) ||
          room.participants.some((p) => p.socketId === socket.id && p.role === 'Host');

        if (!isHost) {
          console.warn(`[Socket Warning] Non-host user ${trimmedUsername} attempted host-play in ${roomId}`);
          return;
        }

        room.isPlaying = true;
        if (typeof currentTime === 'number') {
          room.currentTime = currentTime;
        }
        await room.save();

        socket.to(room.roomId).emit('sync-play', { currentTime: room.currentTime });
        console.log(`[Socket] Sync Play broadcasted in room ${roomId} by Host ${trimmedUsername}`);
      } catch (error) {
        console.error(`[Socket Error] Error in host-play: ${error.message}`);
      }
    });

    // Event: host-pause
    socket.on('host-pause', async (data) => {
      try {
        const { roomId, username, currentTime } = data || {};
        if (!roomId || !username) return;

        const room = await findRoomByRoomId(roomId);
        if (!room) return;

        const trimmedUsername = username.trim();
        const isHost =
          (room.hostUsername && room.hostUsername.toLowerCase() === trimmedUsername.toLowerCase()) ||
          room.participants.some((p) => p.socketId === socket.id && p.role === 'Host');

        if (!isHost) {
          console.warn(`[Socket Warning] Non-host user ${trimmedUsername} attempted host-pause in ${roomId}`);
          return;
        }

        room.isPlaying = false;
        if (typeof currentTime === 'number') {
          room.currentTime = currentTime;
        }
        await room.save();

        socket.to(room.roomId).emit('sync-pause', { currentTime: room.currentTime });
        console.log(`[Socket] Sync Pause broadcasted in room ${roomId} by Host ${trimmedUsername}`);
      } catch (error) {
        console.error(`[Socket Error] Error in host-pause: ${error.message}`);
      }
    });

    // Event: host-seek
    socket.on('host-seek', async (data) => {
      try {
        const { roomId, username, currentTime } = data || {};
        if (!roomId || !username || typeof currentTime !== 'number') return;

        const room = await findRoomByRoomId(roomId);
        if (!room) return;

        const trimmedUsername = username.trim();
        const isHost =
          (room.hostUsername && room.hostUsername.toLowerCase() === trimmedUsername.toLowerCase()) ||
          room.participants.some((p) => p.socketId === socket.id && p.role === 'Host');

        if (!isHost) {
          console.warn(`[Socket Warning] Non-host user ${trimmedUsername} attempted host-seek in ${roomId}`);
          return;
        }

        room.currentTime = currentTime;
        await room.save();

        socket.to(room.roomId).emit('sync-seek', {
          currentTime,
          isPlaying: room.isPlaying,
        });

        console.log(`[Socket] Sync Seek broadcasted in room ${roomId} to time ${currentTime} by Host ${trimmedUsername}`);
      } catch (error) {
        console.error(`[Socket Error] Error in host-seek: ${error.message}`);
      }
    });

    // Event: playback-state-update (Heartbeat from Host every 2-3s)
    socket.on('playback-state-update', async (data) => {
      try {
        const { roomId, username, currentTime, isPlaying } = data || {};
        if (!roomId || !username || typeof currentTime !== 'number') return;

        const room = await findRoomByRoomId(roomId);
        if (!room) return;

        const trimmedUsername = username.trim();
        const isHost =
          (room.hostUsername && room.hostUsername.toLowerCase() === trimmedUsername.toLowerCase()) ||
          room.participants.some((p) => p.socketId === socket.id && p.role === 'Host');

        if (!isHost) return;

        room.currentTime = currentTime;
        if (typeof isPlaying === 'boolean') {
          room.isPlaying = isPlaying;
        }
        await room.save();
      } catch (error) {
        console.error(`[Socket Error] Error in playback-state-update: ${error.message}`);
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
