const Admin = require('../models/Admin');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Interest = require('../models/Interest');
const { generateToken } = require('../utils/jwt');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated'
      });
    }

    // Check password
    const isPasswordCorrect = await admin.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      isActive = '',
      isEmailVerified = '',
      gender = ''
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }
    
    if (isEmailVerified !== '') {
      query.isEmailVerified = isEmailVerified === 'true';
    }
    
    if (gender) {
      query.gender = gender;
    }

    // Execute query with pagination
    const users = await User.find(query)
      .select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's interests
    const sentInterests = await Interest.countDocuments({ senderId: user._id });
    const receivedInterests = await Interest.countDocuments({ receiverId: user._id });
    const acceptedInterests = await Interest.countDocuments({
      $or: [
        { senderId: user._id, status: 'accepted' },
        { receiverId: user._id, status: 'accepted' }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          sentInterests,
          receivedInterests,
          acceptedInterests
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fields that can be updated by admin
    const allowedFields = [
      'name', 'gender', 'dateOfBirth', 'phone', 'city', 'state', 'country',
      'religion', 'caste', 'subCaste', 'motherTongue', 'education',
      'profession', 'annualIncome', 'height', 'complexion', 'foodHabits',
      'maritalStatus', 'bio', 'isActive', 'isEmailVerified'
    ];

    // Update only allowed fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Super Admin only)
const deleteUser = async (req, res) => {
  try {
    // Check if admin is super-admin
    if (req.admin.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super-admin can delete users'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if hard delete is requested (query param: ?permanent=true)
    const isPermanent = req.query.permanent === 'true';

    if (isPermanent) {
      // Hard delete - completely remove user and all associated data
      
      // Clear all tokens
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      
      // Delete user from database
      await User.findByIdAndDelete(req.params.id);
      
      // TODO: Also delete related data (interests, messages, etc.)
      // const Interest = require('../models/Interest');
      // await Interest.deleteMany({ $or: [{ senderId: req.params.id }, { receiverId: req.params.id }] });
      
      res.status(200).json({
        success: true,
        message: 'User permanently deleted. Email and phone are now available for re-registration.'
      });
    } else {
      // Soft delete - set isActive to false and clear tokens
      user.isActive = false;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'User deactivated successfully. Use ?permanent=true to permanently delete.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all contacts
// @route   GET /api/admin/contacts
// @access  Private (Admin)
const getAllContacts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = ''
    } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalContacts: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update contact status
// @route   PUT /api/admin/contacts/:id
// @access  Private (Admin)
const updateContactStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    if (status) {
      contact.status = status;
    }

    if (adminResponse) {
      contact.adminResponse = adminResponse;
    }

    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all interests
// @route   GET /api/admin/interests
// @access  Private (Admin)
const getAllInterests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = ''
    } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const interests = await Interest.find(query)
      .populate('senderId', 'name email gender city state')
      .populate('receiverId', 'name email gender city state')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Interest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: interests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalInterests: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    // Count users
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    
    // Count by gender
    const maleUsers = await User.countDocuments({ gender: 'male' });
    const femaleUsers = await User.countDocuments({ gender: 'female' });

    // Count interests
    const totalInterests = await Interest.countDocuments();
    const pendingInterests = await Interest.countDocuments({ status: 'pending' });
    const acceptedInterests = await Interest.countDocuments({ status: 'accepted' });
    const rejectedInterests = await Interest.countDocuments({ status: 'rejected' });

    // Count contacts
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const inProgressContacts = await Contact.countDocuments({ status: 'in-progress' });
    const resolvedContacts = await Contact.countDocuments({ status: 'resolved' });

    // Count photos
    const usersWithPhotos = await User.countDocuments({ photos: { $exists: true, $ne: [] } });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          verified: verifiedUsers,
          male: maleUsers,
          female: femaleUsers
        },
        interests: {
          total: totalInterests,
          pending: pendingInterests,
          accepted: acceptedInterests,
          rejected: rejectedInterests
        },
        contacts: {
          total: totalContacts,
          new: newContacts,
          inProgress: inProgressContacts,
          resolved: resolvedContacts
        },
        photos: {
          usersWithPhotos
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  adminLogin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllContacts,
  updateContactStatus,
  getAllInterests,
  getDashboardStats
};
