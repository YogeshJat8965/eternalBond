const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create admin user
const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@matrimony.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create new admin
    const admin = await Admin.create({
      email: 'admin@matrimony.com',
      password: 'Admin@123',
      name: 'Admin User',
      role: 'super-admin',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('----------------------------------');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123');
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('----------------------------------');
    console.log('You can now login to admin panel');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

// Run seed
seedAdmin();
