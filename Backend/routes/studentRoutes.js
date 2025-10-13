const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Define all student-related routes
// Base path: /api/students
// All routes require authentication (JWT token)

// GET /api/students - Get all students (Protected)
router.get('/', authenticateToken, studentController.getAllStudents);

// GET /api/students/search?query=john - Search students (Protected)
router.get('/search', authenticateToken, studentController.searchStudents);

// GET /api/students/:id - Get single student (Protected)
router.get('/:id', authenticateToken, studentController.getStudentById);

// POST /api/students - Add new student (Protected)
router.post('/', authenticateToken, studentController.addStudent);

// PUT /api/students/:id - Update student (Protected)
router.put('/:id', authenticateToken, studentController.updateStudent);

// DELETE /api/students/:id - Delete single student (Protected)
router.delete('/:id', authenticateToken, studentController.deleteStudent);

// POST /api/students/delete-multiple - Delete multiple students (Protected)
router.post('/delete-multiple', authenticateToken, studentController.deleteMultipleStudents);

module.exports = router;
