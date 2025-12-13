# Complete Backend Strategy - Simple & Practical
## Matrimony Platform - Full Implementation (No MVP)

**Philosophy:** Simple, clean, working code - no complex algorithms  
**Approach:** Build all features in phases, messaging & payments at the end  
**Tech Stack:** Express.js + MongoDB + JWT + Multer + NodeMailer

---

## TABLE OF CONTENTS

1. [Project Structure](#1-project-structure)
2. [Database Schemas (6 Models)](#2-database-schemas)
3. [All API Endpoints (35 APIs)](#3-all-api-endpoints)
4. [Implementation Phases](#4-implementation-phases)
5. [Phase 6: Messaging System](#5-phase-6-messaging-system)
6. [Phase 7: Payment Gateway](#6-phase-7-payment-gateway)

---

## 1. PROJECT STRUCTURE

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── models/
│   ├── User.js                  # User + Profile combined
│   ├── Interest.js              # Interest requests (like/shortlist)
│   ├── Contact.js               # Contact form submissions
│   ├── Admin.js                 # Admin users
│   ├── Message.js               # Chat messages (Phase 6)
│   └── Payment.js               # Payment transactions (Phase 7)
├── controllers/
│   ├── authController.js        # Register, Login, Verify email
│   ├── profileController.js     # Get, Update, Upload photos
│   ├── searchController.js      # Search & filter members
│   ├── interestController.js    # Send/Accept/Reject interests
│   ├── contactController.js     # Contact form
│   ├── adminController.js       # Admin operations
│   ├── messageController.js     # Chat (Phase 6)
│   └── paymentController.js     # Razorpay (Phase 7)
├── routes/
│   ├── auth.js
│   ├── profile.js
│   ├── search.js
│   ├── interest.js
│   ├── contact.js
│   ├── admin.js
│   ├── message.js               # Phase 6
│   └── payment.js               # Phase 7
├── middleware/
│   ├── auth.js                  # JWT verification
│   ├── upload.js                # Multer for images
│   └── errorHandler.js          # Error handling
├── utils/
│   ├── jwt.js                   # Generate JWT tokens
│   └── sendEmail.js             # NodeMailer email sender
├── uploads/                     # Local file storage (profile images)
├── .env
├── server.js
└── package.json
```

**Total: ~20 files** (simple, no over-engineering)

---

## 2. DATABASE SCHEMAS

### 2.1 User Model (Combined User + Profile)

**File:** `models/User.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // ============ Authentication ============
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  
  // ============ Basic Info ============
  name: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  
  // ============ Location ============
  city: {
    type: String,
    required: true
  },
  state: String,
  country: {
    type: String,
    default: 'India'
  },
  
  // ============ Religion & Culture ============
  religion: {
    type: String,
    enum: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']
  },
  caste: String,
  subCaste: String,
  motherTongue: String,
  
  // ============ Professional Details ============
  education: {
    type: String,
    enum: ['High School', 'Bachelors', 'Masters', 'PhD', 'Diploma', 'Other']
  },
  profession: String,
  annualIncome: {
    type: String,
    enum: ['0-2 Lakhs', '2-5 Lakhs', '5-10 Lakhs', '10-20 Lakhs', '20+ Lakhs']
  },
  
  // ============ Physical Attributes ============
  height: {
    type: String,
    required: true
  },
  complexion: {
    type: String,
    enum: ['Fair', 'Wheatish', 'Dusky', 'Dark']
  },
  
  // ============ Lifestyle ============
  foodHabits: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian']
  },
  
  // ============ Marital Status ============
  maritalStatus: {
    type: String,
    enum: ['Never Married', 'Divorced', 'Widowed'],
    required: true
  },
  
  // ============ Profile Picture ============
  profilePicture: {
    type: String,
    default: ''
  },
  photos: [{
    type: String
  }], // Max 5 photos
  
  // ============ About ============
  bio: {
    type: String,
    maxlength: 500
  },
  
  // ============ Verification ============
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  
  // ============ Password Reset ============
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // ============ Account Status ============
  isActive: {
    type: Boolean,
    default: true
  },
  
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

### 2.2 Interest Model

**File:** `models/Interest.js`

```javascript
const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: 500
  }
}, { timestamps: true });

// Prevent duplicate interests
interestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

module.exports = mongoose.model('Interest', interestSchema);
```

---

### 2.3 Contact Model

**File:** `models/Contact.js`

```javascript
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved'],
    default: 'new'
  },
  adminResponse: String
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
```

---

### 2.4 Admin Model

**File:** `models/Admin.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
```

---

### 2.5 Message Model (Phase 6)

**File:** `models/Message.js`

```javascript
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
```

---

### 2.6 Payment Model (Phase 7)

**File:** `models/Payment.js`

```javascript
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  paymentMethod: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  planType: {
    type: String,
    enum: ['Free', 'Silver', 'Gold']
  },
  validFrom: Date,
  validTo: Date
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
```

---

## 3. ALL API ENDPOINTS

### 3.1 Authentication Routes (`/api/auth`)

```javascript
POST   /api/auth/register              // User registration
POST   /api/auth/login                 // User login
GET    /api/auth/verify-email/:token   // Verify email
POST   /api/auth/forgot-password       // Send reset link
POST   /api/auth/reset-password        // Reset password
GET    /api/auth/me                    // Get current user
```

---

### 3.2 Profile Routes (`/api/profile`)

```javascript
GET    /api/profile/me                 // Get own profile
PUT    /api/profile/me                 // Update profile
GET    /api/profile/:id                // View another user's profile
POST   /api/profile/upload-photo       // Upload profile picture
DELETE /api/profile/photo/:index       // Delete a photo
```

---

### 3.3 Search Routes (`/api/search`)

```javascript
GET    /api/search                     // Search members with filters
                                       // Query params: gender, ageFrom, ageTo,
                                       // religion, location, profession, etc.
```

---

### 3.4 Interest Routes (`/api/interests`)

```javascript
POST   /api/interests/send             // Send interest request
GET    /api/interests/received         // View received interests
GET    /api/interests/sent             // View sent interests
PUT    /api/interests/:id/accept       // Accept interest
PUT    /api/interests/:id/reject       // Reject interest
DELETE /api/interests/:id              // Cancel sent interest
```

---

### 3.5 Contact Routes (`/api/contact`)

```javascript
POST   /api/contact                    // Submit contact form
```

---

### 3.6 Admin Routes (`/api/admin`)

```javascript
POST   /api/admin/login                // Admin login
GET    /api/admin/users                // List all users
GET    /api/admin/users/:id            // Get user details
PUT    /api/admin/users/:id            // Update user
DELETE /api/admin/users/:id            // Delete user
GET    /api/admin/contacts             // View contact submissions
PUT    /api/admin/contacts/:id         // Update contact status
GET    /api/admin/interests            // View all interests
GET    /api/admin/stats                // Dashboard statistics
```

---

### 3.7 Message Routes (`/api/messages`) - Phase 6

```javascript
GET    /api/messages/conversations     // Get all conversations
GET    /api/messages/:userId           // Get messages with specific user
POST   /api/messages/send              // Send message
PUT    /api/messages/:id/read          // Mark as read
```

---

### 3.8 Payment Routes (`/api/payments`) - Phase 7

```javascript
POST   /api/payments/create-order      // Create Razorpay order
POST   /api/payments/verify            // Verify payment
GET    /api/payments/history           // Payment history
```

**Total: 35 API Endpoints**

---

## 4. IMPLEMENTATION PHASES

### **Phase 1: Project Setup & Database**

**Files to create:**
1. `package.json` - Initialize with dependencies
2. `.env` - Environment variables
3. `server.js` - Express server setup
4. `config/db.js` - MongoDB connection

**Dependencies:**
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5",
  "nodemailer": "^6.9.4"
}
```

**Implementation Steps:**

**Step 1:** Initialize project and install dependencies
- [ ] Create `backend` folder, run `npm init -y`
- [ ] Install: `npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer nodemailer`
- [ ] Create folder structure: `config/`, `models/`, `controllers/`, `routes/`, `middleware/`, `utils/`, `uploads/`

**Step 2:** Setup server and database
- [ ] Create `.env` file with all environment variables
- [ ] Create `config/db.js` with MongoDB connection
- [ ] Create `server.js` with Express setup and CORS

**Step 3:** Test the setup
- [ ] Run `node server.js`
- [ ] Verify "MongoDB Connected" message
- [ ] Test API is running on http://localhost:5000

---

### **Phase 2: Authentication System**

**Files to create:**
1. `models/User.js` - User schema
2. `controllers/authController.js` - Auth logic
3. `routes/auth.js` - Auth routes
4. `middleware/auth.js` - JWT middleware
5. `utils/jwt.js` - Token generation
6. `utils/sendEmail.js` - Email sender

**Implementation Steps:**

**Step 1:** Create User model and utilities
- [ ] Create `models/User.js` with complete schema (auth, profile, verification fields)
- [ ] Create `utils/jwt.js` for token generation
- [ ] Create `utils/sendEmail.js` for email notifications
- [ ] Create `middleware/auth.js` for JWT verification

**Step 2:** Build authentication controller and routes
- [ ] Create `controllers/authController.js` with all functions: register, login, verifyEmail, forgotPassword, resetPassword, getMe
- [ ] Create `routes/auth.js` with all endpoints
- [ ] Connect routes in `server.js`: `app.use('/api/auth', authRoutes)`

**Step 3:** Test authentication flow
- [ ] Test registration → Verify email sent
- [ ] Test email verification → User verified
- [ ] Test login → JWT token received
- [ ] Test protected route (getMe) → User data returned

---

### **Phase 3: Profile Management**

**Files to create:**
1. `controllers/profileController.js` - Profile logic
2. `routes/profile.js` - Profile routes
3. `middleware/upload.js` - Multer configuration

**Implementation Steps:**

**Step 1:** Setup file upload and profile controller
- [ ] Create `middleware/upload.js` with Multer configuration (5MB limit, images only)
- [ ] Create `controllers/profileController.js`: getMyProfile, updateProfile, uploadPhoto, deletePhoto, getUserProfile
- [ ] Configure static serving in `server.js`: `app.use('/uploads', express.static('uploads'))`

**Step 2:** Create profile routes
- [ ] Create `routes/profile.js` with all endpoints (GET /me, PUT /me, POST /upload-photo, DELETE /photo/:index, GET /:id)
- [ ] Connect routes in `server.js`: `app.use('/api/profile', profileRoutes)`

**Step 3:** Test profile management
- [ ] Test GET /api/profile/me → Profile returned
- [ ] Test PUT /api/profile/me → Profile updated
- [ ] Test POST /api/profile/upload-photo → Photo uploaded (max 5)
- [ ] Test DELETE /api/profile/photo/0 → Photo deleted

---

### **Phase 4: Search & Browse Members**

**Files to create:**
1. `controllers/searchController.js` - Search logic
2. `routes/search.js` - Search routes

**Implementation Steps:**

**Step 1:** Create search controller with filters
- [ ] Create `controllers/searchController.js`
- [ ] Build searchMembers function with all filters: gender, age range, religion, city, profession, height, maritalStatus, education, income, etc.
- [ ] Add pagination (page, limit) and sorting logic

**Step 2:** Create routes and test
- [ ] Create `routes/search.js` with GET / endpoint
- [ ] Connect in `server.js`: `app.use('/api/search', searchRoutes)`
- [ ] Test with various filters: ?gender=male&ageFrom=25&city=Mumbai&page=1
- [ ] Verify pagination and filtering work correctly

---

### **Phase 5: Interest System**

**Files to create:**
1. `models/Interest.js` - Interest schema
2. `controllers/interestController.js` - Interest logic
3. `routes/interest.js` - Interest routes

**Implementation Steps:**

**Step 1:** Create Interest model and controller
- [ ] Create `models/Interest.js` with schema (senderId, receiverId, status, message)
- [ ] Add unique compound index on senderId + receiverId
- [ ] Create `controllers/interestController.js`: sendInterest, getReceived, getSent, acceptInterest, rejectInterest, cancelInterest
- [ ] Add email notifications in sendInterest and acceptInterest

**Step 2:** Create routes and test
- [ ] Create `routes/interest.js` with all endpoints
- [ ] Connect in `server.js`: `app.use('/api/interests', interestRoutes)`
- [ ] Test: Send interest → Email received → Accept/Reject → Status updated
- [ ] Verify duplicate prevention and authorization

---

### **Phase 5.1: Contact Form & Admin**

**Files to create:**
1. `models/Contact.js` - Contact schema
2. `models/Admin.js` - Admin schema
3. `controllers/contactController.js` - Contact logic
4. `controllers/adminController.js` - Admin logic
5. `routes/contact.js` - Contact routes
6. `routes/admin.js` - Admin routes

**Features:**

**Implementation Steps:**

**Step 1:** Create Contact, Admin models and contact feature
- [ ] Create `models/Contact.js` with schema
- [ ] Create `models/Admin.js` with schema and password hashing
- [ ] Create `controllers/contactController.js`: submitContact (with email notification)
- [ ] Create `routes/contact.js` and connect: `app.use('/api/contact', contactRoutes)`

**Step 2:** Build admin authentication and controllers
- [ ] Create `middleware/admin.js` for admin JWT verification
- [ ] Create `controllers/adminController.js`: adminLogin, getAllUsers, getUserById, updateUser, deleteUser, getAllContacts, updateContactStatus, getAllInterests, getDashboardStats
- [ ] Create seed admin script: `seed-admin.js` (email: admin@matrimony.com, password: Admin@123)

**Step 3:** Create admin routes and test
- [ ] Create `routes/admin.js` with all admin endpoints
- [ ] Connect in `server.js`: `app.use('/api/admin', adminRoutes)`
- [ ] Run seed script: `node seed-admin.js`
- [ ] Test: Admin login → Manage users → View contacts → Dashboard stats

---

## 5. PHASE 6: MESSAGING SYSTEM

**When:** After Phase 1-5 completed  
**Approach:** Simple real-time chat using Socket.io

### Files to Add:
1. `models/Message.js` - Message schema
2. `controllers/messageController.js` - Chat logic
3. `routes/message.js` - Message routes
4. `socket.js` - Socket.io setup

### Additional Dependencies:
```bash
npm install socket.io
```

### Features:
- Real-time one-on-one chat
- See conversation list
- Unread message count
- Mark messages as read
- Only users with accepted interests can chat

### Socket Events:
```javascript
// Connection
socket.on('user:connect', (userId) => { ... });

// Send Message
socket.on('message:send', (data) => { ... });

// Typing Indicator
socket.on('typing', (data) => { ... });

// Disconnect
socket.on('disconnect', () => { ... });
```

### API Endpoints (4):
```javascript
GET    /api/messages/conversations     // List all chats
GET    /api/messages/:userId           // Get messages with user
POST   /api/messages/send              // Send message
PUT    /api/messages/:id/read          // Mark as read
```

---

## 6. PHASE 7: PAYMENT GATEWAY

**When:** After Phase 6 completed  
**Approach:** Razorpay integration for subscriptions

### Files to Add:
1. `models/Payment.js` - Payment schema
2. `controllers/paymentController.js` - Payment logic
3. `routes/payment.js` - Payment routes

### Additional Dependencies:
```bash
npm install razorpay
```

### Plan Types:
| Plan   | Price    | Features                           |
|--------|----------|------------------------------------|
| Free   | ₹0       | View profiles, Send 5 interests    |
| Silver | ₹999/mo  | Unlimited interests, Chat          |
| Gold   | ₹2499/mo | Everything + Priority support      |

### Features:
- Create Razorpay order
- Payment verification
- Update user plan on success
- Payment history
- Auto-expire plans after validity

### API Endpoints (3):
```javascript
POST   /api/payments/create-order      // Create Razorpay order
POST   /api/payments/verify            // Verify payment signature
GET    /api/payments/history           // User's payment history
```

### Razorpay Integration:
```javascript
// Create Order
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const options = {
  amount: 99900, // in paise (₹999)
  currency: 'INR',
  receipt: 'order_' + Date.now()
};

const order = await razorpay.orders.create(options);
```

---

## ENVIRONMENT VARIABLES

**File:** `.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/matrimony
# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/matrimony

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Razorpay (Phase 7)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

---

## IMPLEMENTATION TIMELINE

| Phase | Features | Time Estimate |
|-------|----------|---------------|
| 1 | Setup + Database | 1 session |
| 2 | Authentication | 1-2 sessions |
| 3 | Profile Management | 1 session |
| 4 | Search Members | 1 session |
| 5 | Interest System + Contact + Admin | 1-2 sessions |
| 6 | Messaging System | 1-2 sessions |
| 7 | Payment Gateway | 1-2 sessions |

**Total: 8-11 sessions** (manageable, no complexity)

---

## WHAT'S INCLUDED

✅ User registration & login  
✅ Email verification  
✅ Profile creation & editing  
✅ Photo upload (5 photos max)  
✅ Search members with 10+ filters  
✅ Send/Accept/Reject interests  
✅ Email notifications  
✅ Contact form  
✅ Full admin panel  
✅ Real-time messaging (Phase 6)  
✅ Payment gateway (Phase 7)  

---

## WHAT'S NOT INCLUDED (To Keep Simple)

❌ AI matching algorithms  
❌ Horoscope matching  
❌ Video calls  
❌ Advanced analytics  
❌ Success stories CRUD (frontend has static data)  
❌ Testimonials CRUD (frontend has static data)  
❌ Cloud storage (using local uploads)  
❌ SMS OTP (using email verification only)  
❌ Social login (Google/Facebook)  

---

## TESTING CHECKLIST

**Phase 1-5:**
- [ ] Register user → Email verification received
- [ ] Verify email → Can login
- [ ] Login → JWT token received
- [ ] Update profile → Changes saved
- [ ] Upload photo → Photo visible
- [ ] Search members → Filters work correctly
- [ ] Send interest → Email notification sent
- [ ] Accept interest → Both users notified
- [ ] Reject interest → Status updated
- [ ] Contact form → Admin receives
- [ ] Admin login → Dashboard accessible
- [ ] Admin CRUD → Can manage users

**Phase 6 (Messaging):**
- [ ] Send message → Appears in real-time
- [ ] Receive message → Notification shown
- [ ] Mark as read → Unread count updates
- [ ] Typing indicator → Shows when typing

**Phase 7 (Payments):**
- [ ] Create order → Razorpay opens
- [ ] Complete payment → User plan updated
- [ ] Payment history → Shows all transactions
- [ ] Plan expiry → Reverts to Free plan

---

## NEXT STEPS

1. **Get your approval** on this strategy
2. **Start Phase 1:** Project setup
3. **Build incrementally:** One phase at a time
4. **Test each phase:** Before moving to next
5. **Phase 6 & 7:** Add at the end

**Ready to start building? Just say "start phase 1" and we'll begin!**

---

**Last Updated:** December 2025  
**Version:** Simple & Complete Backend
