/**
 * Automatic Database Initializer
 * 
 * This module automatically checks and creates database schema on application startup
 * Works in any environment: local, Azure, AWS, etc.
 * 
 * Features:
 * - Creates database if it doesn't exist
 * - Creates tables if they don't exist
 * - Safe to run multiple times (idempotent)
 * - Non-blocking initialization
 * 
 * Note: Does NOT create initial users - users must register via /api/auth/register
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class DatabaseInitializer {
  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    };

    // Add SSL if configured (for Azure, AWS, etc.)
    if (process.env.DB_SSL === 'true') {
      this.config.ssl = {
        rejectUnauthorized: false
      };
    }

    this.databaseName = process.env.DB_NAME || 'student_manager';
  }

  /**
   * Main initialization method - called on app startup
   */
  async initialize() {
    console.log('\n' + '='.repeat(60));
    console.log('🔧 Database Initialization Started');
    console.log('='.repeat(60));

    try {
      // Step 1: Check/Create Database
      await this.ensureDatabase();

      // Step 2: Check/Create Tables
      await this.ensureTables();

      // Step 3: Check User Count (Info Only)
      await this.checkInitialData();

      console.log('='.repeat(60));
      console.log('✅ Database Initialization Completed Successfully!');
      console.log('='.repeat(60) + '\n');

      return { success: true };

    } catch (error) {
      console.error('='.repeat(60));
      console.error('❌ Database Initialization Failed');
      console.error('='.repeat(60));
      console.error('Error:', error.message);
      console.error('\nPlease check:');
      console.error('  1. MySQL server is running');
      console.error('  2. Database credentials in .env are correct');
      console.error('  3. User has CREATE DATABASE privileges');
      console.error('');
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Ensure database exists, create if not
   */
  async ensureDatabase() {
    let connection;
    
    try {
      console.log('\n📊 Step 1: Checking database...');
      
      // Connect without database name
      connection = await mysql.createConnection(this.config);
      console.log('  ✓ Connected to MySQL server');

      // Check if database exists
      const [databases] = await connection.query(
        'SHOW DATABASES LIKE ?',
        [this.databaseName]
      );

      if (databases.length === 0) {
        console.log(`  ⚠ Database '${this.databaseName}' not found`);
        console.log('  🔨 Creating database...');
        
        await connection.query(`CREATE DATABASE ${this.databaseName}`);
        console.log(`  ✅ Database '${this.databaseName}' created successfully`);
      } else {
        console.log(`  ✓ Database '${this.databaseName}' already exists`);
      }

      await connection.end();

    } catch (error) {
      if (connection) await connection.end();
      throw new Error(`Database check failed: ${error.message}`);
    }
  }

  /**
   * Ensure all tables exist, create if not
   */
  async ensureTables() {
    let connection;

    try {
      console.log('\n📋 Step 2: Checking tables...');
      
      // Connect with database name
      connection = await mysql.createConnection({
        ...this.config,
        database: this.databaseName
      });

      // Get existing tables
      const [tables] = await connection.query('SHOW TABLES');
      const existingTables = tables.map(row => Object.values(row)[0]);

      console.log(`  ℹ Found ${existingTables.length} existing table(s)`);

      // Check and create students table
      await this.ensureStudentsTable(connection, existingTables);

      // Check and create users table
      await this.ensureUsersTable(connection, existingTables);

      await connection.end();

    } catch (error) {
      if (connection) await connection.end();
      throw new Error(`Table check failed: ${error.message}`);
    }
  }

  /**
   * Ensure students table exists
   */
  async ensureStudentsTable(connection, existingTables) {
    if (!existingTables.includes('students')) {
      console.log('  ⚠ Table "students" not found');
      console.log('  🔨 Creating students table...');

      const studentsTableSQL = `
        CREATE TABLE students (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          phone VARCHAR(20),
          course VARCHAR(100),
          enrolment_date DATE,
          is_active TINYINT(1) DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_name (name),
          INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;

      await connection.query(studentsTableSQL);
      console.log('  ✅ Table "students" created successfully');
    } else {
      console.log('  ✓ Table "students" already exists');
      
      // Check if table needs schema update
      await this.updateStudentsTableSchema(connection);
    }
  }

  /**
   * Update students table schema if needed (add missing columns)
   */
  async updateStudentsTableSchema(connection) {
    try {
      // Check current columns
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_KEY 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '${this.databaseName}' 
        AND TABLE_NAME = 'students'
      `);
      
      const columnNames = columns.map(col => col.COLUMN_NAME);
      
      // Check if email needs to be updated
      const emailColumn = columns.find(col => col.COLUMN_NAME === 'email');
      if (emailColumn && (emailColumn.IS_NULLABLE === 'YES' || emailColumn.COLUMN_KEY !== 'UNI')) {
        console.log('  🔨 Updating email column to be UNIQUE and NOT NULL...');
        
        // First, update any NULL emails to a placeholder
        await connection.query(`
          UPDATE students 
          SET email = CONCAT('student', id, '@placeholder.com') 
          WHERE email IS NULL OR email = ''
        `);
        
        // Now alter the column
        await connection.query(`
          ALTER TABLE students 
          MODIFY COLUMN email VARCHAR(100) NOT NULL,
          ADD UNIQUE INDEX idx_email_unique (email)
        `);
        console.log('  ✅ Email column updated successfully');
      }
      
      // Add created_at if missing
      if (!columnNames.includes('created_at')) {
        console.log('  🔨 Adding created_at column...');
        await connection.query(`
          ALTER TABLE students 
          ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);
        console.log('  ✅ created_at column added');
      }
      
      // Add updated_at if missing
      if (!columnNames.includes('updated_at')) {
        console.log('  🔨 Adding updated_at column...');
        await connection.query(`
          ALTER TABLE students 
          ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        console.log('  ✅ updated_at column added');
      }
      
    } catch (error) {
      console.error('  ⚠️  Warning: Could not update students table schema:', error.message);
    }
  }

  /**
   * Ensure users table exists
   */
  async ensureUsersTable(connection, existingTables) {
    if (!existingTables.includes('users')) {
      console.log('  ⚠ Table "users" not found');
      console.log('  🔨 Creating users table...');

      const usersTableSQL = `
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_username (username),
          INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;

      await connection.query(usersTableSQL);
      console.log('  ✅ Table "users" created successfully');
    } else {
      console.log('  ✓ Table "users" already exists');
    }
  }

  /**
   * Check existing data (information only - does NOT create users)
   */
  async checkInitialData() {
    let connection;

    try {
      console.log('\n👤 Step 3: Checking existing data...');

      connection = await mysql.createConnection({
        ...this.config,
        database: this.databaseName
      });

      // Check user count
      const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
      const userCount = users[0].count;

      // Check student count
      const [students] = await connection.query('SELECT COUNT(*) as count FROM students');
      const studentCount = students[0].count;

      console.log(`  ℹ Found ${userCount} user(s) in database`);
      console.log(`  ℹ Found ${studentCount} student(s) in database`);

      if (userCount === 0) {
        console.log('\n  ⚠️  No users in database!');
        console.log('  ℹ️  To create your first account:');
        console.log('     1. Go to http://localhost:5173/register');
        console.log('     2. Enter admin registration code from .env file');
        console.log('     3. Fill in your account details');
        console.log('     4. Click "Register" to create your account');
        console.log('\n  💡 For development, you can also run:');
        console.log('     node database/migrations/migrate_test_users.js');
        console.log('     This creates test users (jagath & john)');
      }

      await connection.end();

    } catch (error) {
      if (connection) await connection.end();
      throw new Error(`Data check failed: ${error.message}`);
    }
  }

  /**
   * Get database status (for health checks)
   */
  async getStatus() {
    let connection;

    try {
      connection = await mysql.createConnection({
        ...this.config,
        database: this.databaseName
      });

      const [tables] = await connection.query('SHOW TABLES');
      const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
      const [studentCount] = await connection.query('SELECT COUNT(*) as count FROM students');

      await connection.end();

      return {
        database: this.databaseName,
        tables: tables.length,
        users: userCount[0].count,
        students: studentCount[0].count
      };

    } catch (error) {
      if (connection) await connection.end();
      throw error;
    }
  }
}

// Export singleton instance
const dbInitializer = new DatabaseInitializer();

module.exports = dbInitializer;
