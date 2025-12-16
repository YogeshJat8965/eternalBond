const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  coupleName: {
    type: String,
    required: true,
    trim: true
  },
  weddingDate: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: '💑'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for searching
storySchema.index({ coupleName: 'text', location: 'text' });

module.exports = mongoose.model('Story', storySchema);
