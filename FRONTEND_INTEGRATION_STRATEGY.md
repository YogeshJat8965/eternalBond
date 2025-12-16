# Frontend Integration Strategy

**Project:** Eternal Bond Matrimony - Next.js Frontend Integration
**Backend Status:** ✅ Phases 1-5.1 Complete (25 APIs ready)
**Frontend Stack:** Next.js 14, React, TypeScript, TailwindCSS, shadcn/ui
**Approach:** Simple, step-by-step integration with existing backend APIs

---

## Overview

Integrate Next.js frontend with completed backend APIs. Focus on clean, functional UI without over-engineering. Build authentication flow, profile management, search/browse, interest system, and contact form.

**Total:** 5 phases, 10 steps, ~12 pages

---

## Phase A: API Setup & Authentication Flow

**Goal:** Configure API client, create auth context, build login/register/verification pages

### Step 1: API Configuration & Auth Context
**Files to create:**
- `lib/api.js` - Axios instance with base URL and interceptors
- `lib/auth-context.tsx` - React Context for user state, login, logout, token management
- `lib/auth-utils.ts` - Helper functions (getToken, setToken, removeToken, isAuthenticated)

**What it does:**
- Axios base URL: `http://localhost:5000/api`
- Auto-attach JWT token to all requests via interceptor
- Store token in localStorage
- Provide useAuth() hook for components
- Handle 401 responses (auto logout and redirect)

### Step 2: Authentication Pages
**Files to update/create:**
- Update `app/register/page.tsx` - Full registration form with all fields
- Update `app/login/page.tsx` - Email/password login
- Create `app/verify-email/[token]/page.tsx` - Email verification handler
- Create `app/forgot-password/page.tsx` - Request password reset
- Create `app/reset-password/[token]/page.tsx` - Reset password form

**Backend APIs used:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/verify-email/:token
- POST /api/auth/forgot-password
- POST /api/auth/reset-password/:token

**Features:**
- Form validation (required fields, email format, password strength)
- Loading states during API calls
- Error message display from backend
- Success messages with redirect
- Auto-login after successful registration

### Step 3: Protected Route Component
**Files to create:**
- `components/ProtectedRoute.tsx` - HOC/wrapper for protected pages
- `middleware.ts` (optional) - Next.js middleware for route protection

**What it does:**
- Check if user is authenticated (JWT token exists)
- Redirect to /login if not authenticated
- Show loading spinner during check
- Wrap all protected pages (profile, search, interests)

**Testing:**
- Try accessing /members without login → redirects to /login
- Login and access /members → works
- Logout and try /find-partner → redirects to /login

---

## ✅ Phase A Testing Checklist

### Test 1: Registration Flow
1. Go to http://localhost:3000/register
2. Fill all required fields (name, email, password, phone, gender, DOB, city)
3. Click "Register" button
4. Should show success message: "Registration successful! Check your email to verify."
5. Check terminal/email - verification email should be sent
6. Copy verification token from email link
7. Go to http://localhost:3000/verify-email/[token]
8. Should show "Email verified successfully!" and auto-redirect to login

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": { "user": {...}, "token": "..." }
}
```

### Test 2: Login Flow
1. Go to http://localhost:3000/login
2. Enter registered email and password
3. Click "Login" button
4. If email not verified → shows error: "Please verify your email first"
5. If verified → redirects to /members (profile page)
6. Check localStorage - JWT token should be stored

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "user": {...}, "token": "..." }
}
```

### Test 3: Forgot/Reset Password
1. Go to http://localhost:3000/forgot-password
2. Enter registered email
3. Click "Send Reset Link"
4. Should show: "Password reset link sent to your email"
5. Check email - should receive reset link
6. Copy reset token from email
7. Go to http://localhost:3000/reset-password/[token]
8. Enter new password (min 8 chars)
9. Click "Reset Password"
10. Should show: "Password reset successful! Please login."
11. Redirects to /login
12. Login with new password → should work

### Test 4: Protected Routes
1. Open browser in incognito/private mode
2. Try to go directly to http://localhost:3000/members
3. Should auto-redirect to /login
4. Try http://localhost:3000/find-partner → redirects to /login
5. Try http://localhost:3000/interests → redirects to /login
6. Now login with valid credentials
7. Should redirect to original page you tried to access

