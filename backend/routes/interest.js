const express = require('express');
const router = express.Router();
const {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  acceptInterest,
  rejectInterest,
  cancelInterest
} = require('../controllers/interestController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Interest routes
router.post('/send', sendInterest);
router.get('/received', getReceivedInterests);
router.get('/sent', getSentInterests);
router.put('/:id/accept', acceptInterest);
router.put('/:id/reject', rejectInterest);
router.delete('/:id', cancelInterest);

module.exports = router;
