const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { verifyToken } = require('../middleware/auth');
const { adminProtect } = require('../middleware/admin');

// Public routes
router.get('/', faqController.getAllFAQs);
router.get('/search', faqController.searchFAQs);
router.get('/:id', faqController.getFAQById);

// Admin routes (protected)
router.post('/', adminProtect, faqController.createFAQ);
router.put('/:id', adminProtect, faqController.updateFAQ);
router.delete('/:id', adminProtect, faqController.deleteFAQ);

module.exports = router;