### Test 5: Logout & Session
1. Login successfully
2. Go to /members (should work)
3. Click logout button (in navbar)
4. Should clear localStorage token
5. Should redirect to /login
6. Try accessing /members → redirects to /login again

### Test 6: API Error Handling
1. Go to /login
2. Enter wrong password
3. Should show error: "Invalid credentials"
4. Enter non-existent email
5. Should show error: "Invalid credentials"
6. Stop backend server (pkill -f "node.*server")
7. Try to login → should show: "Network error. Please try again."
8. Restart backend server

### Test 7: Token Auto-Attach
1. Login successfully
2. Open browser DevTools → Network tab
3. Navigate to /members
4. Check the API request to /api/profile/me
5. Should see header: `Authorization: Bearer eyJhbG...`
6. Token should be automatically attached by axios interceptor

---

## Phase B: Profile Management

**Goal:** Display and edit user profile, upload/manage photos

### Step 1: My Profile Page
**Files to update:**
- Update `app/members/page.tsx` - Show own profile, edit mode, display all fields

**Backend APIs used:**
- GET /api/profile/me - Fetch current user profile
- PUT /api/profile/me - Update profile fields

**Features:**
- Display all 40+ profile fields in organized sections:
  - Basic Info: name, gender, date of birth, phone, email
  - Location: city, state, country
  - Religion: religion, caste, subcaste, mother tongue
  - Education: education level, profession, annual income
  - Physical: height, complexion, food habits
  - Marital: marital status
  - Bio: personal bio (max 500 chars)
- Edit mode: toggle between view/edit
- Form validation
- Save button with loading state
- Success/error messages

### Step 2: Photo Management
**Component to add in members page:**
- Photo gallery component showing all uploaded photos
- Upload button (max 5 photos, 5MB each, images only)
- Delete button for each photo
- Profile picture indicator (first photo)

**Backend APIs used:**
- POST /api/profile/upload-photo - Upload photo (FormData)
- DELETE /api/profile/photo/:index - Delete photo by index

**Features:**
- Show 5 photo limit warning
- File size and type validation before upload
- Preview image before upload
- Loading state during upload
- Display photos from backend URL: `http://localhost:5000/uploads/${filename}`
- Confirm dialog before delete

**Testing:**
- Upload 5 photos → 6th upload shows error
- Delete 2nd photo → photos array updates, profile picture stays same
- Delete 1st photo → 2nd photo becomes profile picture
- Upload non-image file → shows error

---

## ✅ Phase B Testing Checklist

### Test 1: View Profile
1. Login and go to http://localhost:3000/my-profile
2. Should display your profile with all fields:
   - Basic Info: name, email, phone, gender, DOB
   - Location: city, state, country
   - Religion: religion, caste, subcaste, mother tongue
   - Education: education, profession, annual income
   - Physical: height, complexion, food habits
   - Marital: marital status
   - Bio: personal bio
3. Profile picture should show (if uploaded) or placeholder
4. Verification status should be visible
5. No errors in console

**Expected Backend Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Yogesh Test",
    "email": "...",
    "photos": ["filename1.jpg", "filename2.jpg"],
    ...
  }
}
```

### Test 2: Edit Profile
1. Click "Edit Profile" button
2. Form fields should become editable
3. Update name: "New Name"
4. Update city: "Mumbai"
5. Update bio: "Updated bio text"
6. Click "Save Changes" button
7. Should show loading state on button
8. Should show success message: "Profile updated successfully"
9. Page should refresh with new data
10. Verify changes are visible

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### Test 3: Photo Upload - First Photo
1. Go to /members
2. Click "Upload Photo" button or drag-drop area
3. Select a valid image (JPG/PNG, under 5MB)
4. Should show preview before upload
5. Click "Confirm Upload"
6. Should show loading spinner
7. Photo should appear in gallery
8. Should automatically become profile picture (first photo)
9. Photo should be visible at: http://localhost:5000/uploads/[filename]

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "photos": ["1234567890-photo.jpg"],
    "profilePicture": "1234567890-photo.jpg"
  }
}
```

