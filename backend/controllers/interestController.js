const Interest = require('../models/Interest');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');

// @desc    Send interest request
// @route   POST /api/interests/send
// @access  Private
const sendInterest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID is required'
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Can't send interest to yourself
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send interest to yourself'
      });
    }

    // Check if interest already exists
    const existingInterest = await Interest.findOne({
      senderId: req.user._id,
      receiverId: receiverId
    });

    if (existingInterest) {
      return res.status(400).json({
        success: false,
        message: 'Interest already sent to this user'
      });
    }

    // Create interest
    const interest = await Interest.create({
      senderId: req.user._id,
      receiverId: receiverId,
      message: message || ''
    });

    // Send email notification to receiver
    const emailHtml = `
      <h1>New Interest Received!</h1>
      <p>Hi ${receiver.name},</p>
      <p><strong>${req.user.name}</strong> has expressed interest in your profile.</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      <p>View their profile and respond: ${process.env.FRONTEND_URL}/profile/${req.user._id}</p>
      <p>Login to accept or reject: ${process.env.FRONTEND_URL}/login</p>
    `;

    try {
      await sendEmail(receiver.email, 'New Interest Received - Eternal Bond', emailHtml);
    } catch (emailError) {
      console.log('Email notification failed:', emailError.message);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Interest sent successfully',
      data: interest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get received interests
// @route   GET /api/interests/received
// @access  Private
const getReceivedInterests = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { receiverId: req.user._id };
    if (status) {
      query.status = status;
    }

    const interests = await Interest.find(query)
      .populate('senderId', '-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interests.length,
      data: interests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get sent interests
// @route   GET /api/interests/sent
// @access  Private
const getSentInterests = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { senderId: req.user._id };
    if (status) {
      query.status = status;
    }

    const interests = await Interest.find(query)
      .populate('receiverId', '-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interests.length,
      data: interests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Accept interest
// @route   PUT /api/interests/:id/accept
// @access  Private
const acceptInterest = async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id).populate('senderId', 'name email');

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: 'Interest not found'
      });
    }

    // Check if current user is the receiver
    if (interest.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this interest'
      });
    }

    // Check if already accepted or rejected
    if (interest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Interest already ${interest.status}`
      });
    }

    // Update status
    interest.status = 'accepted';
    await interest.save();

    // Send email notification to sender
    const emailHtml = `
      <h1>Interest Accepted! 🎉</h1>
      <p>Hi ${interest.senderId.name},</p>
      <p><strong>${req.user.name}</strong> has accepted your interest!</p>
      <p>You can now start messaging: ${process.env.FRONTEND_URL}/messages/${req.user._id}</p>
      <p>View their profile: ${process.env.FRONTEND_URL}/profile/${req.user._id}</p>
    `;

    try {
      await sendEmail(interest.senderId.email, 'Interest Accepted - Eternal Bond', emailHtml);
    } catch (emailError) {
      console.log('Email notification failed:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Interest accepted successfully',
      data: interest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Reject interest
// @route   PUT /api/interests/:id/reject
// @access  Private
const rejectInterest = async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id);

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: 'Interest not found'
      });
    }

    // Check if current user is the receiver
    if (interest.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this interest'
      });
    }

    // Check if already accepted or rejected
    if (interest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Interest already ${interest.status}`
      });
    }

    // Update status
    interest.status = 'rejected';
    await interest.save();

    res.status(200).json({
      success: true,
      message: 'Interest rejected',
      data: interest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Cancel sent interest
// @route   DELETE /api/interests/:id
// @access  Private
const cancelInterest = async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id);

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: 'Interest not found'
      });
    }

    // Check if current user is the sender
    if (interest.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this interest'
      });
    }

    // Can only cancel pending interests
    if (interest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${interest.status} interest`
      });
    }

    await interest.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Interest cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  acceptInterest,
  rejectInterest,
  cancelInterest
};
