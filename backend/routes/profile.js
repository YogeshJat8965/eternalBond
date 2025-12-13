const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateProfile,
  uploadPhoto,
  deletePhoto,
  getUserProfile
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// Own profile routes
router.get('/me', getMyProfile);
router.put('/me', updateProfile);

// Photo upload routes
router.post('/upload-photo', upload.single('photo'), uploadPhoto);
router.delete('/photo/:index', deletePhoto);

// View other user's profile
router.get('/:id', getUserProfile);

module.exports = router;
