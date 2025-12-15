const Shortlist = require('../models/Shortlist');
const User = require('../models/User');

// @desc    Add user to shortlist
// @route   POST /api/shortlist
// @access  Private
const addToShortlist = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Can't shortlist yourself
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot shortlist yourself'
      });
    }

    // Check if already shortlisted
    const existing = await Shortlist.findOne({
      userId: req.user._id,
      shortlistedUserId: userId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User already in shortlist'
      });
    }

    // Add to shortlist
    const shortlist = await Shortlist.create({
      userId: req.user._id,
      shortlistedUserId: userId
    });

    res.status(201).json({
      success: true,
      message: 'User added to shortlist',
      data: shortlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Remove user from shortlist
// @route   DELETE /api/shortlist/:userId
// @access  Private
const removeFromShortlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const shortlist = await Shortlist.findOneAndDelete({
      userId: req.user._id,
      shortlistedUserId: userId
    });

    if (!shortlist) {
      return res.status(404).json({
        success: false,
        message: 'User not in shortlist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User removed from shortlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get user's shortlist
// @route   GET /api/shortlist
// @access  Private
const getShortlist = async (req, res) => {
  try {
    const shortlist = await Shortlist.find({ userId: req.user._id })
      .populate('shortlistedUserId', '-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shortlist.length,
      data: shortlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Check if user is shortlisted
// @route   GET /api/shortlist/check/:userId
// @access  Private
const checkShortlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const shortlist = await Shortlist.findOne({
      userId: req.user._id,
      shortlistedUserId: userId
    });

    res.status(200).json({
      success: true,
      isShortlisted: !!shortlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  addToShortlist,
  removeFromShortlist,
  getShortlist,
  checkShortlist
};