### Test 4: Upload Multiple Photos
1. Upload 2nd photo → should work
2. Upload 3rd photo → should work
3. Upload 4th photo → should work
4. Upload 5th photo → should work (maximum reached)
5. Try to upload 6th photo → should show error: "Maximum 5 photos allowed"
6. Upload button should be disabled when 5 photos exist
7. All 5 photos should be visible in gallery

### Test 5: Delete Photos
1. Go to photo gallery
2. Hover over 2nd photo → delete button appears
3. Click delete button
4. Should show confirmation dialog: "Are you sure you want to delete this photo?"
5. Click "Confirm"
6. Photo should be removed from gallery
7. Photos should re-index (3rd becomes 2nd, etc.)
8. Profile picture should remain unchanged (1st photo)
9. Now you have 4 photos, upload button should be enabled again

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Photo deleted successfully",
  "data": {
    "photos": ["photo1.jpg", "photo3.jpg", "photo4.jpg", "photo5.jpg"]
  }
}
```

### Test 6: Delete Profile Picture
1. Delete the 1st photo (current profile picture)
2. Confirm deletion
3. 2nd photo should automatically become profile picture
4. Check backend response - profilePicture field should update

### Test 7: File Validation
1. Try to upload a PDF file → should show error: "Only images allowed"
2. Try to upload a 10MB image → should show error: "File size must be under 5MB"
3. Try to upload without selecting file → should show error
4. Upload valid JPG → should work
5. Upload valid PNG → should work

### Test 8: Edit + Upload Simultaneously
1. Click "Edit Profile"
2. Change name to "Test User"
3. Upload a new photo (without saving profile first)
4. Both operations should work independently
5. Profile changes should save
6. Photo should upload successfully

---

## Phase C: Search & Browse Members

**Goal:** Search members with filters, view profiles, send interests

### Step 1: Find Partner Page
**Files to update/create:**
- Update `app/find-partner/page.tsx` - Search form + results grid
- Create `app/profile/[id]/page.tsx` - View other user's profile
- Create `components/MemberCard.tsx` - Reusable member card component

**Backend APIs used:**
- GET /api/search - Search with 15+ filters and pagination
- GET /api/profile/:id - Get specific user profile

**Search Filters:**
- Gender (defaults to opposite of logged-in user)
- Age Range (ageFrom, ageTo)
- Location: city, state, country
- Religion, caste, mother tongue
- Education, profession
- Annual Income (min)
- Height range
- Complexion, food habits
- Marital status
- Sorting: createdAt, name (asc/desc)
- Pagination: page, limit

**Features:**
- Collapsible filter sidebar
- Search button
- Results in card grid (3-4 columns)
- Each card shows: photo, name, age, city, education, profession
- "View Profile" button on each card
- Pagination controls (prev/next, page numbers)
- Loading state during search
- "No results" message
- Results count: "Showing X-Y of Z members"

**Profile View Page:**
- Full profile details of selected member
- Photo gallery
- All profile fields organized
- "Send Interest" button (if not already sent)
- Back to search button

**Testing:**
- Search with no filters → shows all opposite gender
- Search by city "Mumbai" → shows only Mumbai users
- Search age 25-30 → filters correctly
- Click "View Profile" → shows full profile
- Pagination → page 2 shows next set

---

## ✅ Phase C Testing Checklist

### Test 1: Default Search (No Filters)
1. Login and go to http://localhost:3000/find-partner
2. Click "Search" without selecting any filters
3. Should show all members of opposite gender
4. If you're male → shows only female members
5. If you're female → shows only male members
6. Should exclude yourself from results
7. Should show only active & verified users
8. Pagination should show: "Page 1 of X"

**Expected Backend Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalMembers": 25,
    "limit": 20
  }
}
```

### Test 2: Filter by City
1. Enter city: "Mumbai" in search form
2. Click "Search"
3. Should show only members from Mumbai
4. Each card should display "Mumbai" in location
5. Clear filter and search again → shows all again

### Test 3: Filter by Age Range
1. Set "Age From": 25
2. Set "Age To": 30
3. Click "Search"
4. Should show only members between 25-30 years old
5. Verify ages in cards match the range
6. Try invalid range (Age From > Age To) → should show validation error

