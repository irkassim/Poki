const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    category: { type: String, enum: ['Personality', 'Values',
      'Social, Political, Philosophical, and Spiritual Views', 'Mindset', "Growth mentality"], required: true },
    text: { type: String, required: true }, // Question text
    options: [{ type: String, required: true }], // Multiple-choice options
  });
  
  module.exports = mongoose.model('Question', questionSchema);
  