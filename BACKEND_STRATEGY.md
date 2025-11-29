# Backend Strategy for Kalyanautsava Matrimony Platform
## Technology Stack: Express.js + MongoDB

---

## 1. PROJECT STRUCTURE

```
backend/
├── config/
│   ├── database.js          # MongoDB connection configuration
│   ├── cloudinary.js        # Image upload configuration
│   ├── email.js             # Email service configuration
│   └── constants.js         # App constants & environment variables
├── models/
│   ├── User.js              # User/Member schema
│   ├── Profile.js           # Detailed profile schema
│   ├── Interest.js          # Interest requests schema
│   ├── Message.js           # Chat messages schema
│   ├── Plan.js              # Subscription plans schema
│   ├── Payment.js           # Payment history schema
│   ├── Story.js             # Success stories schema
│   ├── Testimonial.js       # Testimonials schema
│   ├── Contact.js           # Contact form submissions schema
│   └── Admin.js             # Admin user schema
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User profile management
│   ├── searchController.js  # Search & filter members
│   ├── interestController.js # Interest & match logic
│   ├── messageController.js # Chat functionality
│   ├── planController.js    # Subscription plans
│   ├── paymentController.js # Payment processing
│   ├── storyController.js   # Success stories
│   ├── testimonialController.js # Testimonials
│   ├── contactController.js # Contact form
│   └── adminController.js   # Admin operations
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── searchRoutes.js
│   ├── interestRoutes.js
│   ├── messageRoutes.js
│   ├── planRoutes.js
│   ├── paymentRoutes.js
│   ├── storyRoutes.js
│   ├── testimonialRoutes.js
│   ├── contactRoutes.js
│   └── adminRoutes.js
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── adminAuth.js         # Admin authorization middleware
│   ├── validation.js        # Input validation middleware
│   ├── upload.js            # File upload middleware (multer)
│   ├── errorHandler.js      # Global error handler
│   └── rateLimiter.js       # API rate limiting
├── utils/
│   ├── tokenHelper.js       # JWT token generation/verification
│   ├── emailService.js      # Email sending utility
│   ├── passwordHelper.js    # Password hashing/comparison
│   ├── imageUpload.js       # Cloudinary image upload
│   ├── validator.js         # Custom validation functions
│   └── logger.js            # Winston logger setup
├── services/
│   ├── matchingService.js   # Matching algorithm logic
│   ├── notificationService.js # Push/email notifications
│   └── analyticsService.js  # User analytics
├── server.js                # Express app entry point
└── package.json
```

---

## 2. DATABASE SCHEMA DESIGN

### 2.1 User Schema (Authentication)
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  emailVerified: Boolean (default: false),
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 2.2 Profile Schema (Member Details)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  
  // Basic Information
  fullName: String (required),
  gender: String (enum: ['male', 'female'], required),
  dateOfBirth: Date (required),
  age: Number (calculated),
  religion: String (required),
  caste: String,
  motherTongue: String,
  
  // Location
  country: String (required),
  state: String,
  city: String (required),
  
  // Professional Details
  education: String (required),
  occupation: String (required),
  employedIn: String (enum: ['government', 'private', 'business', 'self-employed']),
  annualIncome: String,
  
  // Physical Attributes
  height: String (required),
  weight: String,
  complexion: String,
  bodyType: String,
  
  // Family Details
  fatherName: String,
  fatherOccupation: String,
  motherName: String,
  motherOccupation: String,
  siblings: Number,
  familyType: String (enum: ['nuclear', 'joint']),
  familyStatus: String (enum: ['middle-class', 'upper-middle-class', 'rich']),
  
  // Marital Status
  maritalStatus: String (enum: ['never-married', 'divorced', 'widowed'], required),
  children: Number (default: 0),
  
  // About & Preferences
  bio: String (max: 500 characters),
  partnerExpectations: String (max: 500 characters),
  hobbies: [String],
  
  // Images
  profilePicture: String (Cloudinary URL, required),
  photos: [String] (max: 5 Cloudinary URLs),
  
  // Verification
  isVerified: Boolean (default: false),
  verifiedBadge: Boolean (default: false),
  
  // Subscription
  currentPlan: String (enum: ['free', 'silver', 'gold'], default: 'free'),
  planExpiry: Date,
  
  // Stats
  profileViews: Number (default: 0),
  interestsReceived: Number (default: 0),
  interestsSent: Number (default: 0),
  
  // Visibility
  isVisible: Boolean (default: true),
  
  createdAt: Date,
  updatedAt: Date
}
```

### 2.3 Interest Schema (Match Requests)
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: 'Profile', required),
  receiverId: ObjectId (ref: 'Profile', required),
  status: String (enum: ['pending', 'accepted', 'rejected'], default: 'pending'),
  message: String (optional),
  sentAt: Date (default: Date.now),
  respondedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 2.4 Message Schema (Chat)
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: 'User', required),
  receiverId: ObjectId (ref: 'User', required),
  content: String (required),
  isRead: Boolean (default: false),
  readAt: Date,
  attachments: [String] (Cloudinary URLs),
  createdAt: Date,
  updatedAt: Date
}
```

