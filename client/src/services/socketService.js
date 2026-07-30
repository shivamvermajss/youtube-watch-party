import { io } from 'socket.io-client';

/**
 * Socket.IO service helper placeholder
 */
let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io('http://localhost:5000', {
      autoConnect: false,
    });
  }
  return socketInstance;
};
