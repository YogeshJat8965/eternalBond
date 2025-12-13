const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update current user's profile
// @route   PUT /api/profile/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      dateOfBirth,
      city,
      state,
      country,
      religion,
      caste,
      subCaste,
      motherTongue,
      education,
      profession,
      annualIncome,
      height,
      complexion,
      foodHabits,
      maritalStatus,
      bio
    } = req.body;

    // Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields (only if provided)
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (city) user.city = city;
    if (state) user.state = state;
    if (country) user.country = country;
    if (religion) user.religion = religion;
    if (caste) user.caste = caste;
    if (subCaste) user.subCaste = subCaste;
    if (motherTongue) user.motherTongue = motherTongue;
    if (education) user.education = education;
    if (profession) user.profession = profession;
    if (annualIncome) user.annualIncome = annualIncome;
    if (height) user.height = height;
    if (complexion) user.complexion = complexion;
    if (foodHabits) user.foodHabits = foodHabits;
    if (maritalStatus) user.maritalStatus = maritalStatus;
    if (bio) user.bio = bio;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Upload profile photo
// @route   POST /api/profile/upload-photo
// @access  Private
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    // If setting as profile picture (first upload or specified)
    if (!user.profilePicture || req.body.isProfilePicture === 'true') {
      user.profilePicture = photoUrl;
    }

    // Check if user already has 5 photos
    if (user.photos.length >= 5) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 photos allowed. Please delete a photo first.'
      });
    }

    // Add to photos array
    user.photos.push(photoUrl);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        photoUrl,
        profilePicture: user.profilePicture,
        photos: user.photos
      }
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete a photo
// @route   DELETE /api/profile/photo/:index
// @access  Private
const deletePhoto = async (req, res) => {
  try {
    const { index } = req.params;
    const photoIndex = parseInt(index);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (photoIndex < 0 || photoIndex >= user.photos.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid photo index'
      });
    }

    // Get photo path
    const photoPath = user.photos[photoIndex];
    const fullPath = path.join(__dirname, '..', photoPath);

    // Delete file from filesystem
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Remove from photos array
    user.photos.splice(photoIndex, 1);

    // If deleted photo was profile picture, set first photo as profile picture
    if (user.profilePicture === photoPath) {
      user.profilePicture = user.photos.length > 0 ? user.photos[0] : '';
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully',
      data: {
        profilePicture: user.profilePicture,
        photos: user.photos
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get another user's profile
// @route   GET /api/profile/:id
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is active and email verified
    if (!user.isActive || !user.isEmailVerified) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  uploadPhoto,
  deletePhoto,
  getUserProfile
};
