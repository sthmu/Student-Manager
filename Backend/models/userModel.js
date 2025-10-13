/**
 * User Model
 * Handles all database operations for the users table
 */

const db = require('../config/database');

const User = {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password_hash - Hashed password
   * @returns {Promise<Object>} Created user data
   */
  async create(userData) {
    const { username, email, password_hash } = userData;
    
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `;
    
    const [result] = await db.query(query, [username, email, password_hash]);
    
    return {
      id: result.insertId,
      username,
      email,
      created_at: new Date()
    };
  },

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User data or null
   */
  async findById(id) {
    const query = 'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find user by username
   * @param {string} username - Username
   * @returns {Promise<Object|null>} User data or null
   */
  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await db.query(query, [username]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find user by email
   * @param {string} email - Email address
   * @returns {Promise<Object|null>} User data or null
   */
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Get all users
   * @returns {Promise<Array>} Array of users (without password_hash)
   */
  async findAll() {
    const query = 'SELECT id, username, email, created_at, updated_at FROM users ORDER BY created_at DESC';
    const [rows] = await db.query(query);
    return rows;
  },

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<boolean>} Success status
   */
  async update(id, updates) {
    const allowedFields = ['username', 'email', 'password_hash'];
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  },

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  },

  /**
   * Check if username exists
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if exists
   */
  async usernameExists(username) {
    const query = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
    const [rows] = await db.query(query, [username]);
    return rows[0].count > 0;
  },

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if exists
   */
  async emailExists(email) {
    const query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    const [rows] = await db.query(query, [email]);
    return rows[0].count > 0;
  },

  /**
   * Get user count
   * @returns {Promise<number>} Total number of users
   */
  async count() {
    const query = 'SELECT COUNT(*) as count FROM users';
    const [rows] = await db.query(query);
    return rows[0].count;
  }
};

module.exports = User;
