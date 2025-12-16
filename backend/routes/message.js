const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead
} = require('../controllers/messageController');

// All routes require authentication
router.use(protect);

// @route   GET /api/messages/conversations
// @desc    Get all conversations for logged-in user
// @access  Private
router.get('/conversations', getConversations);

// @route   GET /api/messages/:userId
// @desc    Get messages with a specific user
// @access  Private
router.get('/:userId', getMessages);

// @route   POST /api/messages/send
// @desc    Send a message
// @access  Private
router.post('/send', sendMessage);

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', markAsRead);

module.exports = router;