### Test 4: Multiple Filters Combined
1. Select Gender: "Female" (if you're male)
2. Enter City: "Delhi"
3. Select Religion: "Hindu"
4. Select Education: "Bachelor's Degree"
5. Click "Search"
6. Should show members matching ALL filters
**Testing:**
- Send interest to user → appears in sent list
- Receive interest → appears in received list
- Accept interest → status updates, contact info shown
- Reject interest → status updates to rejected
- Cancel pending sent interest → removed from list
- Try sending duplicate → shows error from backend

---

## ✅ Phase D Testing Checklist

### Test 1: Send Interest from Profile Page
1. Go to /find-partner and search for members
2. Click "View Profile" on a member
3. Should see "Send Interest" button
4. Click "Send Interest"
5. Modal should open with message textarea
6. Enter message: "Hi, I am interested in your profile. Would like to connect."
7. Click "Send" button
8. Should show loading state
9. Should show success: "Interest sent successfully!"
10. Button should change to "Interest Sent" (disabled)
11. Message should be sent to receiver via email (check backend logs)

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Interest sent successfully",
  "data": {
    "_id": "...",
    "senderId": "...",
    "receiverId": "...",
    "message": "Hi, I am interested...",
    "status": "pending"
  }
}
```

### Test 2: View Sent Interests
1. Go to http://localhost:3000/interests
2. Click "Sent" tab
3. Should show all interests you sent
4. Each card should display:
   - Receiver's photo
   - Receiver's name, age, city
   - Your message
   - Status badge (pending/accepted/rejected)
   - Date sent
5. If status is "pending" → should show "Cancel" button
6. If status is "accepted" → should show receiver's contact info (email, phone)
7. If status is "rejected" → should show "Rejected" badge only

**Expected Backend Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "receiverId": {
        "name": "John Doe",
        "city": "Mumbai",
        ...
      },
      "message": "Hi...",
      "status": "pending",
      "createdAt": "..."
    }
  ],
  "count": 3
}
```

### Test 3: View Received Interests
1. Click "Received" tab
2. Should show all interests you received from others
3. Each card should display:
   - Sender's photo
   - Sender's name, age, city
   - Their message to you
   - Status badge
   - Date received
4. If status is "pending" → should show "Accept" and "Reject" buttons
5. If status is "accepted" → should show sender's contact info
6. If status is "rejected" → should show "Rejected" badge only

### Test 4: Accept Interest
1. Go to "Received" tab
2. Find a pending interest
3. Click "Accept" button
4. Should show confirmation dialog: "Are you sure you want to accept this interest?"
5. Click "Yes, Accept"
6. Should show loading state
7. Should show success: "Interest accepted!"
8. Status should change to "Accepted"
9. Should now display sender's contact info:
   - Email: sender@example.com
   - Phone: +91 9876543210
10. Sender should receive email notification (check backend logs)
11. Buttons should disappear (Accept/Reject)

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Interest accepted successfully",
  "data": {
    "_id": "...",
    "status": "accepted",
    ...
  }
}
```

### Test 5: Reject Interest
1. Go to "Received" tab
2. Find another pending interest
3. Click "Reject" button
4. Should show confirmation: "Are you sure you want to reject this interest?"
5. Click "Yes, Reject"
6. Should show loading state
7. Should show success: "Interest rejected"
8. Status should change to "Rejected"
9. Contact info should NOT be shown
10. Buttons should disappear

### Test 6: Cancel Sent Interest
1. Go to "Sent" tab
2. Find a pending interest you sent
3. Click "Cancel" button
4. Should show confirmation: "Are you sure you want to cancel this interest?"
5. Click "Yes, Cancel"
6. Interest should be removed from the list
7. Count should decrease
8. Should show success: "Interest cancelled"

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Interest cancelled successfully"
}
```

### Test 7: Filter by Status
1. Go to "Received" tab
2. Click status filter dropdown
3. Select "Pending"
4. Should show only pending interests
5. Select "Accepted"
6. Should show only accepted interests with contact info
7. Select "Rejected"
8. Should show only rejected interests
9. Select "All"
10. Should show all interests

### Test 8: Duplicate Interest Prevention
1. Send interest to User A
2. Go back to User A's profile
3. Button should show "Interest Sent" (disabled)
4. Try to send again → should not allow
5. If you somehow bypass UI and send API request → backend returns error: "Interest already sent to this user"

