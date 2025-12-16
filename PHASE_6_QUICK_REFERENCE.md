# 🚀 Phase 6 - Quick Reference Card

## ⚡ Quick Start

### Start Backend
```bash
cd backend
node server.js
```

### Test in Browser
```bash
# Open in browser:
backend/test-messaging.html
```

---

## 🔑 Get JWT Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_EMAIL","password":"YOUR_PASSWORD"}'
```

---

## 📡 REST API Cheat Sheet

### Get Conversations
```bash
GET /api/messages/conversations
Headers: Authorization: Bearer TOKEN
```

### Get Messages with User
```bash
GET /api/messages/:userId
Headers: Authorization: Bearer TOKEN
```

### Send Message
```bash
POST /api/messages/send
Headers: 
  Authorization: Bearer TOKEN
  Content-Type: application/json
Body: {"receiverId":"USER_ID","content":"Hello!"}
```

### Mark as Read
```bash
PUT /api/messages/:id/read
Headers: Authorization: Bearer TOKEN
```

---

## 🔌 Socket.io Cheat Sheet

### Connect
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});
```

### Listen for Connection
```javascript
socket.on('connect', () => {
  console.log('Connected!');
});
```

### Send Message
```javascript
socket.emit('message:send', {
  receiverId: 'USER_ID',
  content: 'Hello!'
});
```

### Receive Messages
```javascript
socket.on('message:received', (data) => {
  console.log('New message:', data.data);
});
```

### Typing Indicator
```javascript
// Start typing
socket.emit('typing', { receiverId: 'USER_ID', isTyping: true });

// Stop typing
socket.emit('typing', { receiverId: 'USER_ID', isTyping: false });
```

### Listen for Typing
```javascript
socket.on('user:typing', (data) => {
  console.log(`${data.userName} is typing...`);
});
```

### Online Status
```javascript
socket.on('user:online', (data) => {
  console.log(`${data.userName} is online`);
});

socket.on('user:offline', (data) => {
  console.log('User went offline');
});
```

### Read Receipts
```javascript
// Mark as read
socket.emit('message:read', { messageId: 'MESSAGE_ID' });

// Listen for read
socket.on('message:read', (data) => {
  console.log('Message read at:', data.readAt);
});
```

---

## 📁 File Locations

```
backend/
├── models/Message.js                    ← Message schema
├── controllers/messageController.js     ← Business logic
├── routes/message.js                    ← API routes
├── server.js                            ← Socket.io setup
├── test-messaging.html                  ← Test interface
└── verify-messaging.sh                  ← Verification script

Documentation/
├── PHASE_6_MESSAGING_COMPLETE.md        ← Full API docs
├── PHASE_6_SUMMARY.md                   ← Implementation summary
└── PHASE_6_QUICK_REFERENCE.md           ← This file
```

---

## ✅ Verification Commands

### Check if Running
```bash
ps aux | grep "node server.js"
```

### View Logs
```bash
tail -f /tmp/backend.log
```

### Run Verification
```bash
./backend/verify-messaging.sh
```

### Test API
```bash
curl http://localhost:5000/
```

---

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Kill existing process
pkill -f "node server.js"

# Start fresh
cd backend && node server.js
```

### Socket.io Not Connecting
- Check JWT token is valid
- Check CORS settings in server.js
- Check FRONTEND_URL in .env

### Messages Not Sending
- Ensure users have accepted interest
- Check both users are registered
- Verify JWT token in auth header

### Database Errors
- Check MongoDB connection string
- Ensure MongoDB Atlas IP whitelist includes your IP
- Check internet connection

---

## 🎯 Common Use Cases

### Frontend Chat Component
```typescript
// 1. Connect on mount
useEffect(() => {
  const token = localStorage.getItem('token');
  const socket = io('http://localhost:5000', { auth: { token } });
  
  socket.on('message:received', handleNewMessage);
  
  return () => socket.disconnect();
}, []);

// 2. Send message
const sendMessage = (receiverId, content) => {
  socket.emit('message:send', { receiverId, content });
};

// 3. Show typing
const handleTyping = (receiverId) => {
  socket.emit('typing', { receiverId, isTyping: true });
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing', { receiverId, isTyping: false });
  }, 1000);
};
```

---

## 📊 Event Flow Diagram

```
User A                Socket.io Server         User B
  │                          │                   │
  ├─ message:send ──────────>│                   │
  │                          ├─ Save to DB       │
  │<────── message:received──┤                   │
  │                          ├─ message:received─>│
  │                          │                   │
  │                          │<───── message:read─┤
  │<────── message:read ─────┤                   │
  │                          │                   │
```

---

## 🔐 Security Checklist

- [x] JWT authentication on Socket.io connections
- [x] Interest validation before messaging
- [x] Authorization checks for all operations
- [x] CORS properly configured
- [x] Environment variables secured
- [x] Password hashing (existing)
- [x] Token expiry (30 days)

---

## 📈 Performance Tips

1. **Add Pagination**: For conversations with 100+ messages
2. **Use Rooms**: For group chats (future enhancement)
3. **Cache Online Users**: Already using Map (O(1) lookup)
4. **Database Indexes**: Already added for performance
5. **Lazy Loading**: Load older messages on scroll

---

## 🎉 Quick Stats

- **Files Created**: 5
- **API Endpoints**: 4 REST + 8 Socket.io events
- **Lines of Code**: ~800
- **Features**: 9 major features
- **Time to Implement**: 1 session
- **Status**: ✅ COMPLETE & WORKING

---

**Made with ❤️ for EternalBond Matrimony Platform**

**Phase 6: Messaging System - COMPLETE! 🎊**
