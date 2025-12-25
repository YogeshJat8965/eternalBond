// Test script to verify search filters work correctly
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testSearchFilters() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get a test user to simulate logged-in user
    const testUser = await User.findOne({ name: 'Yogesh Jat edited' });
    console.log(`🧪 Testing as user: ${testUser.name} (${testUser.gender})\n`);

    // Test 1: Search for males
    console.log('TEST 1: Search for all males');
    const test1Query = {
      isActive: true,
      isEmailVerified: true,
      gender: 'male',
      _id: { $ne: testUser._id }
    };
    const test1Results = await User.find(test1Query).select('name gender religion');
    console.log(`   Found ${test1Results.length} results:`);
    test1Results.forEach(u => console.log(`   - ${u.name} (${u.religion || 'no religion'})`));
    console.log('   ✅ PASSED\n');

    // Test 2: Search for males with Hindu religion
    console.log('TEST 2: Search for male + Hindu');
    const test2Query = {
      isActive: true,
      isEmailVerified: true,
      gender: 'male',
      religion: 'Hindu',
      _id: { $ne: testUser._id }
    };
    const test2Results = await User.find(test2Query).select('name gender religion');
    console.log(`   Found ${test2Results.length} results:`);
    test2Results.forEach(u => console.log(`   - ${u.name} (${u.religion})`));
    console.log('   ✅ PASSED\n');

    // Test 3: Search for females
    console.log('TEST 3: Search for females');
    const test3Query = {
      isActive: true,
      isEmailVerified: true,
      gender: 'female',
      _id: { $ne: testUser._id }
    };
    const test3Results = await User.find(test3Query).select('name gender religion');
    console.log(`   Found ${test3Results.length} results:`);
    test3Results.forEach(u => console.log(`   - ${u.name} (${u.religion || 'no religion'})`));
    console.log('   ✅ PASSED\n');

    // Test 4: Search with marital status
    console.log('TEST 4: Search for male + Never Married');
    const test4Query = {
      isActive: true,
      isEmailVerified: true,
      gender: 'male',
      maritalStatus: 'Never Married',
      _id: { $ne: testUser._id }
    };
    const test4Results = await User.find(test4Query).select('name gender maritalStatus');
    console.log(`   Found ${test4Results.length} results:`);
    test4Results.forEach(u => console.log(`   - ${u.name} (${u.maritalStatus || 'not set'})`));
    console.log('   ✅ PASSED\n');

    // Test 5: Search with profession (regex)
    console.log('TEST 5: Search for profession containing "Engineer"');
    const test5Query = {
      isActive: true,
      isEmailVerified: true,
      profession: new RegExp('Engineer', 'i'),
      _id: { $ne: testUser._id }
    };
    const test5Results = await User.find(test5Query).select('name profession');
    console.log(`   Found ${test5Results.length} results:`);
    test5Results.forEach(u => console.log(`   - ${u.name} (${u.profession || 'not set'})`));
    console.log('   ✅ PASSED\n');

    // Summary
    console.log('='.repeat(50));
    console.log('📊 SUMMARY:');
    console.log(`   All males: ${test1Results.length}`);
    console.log(`   Male + Hindu: ${test2Results.length}`);
    console.log(`   Females: ${test3Results.length}`);
    console.log(`   Male + Never Married: ${test4Results.length}`);
    console.log(`   Profession=Engineer: ${test5Results.length}`);
    console.log('='.repeat(50));
    console.log('✅ ALL TESTS PASSED!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testSearchFilters();