### Test 9: Empty States
1. If no received interests → should show: "You haven't received any interests yet"
2. If no sent interests → should show: "You haven't sent any interests yet"
3. If filtered by "Accepted" but none exist → should show: "No accepted interests"

### Test 10: Real-time Updates
1. Send interest to User B
2. Status shows "pending" in Sent tab
3. Login as User B in another browser (or ask someone to test)
4. User B accepts your interest
5. Refresh your page
6. Status should now show "Accepted" in your Sent tab
7. Contact info of User B should be visible

### Test 11: Contact Info Display
When interest is accepted, verify contact info shows:
1. Full name
2. Email address (clickable mailto: link)
3. Phone number (clickable tel: link)
4. Message: "You can now contact [Name] directly!"

---

## Phase E: Contact Form & Admin Panel

**Goal:** Public contact form for inquiries, admin dashboard for management

### Step 1: Public Contact Page
**Files to update:**
- Update `app/contact/page.tsx` - Contact form for public inquiries

**Backend API used:**
- POST /api/contact - Submit contact form (public, no auth)

**Features:**
- Form fields: name, email, phone, subject, message (max 2000 chars)
- Name, email, subject, message are required
- Email validation
- Submit button with loading state
- Success message: "Thank you! We'll contact you soon."
- Clear form after successful submission
- Error handling
- Toast notifications for success/error
- Works for both logged-in and non-logged-in users

**Testing:**
- Submit without login → works (public endpoint)
- Submit with missing fields → shows validation errors
- Submit complete form → success message shown
- Form clears after successful submission

---

## ✅ Phase E.1 Testing Checklist (Contact Form)

### Test 1: Public Contact Form (Not Logged In)
1. Logout if logged in (or use incognito mode)
2. Go to http://localhost:3000/contact
3. Should be accessible without authentication
4. Fill form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "9876543210"
   - Subject: "Inquiry about Premium Plans"
   - Message: "I would like to know more about your services."
5. Click "Submit" button
6. Should show loading state
7. Should show success message: "Thank you! We'll contact you soon."
8. Form should clear after submission
9. Admin should receive email notification (check backend logs)
10. User should receive confirmation email

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Your message has been sent successfully. We will contact you soon.",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "new",
    ...
  }
}
```

### Test 2: Contact Form Validation
1. Try to submit empty form → should show validation errors:
   - "Name is required"
   - "Email is required"
   - "Subject is required"
   - "Message is required"
2. Enter invalid email: "notanemail" → should show "Invalid email format"
3. Enter message with 2500 characters → should show "Maximum 2000 characters allowed"
4. Enter valid data → should submit successfully

### Test 3: Contact Form While Logged In
1. Login as a user
2. Go to /contact
3. Form should work the same
4. Can optionally pre-fill email from logged-in user
5. Submit should work

### Test 4: Admin Login
1. Go to http://localhost:3000/admin/login (or /admin)
2. Enter email: admin@matrimony.com
3. Enter password: Admin@123
4. Click "Login"
5. Should show loading state
6. Should redirect to /admin/dashboard
7. Should store admin token in localStorage
8. Navbar should show "Admin Panel" indicator

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Admin logged in successfully",
  "data": {
    "admin": {
      "id": "...",
      "email": "admin@matrimony.com",
      "name": "Admin User",
      "role": "super-admin"
    },
    "token": "..."
  }
}
```

### Test 5: Admin Login Validation
1. Try wrong password → should show "Invalid credentials"
2. Try non-existent email → should show "Invalid credentials"
3. Try empty fields → should show validation errors

### Test 6: Admin Dashboard Stats
1. After login, should see dashboard with stat cards:
   - **Total Users:** 5 (example)
   - **Active Users:** 5
   - **Verified Users:** 2
   - **Male Users:** 4
   - **Female Users:** 1
   - **Total Interests:** 2
   - **Pending Interests:** 0
   - **Accepted Interests:** 1
   - **Rejected Interests:** 1
   - **Total Contacts:** 1
   - **New Contacts:** 0 (since you updated it)
   - **In Progress Contacts:** 1
   - **Resolved Contacts:** 0
   - **Users with Photos:** 1
2. All counts should match backend database
3. Stats should update in real-time (or after refresh)

