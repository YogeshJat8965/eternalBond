const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({ isActive: true }).select('name maritalStatus religion education').limit(10);
    console.log('\nSample users:');
    users.forEach(u => {
      console.log(`  ${u.name}:`);
      console.log(`    maritalStatus: '${u.maritalStatus}'`);
      console.log(`    religion: '${u.religion}'`);
      console.log(`    education: '${u.education}'`);
    });
    
    const statuses = await User.distinct('maritalStatus');
    console.log('\nAll distinct marital status values:', statuses);
    
    const religions = await User.distinct('religion');
    console.log('All distinct religion values:', religions);
    
    const educations = await User.distinct('education');
    console.log('All distinct education values:', educations);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkDB();
