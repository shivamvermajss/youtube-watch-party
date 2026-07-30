import mongoose from 'mongoose';

/**
 * Connect to MongoDB database instance
 * Placeholder configuration for Phase 1
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/youtube_watch_party';
    
    // Note: Actual connection call is commented out until MongoDB instance is running in later phases
    // const conn = await mongoose.connect(mongoUri);
    // console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    console.log(`[DB Config] MongoDB connection file initialized. Target URI: ${mongoUri}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};
