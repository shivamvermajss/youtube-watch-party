import express from 'express';
import cors from 'cors';
import { getCorsOptions } from './config/corsConfig.js';
import roomRoutes from './routes/roomRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Global Middleware
app.use(cors(getCorsOptions()));
app.use(express.json());

// Health Check / Base Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'YouTube Watch Party API Server is running',
    phase: 1,
  });
});

// API Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
