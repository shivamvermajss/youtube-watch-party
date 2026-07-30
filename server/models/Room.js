import mongoose from 'mongoose';

/**
 * Room Schema Placeholder for Phase 1
 */
const roomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: 'Watch Party Room',
    },
    hostId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;
