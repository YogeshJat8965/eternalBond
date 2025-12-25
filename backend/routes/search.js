const express = require('express');
const router = express.Router();
const { searchMembers } = require('../controllers/searchController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional authentication middleware - allows both authenticated and non-authenticated access
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      // Try to verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      } else {
        req.user = null;
      }
    } else {
      req.user = null;
    }
  } catch (error) {
    // If token verification fails, just continue without user
    req.user = null;
  }
  next();
};

// Search members with filters (accessible to all users)
router.get('/', optionalAuth, searchMembers);

module.exports = router;
