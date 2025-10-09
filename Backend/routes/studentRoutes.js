const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Define all student-related routes
// Base path: /api/students

// GET /api/students - Get all students
router.get('/', studentController.getAllStudents);

// GET /api/students/search?query=john - Search students
router.get('/search', studentController.searchStudents);

// GET /api/students/:id - Get single student
router.get('/:id', studentController.getStudentById);

// POST /api/students - Add new student
router.post('/', studentController.addStudent);

// PUT /api/students/:id - Update student
router.put('/:id', studentController.updateStudent);

// DELETE /api/students/:id - Delete single student
router.delete('/:id', studentController.deleteStudent);

// POST /api/students/delete-multiple - Delete multiple students
router.post('/delete-multiple', studentController.deleteMultipleStudents);

module.exports = router;