### 2.5 Plan Schema (Subscription Plans)
```javascript
{
  _id: ObjectId,
  name: String (enum: ['free', 'silver', 'gold'], required),
  displayName: String (required),
  price: Number (required),
  duration: Number (in days, required),
  features: {
    profileViews: Number,
    interestRequests: Number,
    messageLimit: Number,
    videoCall: Boolean,
    profileHighlight: Boolean,
    verifiedBadge: Boolean,
    prioritySupport: Boolean
  },
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### 2.6 Payment Schema (Transaction History)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  planId: ObjectId (ref: 'Plan', required),
  amount: Number (required),
  currency: String (default: 'INR'),
  paymentMethod: String (enum: ['card', 'upi', 'netbanking']),
  transactionId: String (unique),
  status: String (enum: ['pending', 'success', 'failed'], default: 'pending'),
  paymentGatewayResponse: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### 2.7 Story Schema (Success Stories)
```javascript
{
  _id: ObjectId,
  couple: {
    name1: String (required),
    name2: String (required),
    profilePic1: String (Cloudinary URL),
    profilePic2: String (Cloudinary URL),
    couplePhoto: String (Cloudinary URL, required)
  },
  marriageDate: Date (required),
  location: String (required),
  shortText: String (required, max: 200),
  fullStory: String (required, max: 1000),
  isApproved: Boolean (default: false),
  isFeatured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### 2.8 Testimonial Schema
```javascript
{
  _id: ObjectId,
  name: String (required),
  role: String (required),
  content: String (required, max: 300),
  rating: Number (min: 1, max: 5),
  photo: String (Cloudinary URL),
  isApproved: Boolean (default: false),
  isFeatured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### 2.9 Contact Schema (Contact Form)
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  subject: String (required),
  message: String (required),
  status: String (enum: ['new', 'in-progress', 'resolved'], default: 'new'),
  adminResponse: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2.10 Admin Schema
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: String (enum: ['super-admin', 'moderator'], default: 'moderator'),
  permissions: [String],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. API ENDPOINTS STRUCTURE

### 3.1 Authentication APIs (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify-email` - Email verification
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `POST /logout` - User logout
- `GET /me` - Get current user details

### 3.2 User/Profile APIs (`/api/users`)
- `GET /profile/:id` - Get user profile by ID
- `PUT /profile` - Update own profile
- `POST /profile/upload-photo` - Upload profile photo
- `DELETE /profile/photo/:photoId` - Delete a photo
- `GET /dashboard` - Get user dashboard stats
- `GET /shortlisted` - Get shortlisted profiles
- `POST /shortlist/:profileId` - Add to shortlist
- `DELETE /shortlist/:profileId` - Remove from shortlist

### 3.3 Search/Browse APIs (`/api/search`)
- `GET /members` - Search members with filters
- `GET /featured` - Get featured profiles
- `GET /recent` - Get recently joined members
- `GET /matches` - Get compatible matches (algorithm-based)

### 3.4 Interest APIs (`/api/interests`)
- `POST /send` - Send interest request
- `GET /sent` - Get sent interests
- `GET /received` - Get received interests
- `PUT /:interestId/accept` - Accept interest
- `PUT /:interestId/reject` - Reject interest
- `DELETE /:interestId` - Cancel sent interest

### 3.5 Messaging APIs (`/api/messages`)
- `GET /conversations` - Get all conversations
- `GET /conversation/:userId` - Get messages with specific user
- `POST /send` - Send message
- `PUT /:messageId/read` - Mark message as read
- `DELETE /:messageId` - Delete message

### 3.6 Plans APIs (`/api/plans`)
- `GET /` - Get all active plans
- `GET /:planId` - Get specific plan details

### 3.7 Payment APIs (`/api/payments`)
- `POST /create-order` - Create payment order
- `POST /verify` - Verify payment
- `GET /history` - Get payment history

### 3.8 Success Stories APIs (`/api/stories`)
- `GET /` - Get all approved stories
- `GET /:storyId` - Get story by ID
- `POST /submit` - Submit a success story
- `PUT /:storyId` - Update story (admin)
- `DELETE /:storyId` - Delete story (admin)

### 3.9 Testimonials APIs (`/api/testimonials`)
- `GET /` - Get all approved testimonials
- `POST /submit` - Submit a testimonial

### 3.10 Contact APIs (`/api/contact`)
- `POST /submit` - Submit contact form
- `GET /` - Get all submissions (admin)
- `PUT /:contactId` - Update contact status (admin)

### 3.11 Admin APIs (`/api/admin`)
- `POST /login` - Admin login
- `GET /users` - Get all users with filters
- `PUT /users/:userId/verify` - Verify user profile
- `PUT /users/:userId/block` - Block/unblock user
- `DELETE /users/:userId` - Delete user
- `GET /payments` - View all payments
- `GET /analytics` - Get platform analytics
- `PUT /stories/:storyId/approve` - Approve story
- `PUT /testimonials/:testimonialId/approve` - Approve testimonial

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Project Setup & Basic Auth (Steps 1-3)
**Step 1:** Initialize Express.js project
- Create package.json
- Install dependencies (express, mongoose, dotenv, cors, etc.)
- Setup folder structure

**Step 2:** MongoDB connection setup
- Create database.js config
- Setup MongoDB Atlas/Local connection
- Test connection

**Step 3:** User authentication system
- Create User model
- Implement registration endpoint
- Implement login endpoint with JWT
- Create auth middleware
- Implement email verification

### Phase 2: Profile Management (Steps 4-6)
**Step 4:** Profile model & basic CRUD
- Create Profile schema
- Create profile after registration
- Get profile endpoint
- Update profile endpoint

**Step 5:** Image upload functionality
- Setup Cloudinary
- Create upload middleware
- Profile photo upload endpoint
- Multiple photos upload endpoint

**Step 6:** Profile visibility & search
- Create search/filter endpoint

### Phase 3: Core Matrimony Features (Steps 7-10)
**Step 7:** Interest system
- Create Interest model
- Send interest endpoint
- Accept/reject interest endpoints
- Get sent/received interests

**Step 8:** Messaging system
- Create Message model
- Send message endpoint
- Get conversations endpoint
- Real-time chat (Socket.io - optional)

<!-- **Step 9:** Matching algorithm
- Create matchingService
- Implement compatibility scoring
- Get matches endpoint -->

**Step 10:** Profile verification
- Admin approval workflow
- Verification badge system

### Phase 4: Subscription & Payments (Steps 11-13)
**Step 11:** Plans system
- Create Plan model
- Seed plans in database
- Get plans endpoint

**Step 12:** Payment integration
- Choose payment gateway (Razorpay/Stripe)
- Create order endpoint
- Payment verification endpoint
- Create Payment model

**Step 13:** Plan restrictions enforcement
- Middleware to check plan limits
- Profile view tracking
- Interest request limits
- Message limits

### Phase 5: Content Management (Steps 14-16)
**Step 14:** Success stories
- Create Story model
- Submit story endpoint
- Admin approval system
- Get approved stories endpoint

**Step 15:** Testimonials
- Create Testimonial model
- Submit testimonial endpoint
- Admin approval
- Get testimonials endpoint

**Step 16:** Contact form
- Create Contact model
- Submit contact endpoint
- Admin dashboard for contacts

### Phase 6: Admin Panel (Steps 17-19)
**Step 17:** Admin authentication
- Create Admin model
- Admin login endpoint
- Admin middleware

**Step 18:** User management
- List all users endpoint
- User verification endpoint
- Block/unblock user endpoint
- Delete user endpoint

**Step 19:** Analytics & reporting
- Platform statistics endpoint
- Revenue reports
- User activity tracking

### Phase 7: Security & Optimization (Steps 20-22)
**Step 20:** Security measures
- Rate limiting
- Input validation & sanitization
- CORS configuration
- Helmet.js setup
- XSS protection

**Step 21:** Error handling
- Global error handler middleware
- Custom error classes
- Logging system (Winston)

**Step 22:** Performance optimization
- Database indexing
- Query optimization
- Caching (Redis - optional)
- Image optimization

### Phase 8: Testing & Deployment (Steps 23-25)
**Step 23:** API testing
- Setup testing environment
- Unit tests for controllers
- Integration tests for APIs
- Postman collection

**Step 24:** Documentation
- API documentation (Swagger)
- README with setup instructions
- Environment variables documentation

**Step 25:** Deployment
- Setup environment on server
- Configure production database
- Deploy to cloud (AWS/Heroku/DigitalOcean)
- SSL certificate setup
- Monitoring setup

---

## 5. ENVIRONMENT VARIABLES REQUIRED

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/kalyanautsava
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/kalyanautsava

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email Service (NodeMailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Gateway (Razorpay/Stripe)
PAYMENT_KEY_ID=your-payment-key-id
PAYMENT_KEY_SECRET=your-payment-secret

# Frontend URL
CLIENT_URL=http://localhost:3000

# Admin
ADMIN_EMAIL=admin@kalyanautsava.com
ADMIN_PASSWORD=secure_admin_password
```

---

## 6. DEPENDENCIES TO INSTALL

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.40.0",
    "nodemailer": "^6.9.4",
    "razorpay": "^2.9.1",
    "winston": "^3.10.0",
    "morgan": "^1.10.0",
    "cookie-parser": "^1.4.6",
    "express-mongo-sanitize": "^2.2.0",
    "xss-clean": "^0.1.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.4",
    "supertest": "^6.3.3"
  }
}
```

---

## 7. KEY FEATURES TO IMPLEMENT

### 7.1 Matching Algorithm Factors
- Age compatibility (±5 years)
- Religion & caste matching
- Location proximity
- Education level compatibility
- Income range matching
- Height preferences
- Profile completeness score

### 7.2 Email Notifications
- Welcome email on registration
- Email verification
- Password reset
- Interest received notification
- Message received notification
- Plan expiry reminder

### 7.3 Plan-based Restrictions
**Free Plan:**
- View 5 profiles per day
- Send 2 interest requests per month
- No messaging

**Silver Plan:**
- Unlimited profile views
- Send 50 interests per month
- Chat with accepted matches
- Profile highlighted

**Gold Plan:**
- Everything in Silver
- Unlimited interest requests
- Video call feature
- Verified badge
- Top profile position
- Dedicated relationship manager

### 7.4 Admin Dashboard Features
- Total users count
- Active subscriptions
- Revenue this month
- Pending verifications
- Recent registrations
- User activity graph
- Payment history

---

## 8. SECURITY BEST PRACTICES

1. **Password Security:**
   - Hash passwords with bcrypt (10+ rounds)
   - Never store plain text passwords
   - Implement strong password requirements

2. **JWT Security:**
   - Short expiration time (7 days max)
   - Store in httpOnly cookies
   - Implement token refresh mechanism

3. **Input Validation:**
   - Validate all user inputs
   - Sanitize data before database insertion
   - Use express-validator

4. **Rate Limiting:**
   - Limit login attempts (5 per 15 minutes)
   - API rate limits (100 requests per 15 minutes)
   - DDoS protection

5. **Data Protection:**
   - Use HTTPS only
   - Implement CORS properly
   - Sanitize MongoDB queries
   - XSS protection with xss-clean
   - NoSQL injection prevention

---

## 9. PERFORMANCE OPTIMIZATION

1. **Database:**
   - Create indexes on frequently queried fields (email, userId, gender, religion, city)
   - Use select() to fetch only required fields
   - Implement pagination everywhere
   - Use lean() for read-only queries

2. **API:**
   - Implement caching for frequently accessed data
   - Use compression middleware
   - Optimize image sizes before upload
   - Lazy loading for profile photos

3. **Monitoring:**
   - Setup error logging (Winston)
   - Monitor API response times
   - Track database query performance
   - Setup alerts for failures

---

## 10. TESTING STRATEGY

1. **Unit Tests:**
   - Test individual functions
   - Test utility functions
   - Test validation logic

2. **Integration Tests:**
   - Test API endpoints
   - Test database operations
   - Test authentication flow

3. **Manual Testing:**
   - Test all user flows
   - Test admin operations
   - Test payment flow
   - Cross-browser testing

---

## NEXT STEPS AFTER APPROVAL

Once you approve this strategy, we will implement in phases:

1. **First Session:** Complete Phase 1 (Project setup, MongoDB, Basic Auth)
2. **Second Session:** Complete Phase 2 (Profile management, Image upload)
3. **Third Session:** Complete Phase 3 (Interest system, Messaging)
4. **Continue step by step...**

Each session will be small and focused to avoid token limits.

**Please review this strategy and let me know:**
1. Do you approve this approach?
2. Any modifications needed?
3. Which payment gateway do you prefer (Razorpay or Stripe)?
4. Do you want real-time chat with Socket.io?
5. Should we start with Phase 1?
