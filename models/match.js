const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ], // An array of the two users involved
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  }, // Status of the match (pending until both accept)
  initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who initiated the match request
  createdAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date }, // Timestamp for when the match is accepted
});

module.exports = mongoose.model('Match', matchSchema);
