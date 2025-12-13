const express = require('express');
const router = express.Router();
const { searchMembers } = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

// Search members with filters
router.get('/', protect, searchMembers);

module.exports = router;
