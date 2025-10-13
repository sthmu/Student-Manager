const Student = require('../models/studentModel');

// Business logic for student operations
const studentController = {

  // Get all students (with optional filters)
  getAllStudents: async (req, res) => {
    try {
      const { status } = req.query; // Get status filter from query params
      
      let students;
      if (status === 'active') {
        students = await Student.findAll();
      } else if (status === 'inactive') {
        students = await Student.findInactive();
      } else if (status === 'all') {
        students = await Student.findAllIncludingInactive();
      } else {
        // Default: return only active students
        students = await Student.findAll();
      }
      
      res.json({ students });
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ 
        message: 'Error fetching students',
        error: error.message 
      });
    }
  },

  // Get single student
  getStudentById: async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      res.json({ student });
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ 
        message: 'Error fetching student',
        error: error.message 
      });
    }
  },

  // Add new student
  addStudent: async (req, res) => {
    try {
      const { name, email, phone, course, enrolment_date } = req.body;
      
      // Validation
      if (!name || !email) {
        return res.status(400).json({ 
          message: 'Name and email are required' 
        });
      }

      // Email validation
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          message: 'Invalid email format' 
        });
      }
      
      // Check if email already exists
      const existingStudent = await Student.findByEmail(email);
      if (existingStudent) {
        return res.status(400).json({ 
          message: 'Email already exists' 
        });
      }
      
      // Create new student
      const studentId = await Student.create(req.body);
      
      // Get the newly created student
      const newStudent = await Student.findById(studentId);
      
      res.status(201).json({ 
        message: 'Student added successfully',
        student: newStudent
      });
      
    } catch (error) {
      console.error('Error adding student:', error);
      res.status(500).json({ 
        message: 'Error adding student',
        error: error.message 
      });
    }
  },

  // Update student
  updateStudent: async (req, res) => {
    try {
      const studentId = req.params.id;
      
      // Check if student exists
      const existingStudent = await Student.findById(studentId);
      if (!existingStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      // Update student
      await Student.update(studentId, req.body);
      
      // Get updated student
      const updatedStudent = await Student.findById(studentId);
      
      res.json({ 
        message: 'Student updated successfully',
        student: updatedStudent
      });
      
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ 
        message: 'Error updating student',
        error: error.message 
      });
    }
  },

  // Delete single student
  deleteStudent: async (req, res) => {
    try {
      const studentId = req.params.id;
      
      // Check if student exists
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      // Soft delete
      await Student.softDelete(studentId);
      
      res.json({ message: 'Student deleted successfully' });
      
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ 
        message: 'Error deleting student',
        error: error.message 
      });
    }
  },

  // Delete multiple students
  deleteMultipleStudents: async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid student IDs' });
      }
      
      const deletedCount = await Student.softDeleteMultiple(ids);
      
      res.json({ 
        message: `${deletedCount} students deleted successfully`,
        count: deletedCount
      });
      
    } catch (error) {
      console.error('Error deleting students:', error);
      res.status(500).json({ 
        message: 'Error deleting students',
        error: error.message 
      });
    }
  },

  // Search students
  searchStudents: async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const students = await Student.search(query);
      
      res.json({ 
        students,
        count: students.length 
      });
      
    } catch (error) {
      console.error('Error searching students:', error);
      res.status(500).json({ 
        message: 'Error searching students',
        error: error.message 
      });
    }
  }
};

module.exports = studentController;
