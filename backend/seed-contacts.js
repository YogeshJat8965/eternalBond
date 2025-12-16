require('dotenv').config();
const mongoose = require('mongoose');
const Contact = require('./models/Contact');
const connectDB = require('./config/db');

const seedContacts = async () => {
  try {
    await connectDB();
    
    console.log('Seeding contacts...');
    
    const sampleContacts = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234-567-8901',
        subject: 'Premium Plan Inquiry',
        message: 'I would like to know more about the premium plan features and pricing. Can you provide detailed information?',
        status: 'new'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 234-567-8902',
        subject: 'Technical Issue',
        message: 'I am facing issues while uploading my profile picture. The upload button is not responding. Please help.',
        status: 'in-progress',
        adminResponse: 'We are looking into this issue. Please try clearing your browser cache.'
      },
      {
        name: 'Robert Johnson',
        email: 'robert@example.com',
        phone: '+1 234-567-8903',
        subject: 'Account Verification',
        message: 'My account verification is pending for 3 days. Please expedite the process.',
        status: 'in-progress'
      },
      {
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+1 234-567-8904',
        subject: 'Refund Request',
        message: 'I would like to request a refund for my premium subscription as I found a suitable match.',
        status: 'new'
      },
      {
        name: 'Michael Wilson',
        email: 'michael@example.com',
        phone: '+1 234-567-8905',
        subject: 'Feature Suggestion',
        message: 'It would be great to have video call feature for verified members. This would help in better communication.',
        status: 'resolved',
        adminResponse: 'Thank you for your suggestion. We will consider this for future updates.'
      },
      {
        name: 'Sarah Brown',
        email: 'sarah@example.com',
        phone: '+1 234-567-8906',
        subject: 'Privacy Concern',
        message: 'I want to know how my data is protected on your platform and who can access my information.',
        status: 'resolved',
        adminResponse: 'Your data is encrypted and stored securely. Only verified members can view your profile based on your privacy settings.'
      },
      {
        name: 'David Miller',
        email: 'david@example.com',
        phone: '+1 234-567-8907',
        subject: 'Partnership Inquiry',
        message: 'I represent a wedding planning company and would like to discuss partnership opportunities with your platform.',
        status: 'new'
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa@example.com',
        phone: '+1 234-567-8908',
        subject: 'Account Deletion',
        message: 'Please delete my account and all associated data. I no longer wish to use this service.',
        status: 'resolved',
        adminResponse: 'Your account has been successfully deleted as per your request.'
      }
    ];

    // Clear existing contacts (optional - remove if you want to keep existing data)
    await Contact.deleteMany({});
    console.log('Cleared existing contacts');

    // Insert sample contacts
    await Contact.insertMany(sampleContacts);
    
    console.log('✅ Successfully seeded', sampleContacts.length, 'contacts');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding contacts:', error);
    process.exit(1);
  }
};

seedContacts();
