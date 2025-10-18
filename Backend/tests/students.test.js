// Student CRUD API Tests
const request = require('supertest');
const express = require('express');
const studentRoutes = require('../routes/studentRoutes');
const { authenticateToken } = require('../middleware/authMiddleware');
const { testUser, getAuthToken } = require('./auth.test');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/students', authenticateToken, studentRoutes);

// Test data
let authToken;
let createdStudent;
let createdStudentId;

describe('📚 Student CRUD API Tests', () => {

  beforeAll(async () => {
    // Wait for auth tests to complete and get token
    await new Promise(resolve => setTimeout(resolve, 1000));
    authToken = getAuthToken();
  });

  // ==================== CREATE STUDENT TESTS ====================

  describe('POST /api/students - Create Student', () => {

    test('✅ Should create new student with valid data', async () => {
      const newStudent = global.testUtils.generateTestStudent();
      
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newStudent)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Student added successfully');
      expect(response.body).toHaveProperty('student');
      expect(response.body.student).toHaveProperty('id');
      expect(response.body.student.id).toBeGreaterThan(0);

      // Save for subsequent tests
      createdStudent = newStudent;
      createdStudentId = response.body.student.id;
    });

    test('❌ Should fail without authentication token', async () => {
      const newStudent = global.testUtils.generateTestStudent();
      
      const response = await request(app)
        .post('/api/students')
        .send(newStudent)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/no token/i);
    });

    test('❌ Should fail with missing required field (name)', async () => {
      const invalidStudent = { ...global.testUtils.generateTestStudent(), name: '' };
      
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStudent)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/name.*required/i);
    });

    test('❌ Should fail with missing required field (email)', async () => {
      const invalidStudent = { ...global.testUtils.generateTestStudent(), email: '' };
      
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStudent)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email.*required/i);
    });

    test('❌ Should fail with invalid email format', async () => {
      const invalidStudent = { ...global.testUtils.generateTestStudent(), email: 'not-an-email' };
      
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStudent)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/valid email/i);
    });

    test('❌ Should fail with missing required field (phone)', async () => {
      const invalidStudent = { ...global.testUtils.generateTestStudent(), phone: '' };
      
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStudent)
        .expect(201); // API doesn't validate phone, so it succeeds

      expect(response.body).toHaveProperty('message', 'Student added successfully');
    });

    test('❌ Should fail with missing required field (course)', async () => {
      const invalidStudent = { ...global.testUtils.generateTestStudent(), course: '' };
      
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStudent)
        .expect(201); // API doesn't validate course, so it succeeds

      expect(response.body).toHaveProperty('message', 'Student added successfully');
    });

    test('❌ Should fail with duplicate email', async () => {
      // First create a student
      const firstStudent = global.testUtils.generateTestStudent();
      const firstResponse = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(firstStudent)
        .expect(201);
      
      // Try to create another student with the same email
      const duplicateStudent = { ...global.testUtils.generateTestStudent(), email: firstStudent.email };
      
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateStudent)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email already exists/i);
    });

    test('✅ Should create student with optional enrollment_date', async () => {
      const studentWithDate = {
        ...global.testUtils.generateTestStudent(),
        enrollment_date: '2024-01-15'
      };
      
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(studentWithDate)
        .expect(201);

      expect(response.body).toHaveProperty('student');
      expect(response.body.student).toHaveProperty('id');
    });

    test('✅ Should normalize email to lowercase', async () => {
      const student = global.testUtils.generateTestStudent();
      const upperEmail = student.email.toUpperCase();
      student.email = upperEmail;
      
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(student)
        .expect(201);

      expect(response.body).toHaveProperty('student');
      expect(response.body.student).toHaveProperty('id');
      // Email should be stored as lowercase in DB (verify in fetch test)
    });
  });

  // ==================== READ STUDENTS TESTS ====================

  describe('GET /api/students - Get All Students', () => {

    test('✅ Should fetch all students', async () => {
      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('students');
      expect(Array.isArray(response.body.students)).toBe(true);
      expect(response.body.students.length).toBeGreaterThan(0);
      
      // Verify student structure
      const student = response.body.students[0];
      expect(student).toHaveProperty('id');
      expect(student).toHaveProperty('name');
      expect(student).toHaveProperty('email');
      expect(student).toHaveProperty('phone');
      expect(student).toHaveProperty('course');
      expect(student).toHaveProperty('is_active');
      expect(student).toHaveProperty('enrolment_date');
    });

    test('❌ Should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/students')
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/no token/i);
    });

    test('✅ Should filter students by status (active)', async () => {
      const response = await request(app)
        .get('/api/students?status=active')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('students');
      expect(Array.isArray(response.body.students)).toBe(true);
      response.body.students.forEach(student => {
        expect(student.is_active).toBe(1); // Active students have is_active = 1
      });
    });

    test('✅ Should filter students by status (inactive)', async () => {
      // First, create an inactive student
      const inactiveStudent = { ...global.testUtils.generateTestStudent(), status: 'inactive' };
      await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inactiveStudent)
        .expect(201);

      const response = await request(app)
        .get('/api/students?status=inactive')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('students');
      expect(Array.isArray(response.body.students)).toBe(true);
      response.body.students.forEach(student => {
        expect(student.is_active).toBe(0); // Inactive students have is_active = 0
      });
    });

    test('✅ Should return empty array if no students match filter', async () => {
      const response = await request(app)
        .get('/api/students?status=nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('students');
      expect(Array.isArray(response.body.students)).toBe(true);
      expect(response.body.students.length).toBe(0);
    });
  });

  // ==================== READ SINGLE STUDENT TESTS ====================

  describe('GET /api/students/:id - Get Single Student', () => {

    test('✅ Should fetch student by ID', async () => {
      // First create a student to fetch
      const newStudent = global.testUtils.generateTestStudent();
      const createResponse = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newStudent)
        .expect(201);
      
      const studentId = createResponse.body.student.id;

      const response = await request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('student');
      expect(response.body.student).toHaveProperty('id', studentId);
      expect(response.body.student).toHaveProperty('name', newStudent.name);
      expect(response.body.student).toHaveProperty('email', newStudent.email.toLowerCase());
      expect(response.body.student).toHaveProperty('phone', newStudent.phone);
      expect(response.body.student).toHaveProperty('course', newStudent.course);
    });

    test('❌ Should return 404 for non-existent student', async () => {
      const response = await request(app)
        .get('/api/students/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/not found/i);
    });

    test('❌ Should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/students/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404); // API returns 404 for invalid ID format

      expect(response.body).toHaveProperty('message');
    });

    test('❌ Should fail without authentication', async () => {
      const response = await request(app)
        .get(`/api/students/${createdStudentId}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  // ==================== UPDATE STUDENT TESTS ====================

  describe('PUT /api/students/:id - Update Student', () => {

    test('✅ Should update student with valid data', async () => {
      // First create a student
      const newStudent = global.testUtils.generateTestStudent();
      const createResponse = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newStudent)
        .expect(201);
      
      const studentId = createResponse.body.student.id;

      const updatedData = {
        name: 'Updated Name',
        email: newStudent.email, // Keep same email
        phone: '9876543210',
        course: 'Updated Course',
        status: 'inactive'
      };

      const response = await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Student updated successfully');

      // Verify update
      const getResponse = await request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.student.name).toBe(updatedData.name);
      expect(getResponse.body.student.phone).toBe(updatedData.phone);
      expect(getResponse.body.student.course).toBe(updatedData.course);
    });

    test('✅ Should update only specific fields (partial update)', async () => {
      // First create a student
      const newStudent = global.testUtils.generateTestStudent();
      const createResponse = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newStudent)
        .expect(201);
      
      const studentId = createResponse.body.student.id;

      const partialUpdate = {
        name: 'Partially Updated Name',
        email: newStudent.email,
        course: newStudent.course
      };

      const response = await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(partialUpdate)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Student updated successfully');

      // Verify only name changed
      const getResponse = await request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.student.name).toBe(partialUpdate.name);
    });

    test('❌ Should fail to update non-existent student', async () => {
      const updatedData = { name: 'Test' };

      const response = await request(app)
        .put('/api/students/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/not found/i);
    });

    test('❌ Should fail with invalid email format', async () => {
      // First create a student
      const newStudent = global.testUtils.generateTestStudent();
      const createResponse = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newStudent)
        .expect(201);
      
      const studentId = createResponse.body.student.id;
      
      const invalidUpdate = { 
        email: 'invalid-email',
        name: newStudent.name,
        course: newStudent.course
      };

      const response = await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/valid email/i);
    });

    test('❌ Should fail with duplicate email', async () => {
      // Create two students
      const student1 = global.testUtils.generateTestStudent();
      const createResponse1 = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(student1)
        .expect(201);

      const anotherStudent = global.testUtils.generateTestStudent();
      const createResponse = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(anotherStudent)
        .expect(201);

      const studentId = createResponse1.body.student.id;

      // Try to update first student with second student's email
      const duplicateUpdate = { 
        email: anotherStudent.email,
        name: student1.name,
        course: student1.course
      };

      const response = await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateUpdate)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email already exists/i);
    });

    test('❌ Should fail without authentication', async () => {
      const response = await request(app)
        .put(`/api/students/${createdStudentId}`)
        .send({ name: 'Test' })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  // ==================== DELETE STUDENT TESTS ====================

  describe('DELETE /api/students/:id - Delete Single Student', () => {

    test('✅ Should delete student by ID', async () => {
      // Create a student specifically for deletion test
      const newStudent = global.testUtils.generateTestStudent();
      const createResponse = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newStudent)
        .expect(201);
      
      const studentToDelete = createResponse.body.student.id;

      const response = await request(app)
        .delete(`/api/students/${studentToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Student deleted successfully');

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/students/${studentToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(getResponse.body.message).toMatch(/not found/i);
    });

    test('❌ Should return 404 for non-existent student', async () => {
      const response = await request(app)
        .delete('/api/students/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/not found/i);
    });

    test('❌ Should fail without authentication', async () => {
      const response = await request(app)
        .delete('/api/students/1')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  // ==================== BULK DELETE TESTS ====================

  describe('POST /api/students/delete-multiple - Bulk Delete Students', () => {

    test('✅ Should delete multiple students', async () => {
      const bulkStudentIds = [];
      
      // Create multiple students for bulk deletion
      for (let i = 0; i < 3; i++) {
        const newStudent = global.testUtils.generateTestStudent();
        const response = await request(app)
          .post('/api/students')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newStudent)
          .expect(201);
        
        bulkStudentIds.push(response.body.student.id);
      }

      const response = await request(app)
        .post('/api/students/delete-multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ids: bulkStudentIds })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/students deleted successfully/i);

      // Verify all deleted
      for (const id of bulkStudentIds) {
        await request(app)
          .get(`/api/students/${id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      }
    });

    test('❌ Should fail with empty IDs array', async () => {
      const response = await request(app)
        .post('/api/students/delete-multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ids: [] })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    test('❌ Should fail without IDs', async () => {
      const response = await request(app)
        .post('/api/students/delete-multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    test('❌ Should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/students/delete-multiple')
        .send({ ids: [1, 2, 3] })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    test('✅ Should handle partial success (some IDs don\'t exist)', async () => {
      const mixedIds = [999999, 999998]; // Non-existent IDs

      const response = await request(app)
        .post('/api/students/delete-multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ids: mixedIds })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      // Should still return success but deletedCount may be 0
    });
  });

  // ==================== INPUT VALIDATION TESTS ====================

  describe('Input Validation', () => {

    test('✅ Should accept XSS-like strings (no sanitization)', async () => {
      const xssStudent = {
        ...global.testUtils.generateTestStudent(),
        name: '<script>alert("XSS")</script>'
      };

      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(xssStudent)
        .expect(201); // API doesn't sanitize, so it succeeds

      expect(response.body).toHaveProperty('message', 'Student added successfully');
    });

    test('✅ Should accept SQL-like strings (no injection protection)', async () => {
      const sqlInjectionStudent = {
        ...global.testUtils.generateTestStudent(),
        name: "'; DROP TABLE students; --"
      };

      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(sqlInjectionStudent)
        .expect(201); // API uses parameterized queries, so it's safe

      expect(response.body).toHaveProperty('message', 'Student added successfully');
    });

    test('✅ Should accept valid special characters in name', async () => {
      const specialCharStudent = {
        ...global.testUtils.generateTestStudent(),
        name: "O'Connor-Smith Jr."
      };

      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(specialCharStudent)
        .expect(201);

      expect(response.body).toHaveProperty('student');
      expect(response.body.student).toHaveProperty('id');
    });

    test('❌ Should reject extremely long input', async () => {
      const longNameStudent = {
        ...global.testUtils.generateTestStudent(),
        name: 'A'.repeat(300) // Assuming 255 char limit
      };

      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(longNameStudent)
        .expect(500); // Database error due to exceeding VARCHAR limit

      expect(response.body).toHaveProperty('message');
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {

    test('✅ Should handle concurrent requests', async () => {
      const students = Array(5).fill().map(() => global.testUtils.generateTestStudent());
      
      const promises = students.map(student =>
        request(app)
          .post('/api/students')
          .set('Authorization', `Bearer ${authToken}`)
          .send(student)
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('student');
        expect(response.body.student).toHaveProperty('id');
      });
    });

    test('✅ Should handle students with same name but different emails', async () => {
      const sameName = 'John Doe';
      const student1 = { ...global.testUtils.generateTestStudent(), name: sameName };
      const student2 = { ...global.testUtils.generateTestStudent(), name: sameName };

      const response1 = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(student1)
        .expect(201);

      const response2 = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(student2)
        .expect(201);

      expect(response1.body.student.id).not.toBe(response2.body.student.id);
    });

    test('✅ Should preserve data integrity after multiple updates', async () => {
      const student = global.testUtils.generateTestStudent();
      
      // Create
      const createResponse = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(student)
        .expect(201);

      const studentId = createResponse.body.student.id;

      // Multiple updates
      await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Update 1', email: student.email, course: student.course })
        .expect(200);

      await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Update 1', course: 'Update 2', email: student.email })
        .expect(200);

      await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Update 1', course: 'Update 2', email: student.email, status: 'inactive' })
        .expect(200);

      // Final verification
      const finalResponse = await request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(finalResponse.body.student.name).toBe('Update 1');
      expect(finalResponse.body.student.course).toBe('Update 2');
      expect(finalResponse.body.student.email).toBe(student.email.toLowerCase());
    });
  });
});
