// Test script to check verification token status
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const testVerificationToken = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      return;
    }

    console.log('\n=== User Verification Status ===');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Email Verified:', user.isEmailVerified);
    console.log('Is Active:', user.isActive !== false);
    
    if (user.verificationToken) {
      console.log('\n=== Verification Token Info ===');
      console.log('Token:', user.verificationToken);
      console.log('Token Expires:', new Date(user.verificationTokenExpires));
      console.log('Token Expired:', user.verificationTokenExpires < Date.now());
      console.log('Time Remaining:', Math.round((user.verificationTokenExpires - Date.now()) / (1000 * 60 * 60)), 'hours');
      
      console.log('\n=== Verification URL ===');
      console.log(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${user.verificationToken}`);
    } else {
      console.log('\n⚠️ No verification token found (user may already be verified)');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node test-verify.js <email>');
  process.exit(1);
}

testVerificationToken(email);
