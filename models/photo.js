const mongoose = require('mongoose');
const photoSchema = new mongoose.Schema({
    url: { type: String, required: true },  // The photo's S3 URL
    key: { type: String, required: true },  // The S3 key
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user
  });
  
  module.exports = mongoose.model('Photo', photoSchema);
  