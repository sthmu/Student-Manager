// Test setup and utilities
require('dotenv').config();

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-12345';
process.env.ADMIN_REGISTRATION_CODE = process.env.ADMIN_REGISTRATION_CODE || 'TEST_ADMIN_2024';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_USER = process.env.DB_USER || 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'root'; // Use password from .env
process.env.DB_NAME = process.env.DB_NAME || 'student_manager'; // Use main database
process.env.PORT = 5001; // Different port for testing

// Increase timeout for database operations
jest.setTimeout(30000); // 30 seconds

// Global test utilities
global.testUtils = {
  // Generate random test data with unique timestamps
  generateTestUser: () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return {
      username: `testuser_${timestamp}_${random}`,
      email: `test_${timestamp}_${random}@example.com`,
      password: 'Test@12345',
      adminCode: process.env.ADMIN_REGISTRATION_CODE
    };
  },

  generateTestStudent: () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return {
      name: `Test Student ${timestamp}`,
      email: `student_${timestamp}_${random}@example.com`,
      phone: `555-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      course: 'Computer Science',
      enrollment_date: new Date().toISOString().split('T')[0],
      status: 'active'
    };
  },

  // Clean test data
  cleanEmail: (email) => email.toLowerCase().trim()
};

// Clean up after all tests
afterAll(async () => {
  // Close database connection pool
  const db = require('../config/database');
  
  try {
    // Access the underlying pool and close it
    if (db && db.pool) {
      await db.pool.end();
      console.log('Database pool closed successfully');
    }
  } catch (error) {
    console.error('Error closing database pool:', error.message);
  }
  
  // Give time for cleanup
  await new Promise(resolve => setTimeout(resolve, 500));
});
