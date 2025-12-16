const Message = require('../models/Message');
const User = require('../models/User');
const Interest = require('../models/Interest');
const mongoose = require('mongoose');

// Get all conversations for logged-in user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all unique users the current user has messaged with
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', new mongoose.Types.ObjectId(userId)] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', new mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          profilePicture: '$user.profilePicture',
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
};

// Get messages with a specific user
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userId: otherUserId } = req.params;

    // Validate other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if users have accepted interest (optional - can be removed if you want open messaging)
    const hasAcceptedInterest = await Interest.findOne({
      $or: [
        { senderId: userId, receiverId: otherUserId, status: 'accepted' },
        { senderId: otherUserId, receiverId: userId, status: 'accepted' }
      ]
    });

    if (!hasAcceptedInterest) {
      return res.status(403).json({
        success: false,
        message: 'You can only message users who have accepted your interest'
      });
    }

    // Get all messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name profilePicture')
      .populate('receiverId', 'name profilePicture');

    // Mark messages as read that were sent to current user
    await Message.updateMany(
      {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

// Send message (REST API - also handled by Socket.io)
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { receiverId, content } = req.body;

    // Validate input
    if (!receiverId || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and message content are required'
      });
    }

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Check if users have accepted interest
    const hasAcceptedInterest = await Interest.findOne({
      $or: [
        { senderId: userId, receiverId: receiverId, status: 'accepted' },
        { senderId: receiverId, receiverId: userId, status: 'accepted' }
      ]
    });

    if (!hasAcceptedInterest) {
      return res.status(403).json({
        success: false,
        message: 'You can only message users who have accepted your interest'
      });
    }

    // Create message
    const message = await Message.create({
      senderId: userId,
      receiverId,
      content: content.trim()
    });

    // Populate sender and receiver details
    await message.populate('senderId', 'name profilePicture');
    await message.populate('receiverId', 'name profilePicture');

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only receiver can mark as read
    if (message.receiverId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only mark messages sent to you as read'
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read'
    });
  }
};