**Expected Backend Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 5,
      "active": 5,
      "verified": 2,
      "male": 4,
      "female": 1
    },
    "interests": {
      "total": 2,
      "pending": 0,
      "accepted": 1,
      "rejected": 1
    },
    "contacts": {
      "total": 1,
      "new": 0,
      "inProgress": 1,
      "resolved": 0
    },
    "photos": {
      "usersWithPhotos": 1
    }
  }
}
```

### Test 7: Admin - User Management
1. Click "Users" in admin sidebar
2. Should show table with all users:
   - Columns: Name, Email, Gender, City, Verified, Active, Joined Date
3. Should have pagination (20 per page)
4. Search by name "Yogesh" → should filter results
5. Filter by gender "Male" → shows only male users
6. Filter by verified status → shows only verified users
7. Click page 2 → shows next 20 users

**Expected Backend Response:**
```json
{
  "success": true,
  "data": [...], // array of users
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalUsers": 5,
    "limit": 20
  }
}
```

### Test 8: Admin - View/Edit User
1. Click "View" button on a user row
2. Modal should open showing full user profile
3. Should display all fields + interest stats:
   - Sent Interests: 1
   - Received Interests: 1
   - Accepted Interests: 0
4. Click "Edit" button
5. Form fields should become editable
6. Update city: "New Delhi"
7. Toggle "isActive" to false
8. Click "Save"
9. Should show success: "User updated successfully"
10. Modal should close
11. Table should refresh with new data
12. User should now show "Inactive" status

### Test 9: Admin - Delete User (Super Admin Only)
1. Login as super-admin (admin@matrimony.com)
2. Go to Users table
3. Click "Delete" button on a user
4. Should show confirmation: "Are you sure you want to deactivate this user?"
5. Click "Yes, Deactivate"
6. User's isActive should change to false
7. User should still exist in database (soft delete)
8. Login as regular admin (if you create one) → Delete button should not be visible

### Test 10: Admin - Contact Management
1. Click "Contacts" in admin sidebar
2. Should show table with all contact submissions:
   - Columns: Name, Email, Phone, Subject, Status, Date
3. Filter by status "new" → shows only new contacts
4. Click on a contact row to expand
5. Should show full message
6. Should have status dropdown: new, in-progress, resolved
7. Should have admin response textarea
8. Change status to "in-progress"
9. Enter admin response: "We will review your inquiry and get back to you within 24 hours."
10. Click "Save"
11. Should update successfully
12. Status should change in table

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Contact updated successfully",
  "data": {
    "_id": "...",
    "status": "in-progress",
    "adminResponse": "We will review...",
    ...
  }
}
```

### Test 11: Admin - Interest Monitoring
1. Click "Interests" in admin sidebar
2. Should show table with all interests:
   - Columns: Sender, Receiver, Status, Date
3. Should display sender and receiver names (populated)
4. Filter by status "accepted" → shows only accepted
5. Click on interest row to view full details
6. Should show message sent by sender
7. Should be read-only (no edit/delete actions)
8. Should show sender's city, receiver's city

