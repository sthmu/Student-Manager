const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
// A pool manages multiple connections and reuses them efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'student_manager',
  waitForConnections: true,
  connectionLimit: 10,      // Maximum 10 connections at a time
  queueLimit: 0             // No limit on queued requests
});

// Use promise-based queries (async/await friendly)
const promisePool = pool.promise();

// Test database connection
promisePool.query('SELECT 1')
  .then(() => {
    console.log('Database successfully connected ');
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });

module.exports = promisePool;
