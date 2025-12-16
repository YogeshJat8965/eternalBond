const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const searchRoutes = require('./routes/search');
const interestRoutes = require('./routes/interest');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const shortlistRoutes = require('./routes/shortlist');
const faqRoutes = require('./routes/faq');
const testimonialRoutes = require('./routes/testimonial');
const storyRoutes = require('./routes/story');
const messageRoutes = require('./routes/message');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shortlist', shortlistRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/messages', messageRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Matrimony API is running...' });
});

// Socket.io Setup
const Message = require('./models/Message');
const User = require('./models/User');
const Interest = require('./models/Interest');

// Store online users
const onlineUsers = new Map();

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.userName = user.name;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.userName} (${socket.userId})`);
  
  // Add user to online users
  onlineUsers.set(socket.userId, socket.id);
  
  // Emit online status to all users
  io.emit('user:online', {
    userId: socket.userId,
    userName: socket.userName
  });

  // Handle user:connect event
  socket.on('user:connect', (data) => {
    console.log(`User ${socket.userName} joined chat`);
    socket.emit('connected', {
      success: true,
      message: 'Connected to chat server',
      userId: socket.userId
    });
  });

  // Handle message:send event
  socket.on('message:send', async (data) => {
    try {
      const { receiverId, content } = data;

      // Validate input
      if (!receiverId || !content || !content.trim()) {
        socket.emit('message:error', {
          success: false,
          message: 'Receiver ID and content are required'
        });
        return;
      }

      // Check if users have accepted interest
      const hasAcceptedInterest = await Interest.findOne({
        $or: [
          { senderId: socket.userId, receiverId: receiverId, status: 'accepted' },
          { senderId: receiverId, receiverId: socket.userId, status: 'accepted' }
        ]
      });

      if (!hasAcceptedInterest) {
        socket.emit('message:error', {
          success: false,
          message: 'You can only message users who have accepted your interest'
        });
        return;
      }

      // Create message in database
      const message = await Message.create({
        senderId: socket.userId,
        receiverId,
        content: content.trim()
      });

      // Populate sender and receiver details
      await message.populate('senderId', 'name profilePicture');
      await message.populate('receiverId', 'name profilePicture');

      // Send to sender
      socket.emit('message:received', {
        success: true,
        data: message
      });

      // Send to receiver if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('message:received', {
          success: true,
          data: message
        });
      }

      console.log(`💬 Message sent from ${socket.userName} to ${receiverId}`);
    } catch (error) {
      console.error('Socket message error:', error);
      socket.emit('message:error', {
        success: false,
        message: 'Failed to send message'
      });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { receiverId, isTyping } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user:typing', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping
      });
    }
  });

  // Handle message:read event
  socket.on('message:read', async (data) => {
    try {
      const { messageId } = data;
      
      const message = await Message.findById(messageId);
      if (message && message.receiverId.toString() === socket.userId) {
        message.isRead = true;
        message.readAt = new Date();
        await message.save();

        // Notify sender if online
        const senderSocketId = onlineUsers.get(message.senderId.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit('message:read', {
            messageId,
            readAt: message.readAt
          });
        }
      }
    } catch (error) {
      console.error('Socket read message error:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.userName}`);
    onlineUsers.delete(socket.userId);
    
    // Emit offline status to all users
    io.emit('user:offline', {
      userId: socket.userId
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io ready for real-time messaging`);
});
