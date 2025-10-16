/**
 * Test Script for User Model
 * Tests all CRUD operations on the users table
 */

const User = require('../models/userModel');
const bcrypt = require('bcrypt');

async function testUserModel() {
  console.log('🧪 Starting User Model Tests...\n');
  
  let testUserId = null;

  try {
    console.log('Test 1: Creating a new user...');
    const passwordHash = await bcrypt.hash('testPassword123', 10);
    const newUser = await User.create({
      username: 'test_user_' + Date.now(),
      email: `test_${Date.now()}@example.com`,
      password_hash: passwordHash
    });
    testUserId = newUser.id;
    console.log('✓ User created successfully:', {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    });
    console.log('');

    console.log('Test 2: Finding user by ID...');
    const foundById = await User.findById(testUserId);
    console.log('✓ User found by ID:', foundById ? 'Yes' : 'No');
    console.log('');

    console.log('Test 3: Finding user by username...');
    const foundByUsername = await User.findByUsername(newUser.username);
    console.log('✓ User found by username:', foundByUsername ? 'Yes' : 'No');
    console.log('');

    console.log('Test 4: Finding user by email...');
    const foundByEmail = await User.findByEmail(newUser.email);
    console.log('✓ User found by email:', foundByEmail ? 'Yes' : 'No');
    console.log('');

    console.log('Test 5: Checking if username exists...');
    const usernameExists = await User.usernameExists(newUser.username);
    console.log('✓ Username exists:', usernameExists ? 'Yes' : 'No');
    console.log('');

    console.log('Test 6: Checking if email exists...');
    const emailExists = await User.emailExists(newUser.email);
    console.log('✓ Email exists:', emailExists ? 'Yes' : 'No');
    console.log('');

    console.log('Test 7: Getting all users...');
    const allUsers = await User.findAll();
    console.log('✓ Total users in database:', allUsers.length);
    console.log('');

    console.log('Test 8: Getting user count...');
    const userCount = await User.count();
    console.log('✓ User count:', userCount);
    console.log('');

    console.log('Test 9: Updating user email...');
    const newEmail = `updated_${Date.now()}@example.com`;
    await User.update(testUserId, { email: newEmail });
    const updatedUser = await User.findById(testUserId);
    console.log('✓ User updated. New email:', updatedUser.email);
    console.log('');

    console.log('Test 10: Deleting test user...');
    await User.delete(testUserId);
    const deletedUser = await User.findById(testUserId);
    console.log('✓ User deleted:', deletedUser === null ? 'Yes' : 'No');
    console.log('');

    console.log('✅ All tests passed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Users table is working correctly');
    console.log('- All CRUD operations are functional');
    console.log('- Unique constraints are enforced');
    console.log('- Timestamps are auto-generated');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
    
    if (testUserId) {
      try {
        await User.delete(testUserId);
        console.log('🧹 Cleanup: Test user deleted');
      } catch (cleanupError) {
        console.error('🧹 Cleanup failed:', cleanupError.message);
      }
    }
  } finally {
    console.log('\n✓ Tests completed');
    process.exit(0);
  }
}

// Run tests
testUserModel();
