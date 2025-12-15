const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shortlistedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can't shortlist the same person multiple times
shortlistSchema.index({ userId: 1, shortlistedUserId: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', shortlistSchema);
