const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: { type: String, required: true }, // URL of the public photo
  isPublic: { type: Boolean, default: true }, // Public/Private status
  likes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', photoSchema);