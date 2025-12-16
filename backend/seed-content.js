const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const FAQ = require('./models/FAQ');
const Testimonial = require('./models/Testimonial');
const Story = require('./models/Story');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await FAQ.deleteMany({});
    await Testimonial.deleteMany({});
    await Story.deleteMany({});
    console.log('Cleared existing data');

    // Seed FAQs
    const faqs = [
      { question: 'How do I create an account?', answer: 'Click on the "Register" button and fill in your details. You will receive a confirmation email.', category: 'Account', order: 1 },
      { question: 'What payment methods do you accept?', answer: 'We accept credit cards, debit cards, PayPal, and bank transfers.', category: 'Payment', order: 2 },
      { question: 'How do I reset my password?', answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.', category: 'Account', order: 3 },
      { question: 'Can I cancel my subscription?', answer: 'Yes, you can cancel your subscription anytime from your account settings.', category: 'Subscription', order: 4 },
      { question: 'How does the matching algorithm work?', answer: 'Our algorithm matches users based on preferences, interests, and compatibility factors.', category: 'General', order: 5 },
      { question: 'Is my personal information secure?', answer: 'Yes, we use industry-standard encryption and security measures to protect your data.', category: 'Privacy', order: 6 },
      { question: 'How do I contact customer support?', answer: 'You can reach us through the contact form, email, or live chat available 24/7.', category: 'Support', order: 7 },
      { question: 'What is the refund policy?', answer: 'We offer a 30-day money-back guarantee for premium subscriptions.', category: 'Payment', order: 8 },
    ];
    await FAQ.insertMany(faqs);
    console.log('FAQs seeded successfully');

    // Seed Testimonials
    const testimonials = [
      { name: 'Sarah Johnson', position: 'Marketing Manager', company: 'Tech Corp', rating: 5, message: 'Kalyanautsava helped me find my perfect match! The platform is incredibly easy to use and the matches are very accurate.', image: 'SJ' },
      { name: 'Michael Chen', position: 'Software Engineer', company: 'StartupXYZ', rating: 5, message: 'I was skeptical at first, but Kalyanautsava exceeded all my expectations. Met my soulmate within 3 months!', image: 'MC' },
      { name: 'Emma Wilson', position: 'Designer', company: 'Creative Studio', rating: 4, message: 'Great platform with genuine profiles. The customer service is outstanding and very helpful.', image: 'EW' },
      { name: 'David Brown', position: 'Business Owner', company: 'Brown Enterprises', rating: 5, message: 'The best matrimonial site I have used. Found my life partner here. Highly recommended!', image: 'DB' },
      { name: 'Lisa Anderson', position: 'Doctor', company: 'City Hospital', rating: 5, message: 'Professional, secure, and effective. Kalyanautsava made my search for a life partner so much easier.', image: 'LA' },
      { name: 'James Taylor', position: 'Teacher', company: 'Central School', rating: 4, message: 'Good experience overall. The matching algorithm is smart and the interface is user-friendly.', image: 'JT' },
    ];
    await Testimonial.insertMany(testimonials);
    console.log('Testimonials seeded successfully');

    // Seed Success Stories
    const stories = [
      { coupleName: 'Emma & David', weddingDate: '2024-06-15', story: 'We met on Kalyanautsava and instantly connected. After 6 months of wonderful conversations, we knew we were meant for each other. Our wedding was a dream come true!', location: 'New York, USA', image: '💑', featured: true },
      { coupleName: 'Sophia & Ryan', weddingDate: '2024-08-20', story: 'Kalyanautsava helped us find each other despite living in different cities. The matching algorithm was spot on! We are now happily married and planning our future together.', location: 'Los Angeles, USA', image: '💕', featured: true },
      { coupleName: 'Michael & Priya', weddingDate: '2024-05-10', story: 'A cross-cultural love story made possible by Kalyanautsava. We overcame all barriers and celebrated our love with family and friends from both sides.', location: 'London, UK', image: '💖', featured: false },
      { coupleName: 'James & Maria', weddingDate: '2024-09-03', story: 'After years of unsuccessful searching, Kalyanautsava brought us together. We connected on so many levels and our relationship blossomed naturally.', location: 'Chicago, USA', image: '❤️', featured: false },
      { coupleName: 'Alex & Sarah', weddingDate: '2024-07-12', story: 'We were both skeptical about online matrimonial sites, but Kalyanautsava changed our perspective. Found my soulmate and best friend for life!', location: 'Toronto, Canada', image: '💗', featured: true },
      { coupleName: 'Aisha & Omar', weddingDate: '2024-04-18', story: 'Our journey started on Kalyanautsava and has been beautiful ever since. We are grateful for this platform that brought us together.', location: 'Dubai, UAE', image: '💞', featured: true },
    ];
    await Story.insertMany(stories);
    console.log('Success Stories seeded successfully');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedData();
