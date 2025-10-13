/**
 * Database Migration Script
 * This script creates the users table in the database
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mysql = require('mysql2/promise');

async function runMigration() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'student_manager',
      multipleStatements: true
    });

    console.log('✓ Connected to database');

    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'create_users_table.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('✓ Running migration: create_users_table.sql');

    // Execute SQL
    await connection.query(sql);

    console.log('✓ Users table created successfully!');
    console.log('\nTable Schema:');
    console.log('- id: INT PRIMARY KEY AUTO_INCREMENT');
    console.log('- username: VARCHAR(50) UNIQUE NOT NULL');
    console.log('- email: VARCHAR(100) UNIQUE NOT NULL');
    console.log('- password_hash: VARCHAR(255) NOT NULL');
    console.log('- created_at: TIMESTAMP (auto)');
    console.log('- updated_at: TIMESTAMP (auto)');

    // Verify table was created
    const [rows] = await connection.query('DESCRIBE users');
    console.log('\n✓ Table structure verified:');
    console.table(rows);

  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Database connection closed');
    }
  }
}

// Run migration
runMigration();
