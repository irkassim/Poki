const mongoose = require('mongoose');

/* const memorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // User who owns the memory
  },
  memoryUrl: {
    type: String,
    required: true, // Path to the memory file (image/video)
  },
  description: {
    type: String,
    required: false, // Optional description for the memory
  },
  visibility: {
    type: String,
    enum: ['hidden', 'shared'],
    default: 'hidden', // Default visibility for memories
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp for memory creation
  },
});

module.exports = mongoose.model('Memory', memorySchema); */



const memorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memoryUrl: { type: String, required: true },
  description: { type: String },
  visibility: {
    type: String,
    enum: ['hidden', 'shared'],
    default: 'hidden',
  },
  sharedWith: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Users the memory is shared with
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Memory', memorySchema);


