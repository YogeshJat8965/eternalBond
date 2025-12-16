const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // ============ Authentication ============
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },
  
  // ============ Basic Info ============
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Gender is required']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  
  // ============ Location ============
  city: {
    type: String,
    required: [true, 'City is required']
  },
  state: {
    type: String
  },
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
    required: [true, 'Height is required']
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
    required: [true, 'Marital status is required']
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
    maxlength: [500, 'Bio cannot exceed 500 characters']
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
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  }
  
}, { 
  timestamps: true // Adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function() {
  // Only hash password if it has been modified
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
