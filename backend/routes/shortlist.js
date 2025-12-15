const express = require('express');
const router = express.Router();
const {
  addToShortlist,
  removeFromShortlist,
  getShortlist,
  checkShortlist
} = require('../controllers/shortlistController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Shortlist routes
router.post('/', addToShortlist);
router.get('/', getShortlist);
router.get('/check/:userId', checkShortlist);
router.delete('/:userId', removeFromShortlist);

module.exports = router;