**Expected Backend Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "senderId": {
        "name": "Test User",
        "email": "test@example.com",
        "city": "Mumbai"
      },
      "receiverId": {
        "name": "Yogesh Test",
        "city": "Delhi"
      },
      "status": "accepted",
      "message": "Hi...",
      "createdAt": "..."
    }
  ],
  "pagination": {...}
}
```

### Test 12: Admin - Pagination & Search
1. In Users table, click page 2 → loads next page
2. Search for "test" → filters by name/email
3. Clear search → shows all users again
4. Change limit to 10 per page → shows 10 users
5. Same for Contacts and Interests tables

### Test 13: Admin - Authorization
1. Logout from admin
2. Try to access http://localhost:3000/admin/dashboard directly
3. Should redirect to /admin/login
4. Try to access API endpoint without admin token:
   ```bash
   curl http://localhost:5000/api/admin/stats
   ```
5. Should return: "Not authorized to access this route - No token"
6. Login as admin → dashboard should be accessible

### Test 14: Admin - Logout
1. While logged in as admin
2. Click "Logout" button in admin navbar
3. Should clear admin token from localStorage
4. Should redirect to /admin/login
5. Try to access /admin/dashboard → redirects back to login

### Test 15: Admin vs User Separation
1. Login as regular user
2. Try to access /admin/dashboard → should show "Access Denied" or redirect
3. Regular users should NOT have access to admin panel
4. Admin should NOT have access to regular user features (send interest, etc.)
5. Maintain separate auth contexts if needed

---

## 🎯 Complete Integration Testing (All Phases)

### End-to-End User Flow Test
1. **Register** → verify email → **login**
2. **Edit profile** → add bio, update location
3. **Upload 3 photos**
4. **Search** for members (city: "Mumbai", age: 25-30)
5. **View profile** of a member
6. **Send interest** with message
7. Go to **Interests** tab → verify sent interest shows as "pending"
8. Ask another user (or create 2nd account) to **accept your interest**
9. Refresh → see contact info displayed
10. **Logout**

### End-to-End Admin Flow Test
1. Submit **contact form** as visitor (not logged in)
2. Login to **admin panel**
3. View **dashboard stats** → verify counts
4. Go to **Users** → search and view profiles
5. **Edit a user** → update their city
6. Go to **Contacts** → find your submission from step 1
7. **Update contact status** → add admin response
8. Go to **Interests** → view all interests in system
9. **Logout** from admin

---

**Backend API used:**
- POST /api/contact - Submit contact form (public, no auth)

**Features:**
- Form fields: name, email, phone, subject, message (max 2000 chars)
- Name, email, subject, message are required
- Email validation
- Submit button with loading state
- Success message: "Thank you! We'll contact you soon."
- Clear form after successful submission
- Error handling

**Testing:**
- Submit without login → works (public endpoint)
- Submit with missing fields → shows validation errors
- Submit complete form → success message shown
- Admin receives email notification (check backend logs)
- User receives confirmation email

### Step 2: Admin Panel
**Files to create:**
- Create `app/admin/login/page.tsx` - Admin login
- Create `app/admin/dashboard/page.tsx` - Admin dashboard
- Create `app/admin/layout.tsx` - Admin layout with sidebar
- Create `components/admin/Sidebar.tsx` - Admin navigation
- Create `components/admin/StatsCard.tsx` - Dashboard stat cards
- Create `components/admin/UserTable.tsx` - User management table
- Create `components/admin/ContactTable.tsx` - Contact management table
- Create `components/admin/InterestTable.tsx` - Interest monitoring table

**Backend APIs used:**
- POST /api/admin/login - Admin login
- GET /api/admin/stats - Dashboard statistics
- GET /api/admin/users - All users with pagination
- GET /api/admin/users/:id - User details
- PUT /api/admin/users/:id - Update user
- DELETE /api/admin/users/:id - Deactivate user (super-admin only)
- GET /api/admin/contacts - All contacts
- PUT /api/admin/contacts/:id - Update contact status
- GET /api/admin/interests - All interests

**Admin Credentials:**
- Email: admin@matrimony.com
- Password: Admin@123
- Role: super-admin

**Dashboard Features:**
- Stat cards showing:
  - Total Users (active/inactive)
  - Verified Users
  - Male/Female count
  - Total Interests (pending/accepted/rejected)
  - Contacts (new/in-progress/resolved)
  - Users with photos
- Recent activity feed (optional)

**User Management:**
- Table with columns: name, email, gender, city, verified, active, joined date
- Search by name/email
- Filter by: active, verified, gender
- Pagination
- Actions: View, Edit, Deactivate (super-admin only)
- Edit modal: update any user field
- View modal: full user profile with interest stats

**Contact Management:**
- Table with: name, email, subject, status, date
- Filter by status: new, in-progress, resolved
- Click to expand and view full message
- Add admin response textbox
- Update status dropdown
- Save button

**Interest Monitoring:**
- Table with: sender, receiver, status, date
- Filter by status
- View full interest details
- No actions (read-only for monitoring)

**Testing:**
- Login with admin credentials → dashboard loads
- View stats → correct counts from database
- Search users → filters work
- Edit user → updates successfully
- Deactivate user → sets isActive to false
- View contacts → new contact from Phase E.1 visible
- Update contact status to "in-progress" → saves
- View interests → all interests visible

---
## OPTIONAL PHASE
IN THE DASHBOARD PROFILE  SETTING SHOULD BE WORKING DYNAMICALLY AND VISIBILITY SHOULD BE CHANGED DYNAMICALLY


## Phase F: UI Polish & Validation (Optional - After Phase E)

**Goal:** Improve UX, add loading states, error boundaries, responsive design

### Optional Enhancements:
- Add loading skeletons for all pages
- Error boundary component for API failures
- Toast notifications instead of alerts
- Form validation with react-hook-form + zod
- Responsive design for mobile/tablet
- Dark mode toggle
- Image lazy loading
- Infinite scroll for search results
- Real-time notifications badge (interest count)
- Profile completion progress bar
- SEO meta tags for all pages

---

## Technical Setup Checklist

### Before Starting Phase A:

**1. Install Required Packages:**
```bash
npm install axios
npm install jwt-decode
# Already have: react-hook-form, zod (for validation)
```

**2. Environment Variables:**
Create `.env.local` in frontend root:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOADS_URL=http://localhost:5000/uploads
```

