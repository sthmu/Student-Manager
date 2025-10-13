/**
 * Migrate Test Users to Database
 * This script creates the test users (jagath and john) in the database
 */

const bcrypt = require('bcrypt');
const User = require('../../models/userModel');

async function migrateTestUsers() {
  console.log('🔄 Migrating test users to database...\n');

  try {
    // Test user 1: jagath@hotmail.com (admin)
    const jagathEmail = 'jagath@hotmail.com';
    const jagathExists = await User.emailExists(jagathEmail);
    
    if (!jagathExists) {
      // Original password: jagath123
      const jagathHash = '$2b$10$8ZqJ0qYkX5l.vQp1wZJwJuOqGPpLx7Y2W.qWvKQXzJKYxHJXHZnXm';
      
      const jagath = await User.create({
        username: 'jagath',
        email: jagathEmail,
        password_hash: jagathHash
      });
      
      console.log('✓ Created user: jagath');
      console.log('  - Email: jagath@hotmail.com');
      console.log('  - Password: jagath123');
      console.log('  - ID:', jagath.id);
      console.log('');
    } else {
      console.log('ℹ User "jagath" already exists in database');
      console.log('');
    }

    // Test user 2: john@example.com
    const johnEmail = 'john@example.com';
    const johnExists = await User.emailExists(johnEmail);
    
    if (!johnExists) {
      // Original password: john123
      const johnHash = '$2b$10$7YqI9pXkW4k.uPo2xYIxIuNpFOoKw6X1V.pVuJPWyIJXwGIWGYmWl';
      
      const john = await User.create({
        username: 'john',
        email: johnEmail,
        password_hash: johnHash
      });
      
      console.log('✓ Created user: john');
      console.log('  - Email: john@example.com');
      console.log('  - Password: john123');
      console.log('  - ID:', john.id);
      console.log('');
    } else {
      console.log('ℹ User "john" already exists in database');
      console.log('');
    }

    // Show all users
    const allUsers = await User.findAll();
    console.log('📊 Total users in database:', allUsers.length);
    console.log('');
    console.table(allUsers.map(u => ({
      ID: u.id,
      Username: u.username,
      Email: u.email,
      'Created At': new Date(u.created_at).toLocaleString()
    })));

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📝 You can now login with:');
    console.log('   - jagath@hotmail.com / jagath123');
    console.log('   - john@example.com / john123');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Error details:', error);
  } finally {
    process.exit(0);
  }
}

// Run migration
migrateTestUsers();
