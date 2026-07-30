import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { getCorsOptions } from './config/corsConfig.js';
import { initializeSocketHandlers } from './socket/socketHandler.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: getCorsOptions(),
});

// Register Socket.IO handlers
initializeSocketHandlers(io);

// Start server after initializing DB connection trigger
const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer();