**3. Backend CORS Verification:**
Backend already has CORS enabled for frontend (http://localhost:3000)

**4. Start Both Servers:**
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
npm run dev
```

---

## API Endpoints Reference

### Authentication (5 endpoints)
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/verify-email/:token - Verify email
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password/:token - Reset password
- GET /api/auth/me - Get current user (protected)

### Profile (5 endpoints)
- GET /api/profile/me - Get my profile (protected)
- PUT /api/profile/me - Update profile (protected)
- POST /api/profile/upload-photo - Upload photo (protected)
- DELETE /api/profile/photo/:index - Delete photo (protected)
- GET /api/profile/:id - Get user profile (protected)

### Search (1 endpoint)
- GET /api/search - Search members with filters (protected)

### Interests (6 endpoints)
- POST /api/interests/send - Send interest (protected)
- GET /api/interests/received - Get received interests (protected)
- GET /api/interests/sent - Get sent interests (protected)
- PUT /api/interests/:id/accept - Accept interest (protected)
- PUT /api/interests/:id/reject - Reject interest (protected)
- DELETE /api/interests/:id - Cancel interest (protected)

### Contact (1 endpoint)
- POST /api/contact - Submit contact form (public)

### Admin (9 endpoints)
- POST /api/admin/login - Admin login (public)
- GET /api/admin/stats - Dashboard stats (admin)
- GET /api/admin/users - All users (admin)
- GET /api/admin/users/:id - User details (admin)
- PUT /api/admin/users/:id - Update user (admin)
- DELETE /api/admin/users/:id - Deactivate user (super-admin)
- GET /api/admin/contacts - All contacts (admin)
- PUT /api/admin/contacts/:id - Update contact (admin)
- GET /api/admin/interests - All interests (admin)

**Total: 27 endpoints**

---

## Progress Tracking

### Phase A: API Setup & Authentication ⏳
- [ ] Step 1: API Configuration & Auth Context
- [ ] Step 2: Authentication Pages
- [ ] Step 3: Protected Route Component

### Phase B: Profile Management ⏳
- [ ] Step 1: My Profile Page
- [ ] Step 2: Photo Management

### Phase C: Search & Browse ⏳
- [ ] Step 1: Find Partner Page

### Phase D: Interest System ⏳
- [ ] Step 1: Interests Page - Send & View
- [ ] Step 2: Accept/Reject Actions

### Phase E: Contact & Admin ⏳
- [ ] Step 1: Public Contact Page
- [ ] Step 2: Admin Panel

---

## Success Criteria

**Phase A Complete:** Can register, login, verify email, reset password
**Phase B Complete:** Can view/edit profile, upload/delete photos
**Phase C Complete:** Can search members with filters, view profiles
**Phase D Complete:** Can send/receive/accept/reject interests
**Phase E Complete:** Contact form works, admin can manage all data

**Full Integration Complete:** All 27 backend APIs connected, full user flow working end-to-end

---

## Notes

- Keep UI simple and functional
- No over-engineering or complex state management
- Use existing shadcn/ui components where possible
- Focus on working features first, polish later
- Test each phase before moving to next
- Backend is stable, won't change during frontend work

---

**Ready to start Phase A Step 1!**
