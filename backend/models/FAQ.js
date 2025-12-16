const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['General', 'Account', 'Payment', 'Subscription', 'Privacy', 'Support'],
    default: 'General'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for searching
faqSchema.index({ question: 'text', answer: 'text' });

module.exports = mongoose.model('FAQ', faqSchema);
