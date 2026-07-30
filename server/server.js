import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { getCorsOptions } from './config/corsConfig.js';
import { initializeSocketHandlers } from './socket/socketHandler.js';
import { logInfo } from './utils/logger.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: getCorsOptions(),
});

// Set up Socket.IO event listeners
initializeSocketHandlers(io);

// Initialize Database connection (placeholder trigger)
connectDB();

// Start Server
server.listen(PORT, () => {
  logInfo(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
