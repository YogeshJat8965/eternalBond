const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { verifyToken } = require('../middleware/auth');
const { adminProtect } = require('../middleware/admin');

// Public routes
router.get('/', storyController.getAllStories);
router.get('/featured', storyController.getFeaturedStories);
router.get('/search', storyController.searchStories);
router.get('/:id', storyController.getStoryById);

// Admin routes (protected)
router.post('/', adminProtect, storyController.createStory);
router.put('/:id', adminProtect, storyController.updateStory);
router.put('/:id/toggle-featured', adminProtect, storyController.toggleFeatured);
router.delete('/:id', adminProtect, storyController.deleteStory);

module.exports = router;
