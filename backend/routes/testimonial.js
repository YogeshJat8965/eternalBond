const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { verifyToken } = require('../middleware/auth');
const { adminProtect } = require('../middleware/admin');

// Public routes
router.get('/', testimonialController.getAllTestimonials);
router.get('/search', testimonialController.searchTestimonials);
router.get('/:id', testimonialController.getTestimonialById);

// Admin routes (protected)
router.post('/', adminProtect, testimonialController.createTestimonial);
router.put('/:id', adminProtect, testimonialController.updateTestimonial);
router.delete('/:id', adminProtect, testimonialController.deleteTestimonial);

module.exports = router;
