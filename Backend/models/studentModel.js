const db = require('../config/database');

// All database queries for students in one place
const Student = {
  
  // Get all active students
  findAll: async () => {
    const [rows] = await db.query(
      'SELECT * FROM students WHERE is_active = true ORDER BY created_at DESC'
    );
    return rows;
  },

  // Get all inactive students
  findInactive: async () => {
    const [rows] = await db.query(
      'SELECT * FROM students WHERE is_active = false ORDER BY created_at DESC'
    );
    return rows;
  },

  // Get all students (active and inactive)
  findAllIncludingInactive: async () => {
    const [rows] = await db.query(
      'SELECT * FROM students ORDER BY created_at DESC'
    );
    return rows;
  },

  // Get single student by ID
  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT * FROM students WHERE id = ?',
      [id]
    );
    return rows[0]; // Return single student or undefined
  },

  // Check if email exists
  findByEmail: async (email) => {
    const [rows] = await db.query(
      'SELECT id FROM students WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  // Create new student
  create: async (studentData) => {
    const { name, email, phone, course, enrolment_date } = studentData;
    
    const [result] = await db.query(
      'INSERT INTO students (name, email, phone, course, enrolment_date) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, course || null, enrolment_date || null]
    );
    
    return result.insertId; // Return the new student's ID
  },

  // Update student
  update: async (id, studentData) => {
    const { name, email, phone, course, enrolment_date } = studentData;
    
    const [result] = await db.query(
      'UPDATE students SET name = ?, email = ?, phone = ?, course = ?, enrolment_date = ? WHERE id = ?',
      [name, email, phone || null, course || null, enrolment_date || null, id]
    );
    
    return result.affectedRows; // Return number of affected rows
  },

  // Soft delete (set is_active to false)
  softDelete: async (id) => {
    const [result] = await db.query(
      'UPDATE students SET is_active = false WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  },

  // Delete multiple students
  softDeleteMultiple: async (ids) => {
    const placeholders = ids.map(() => '?').join(',');
    const [result] = await db.query(
      `UPDATE students SET is_active = false WHERE id IN (${placeholders})`,
      ids
    );
    return result.affectedRows;
  },

  // Hard delete (actually remove from database) - use with caution!
  hardDelete: async (id) => {
    const [result] = await db.query(
      'DELETE FROM students WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  },

  // Search students
  search: async (searchTerm) => {
    const [rows] = await db.query(
      `SELECT * FROM students 
       WHERE is_active = true 
       AND (name LIKE ? OR email LIKE ? OR course LIKE ?)
       ORDER BY created_at DESC`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  }
};

module.exports = Student;
