const User = require('../models/User');
const crypto = require('crypto');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/sendEmail');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, phone, name, gender, dateOfBirth, city, maritalStatus, height } = req.body;

    // Validate required fields
    const requiredFields = {
      name: 'Name',
      email: 'Email',
      password: 'Password',
      phone: 'Phone number',
      gender: 'Gender',
      dateOfBirth: 'Date of birth',
      city: 'City',
      maritalStatus: 'Marital status',
      height: 'Height'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists (only active users)
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }],
      isActive: { $ne: false } // Only check active users
    });
    
    if (existingUser) {
      const fieldMatch = existingUser.email === email ? 'email' : 'phone number';
      return res.status(400).json({
        success: false,
        message: `User with this ${fieldMatch} already exists. Please ${fieldMatch === 'email' ? 'login' : 'use a different phone number'}.`
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const user = await User.create({
      email,
      password,
      phone,
      name,
      gender,
      dateOfBirth,
      city,
      maritalStatus,
      height,
      verificationToken,
      verificationTokenExpires
    });

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const emailHtml = `
      <h1>Welcome to Eternal Bond!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for registering. Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `;

    try {
      await sendEmail(email, 'Verify Your Email - Eternal Bond', emailHtml);
    } catch (emailError) {
      console.log('Email sending failed:', emailError.message);
      // Continue registration even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    console.log('=== Email Verification Debug ===');
    console.log('Token received:', token);
    console.log('Token length:', token?.length);

    // Find user with valid token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      // Try to find if token exists but expired
      const expiredUser = await User.findOne({ verificationToken: token });
      
      if (expiredUser) {
        console.log('❌ Token exists but expired for user:', expiredUser.email);
        console.log('Token expired at:', new Date(expiredUser.verificationTokenExpires));
        console.log('Current time:', new Date());
        
        return res.status(400).json({
          success: false,
          message: 'Verification token has expired. Please request a new verification email.'
        });
      }
      
      // Check if any user had this token before (already verified)
      // Search for users with no verification token but who were created recently
      const recentlyVerifiedUsers = await User.find({
        isEmailVerified: true,
        verificationToken: { $exists: false },
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      }).select('email');
      
      if (recentlyVerifiedUsers.length > 0) {
        console.log('ℹ️ Found recently verified users, token likely already used');
        return res.status(200).json({
          success: true,
          message: 'This email has already been verified! You can login now.'
        });
      }
      
      // Token doesn't exist at all
      console.log('❌ No user found with this token');
      console.log('Checking all users with verification tokens...');
      const allUsersWithTokens = await User.find({ 
        verificationToken: { $exists: true, $ne: null } 
      }).select('email verificationToken verificationTokenExpires');
      console.log('Users with active verification tokens:', allUsersWithTokens.length);
      
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token. The link may be incorrect or you may have already verified your email.'
      });
    }

    console.log('✅ User found:', user.email);
    console.log('Already verified?', user.isEmailVerified);

    // Check if already verified
    if (user.isEmailVerified) {
      console.log('⚠️ User already verified, clearing token');
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: 'Email already verified! You can login now.'
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    console.log('✅ Email verified successfully for:', user.email);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now login.'
    });
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during email verification'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

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

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailHtml = `
      <h1>Password Reset Request</h1>
      <p>Hi ${user.name},</p>
      <p>You requested to reset your password. Click the link below to reset:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>Or copy this link: ${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await sendEmail(email, 'Password Reset - Eternal Bond', emailHtml);
      res.status(200).json({
        success: true,
        message: 'Password reset email sent. Please check your inbox.'
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again later.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  getMe,
  forgotPassword,
  resetPassword
};
