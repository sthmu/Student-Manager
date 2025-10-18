// Basic API Tests - Working Example
const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const studentRoutes = require('../routes/studentRoutes');
const { authenticateToken } = require('../middleware/authMiddleware');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/students', authenticateToken, studentRoutes);

// Test data
let testUser;
let authToken;
let testStudent;

describe('🚀 Basic API Tests', () => {
  
  // ==================== SETUP ====================
  
  beforeAll(() => {
    // Generate unique test data
    const timestamp = Date.now();
    testUser = {
      username: `testuser_${timestamp}`,
      email: `test_${timestamp}@example.com`,
      password: 'Test@12345',
      adminCode: process.env.ADMIN_REGISTRATION_CODE
    };
  });

  // ==================== AUTHENTICATION TESTS ====================
  
  describe('Authentication', () => {
    
    test('✅ Should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testUser.email.toLowerCase());
    });

    test('✅ Should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      
      // Save token for future tests
      authToken = response.body.token;
    });

    test('❌ Should fail login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  // ==================== STUDENT CRUD TESTS ====================
  
  describe('Student Operations', () => {
    
    let createdStudentId;

    beforeAll(() => {
      // Generate unique student data
      const timestamp = Date.now();
      testStudent = {
        name: `Test Student ${timestamp}`,
        email: `student_${timestamp}@example.com`,
        phone: '1234567890',
        course: 'Computer Science',
        status: 'active'
      };
    });

    test('✅ Should create a new student', async () => {
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testStudent)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Student added successfully');
      expect(response.body).toHaveProperty('student');
      expect(response.body.student).toHaveProperty('id');
      
      createdStudentId = response.body.student.id;
    });

    test('✅ Should fetch all students', async () => {
      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('students');
      expect(Array.isArray(response.body.students)).toBe(true);
      expect(response.body.students.length).toBeGreaterThan(0);
    });

    test('✅ Should fetch student by ID', async () => {
      const response = await request(app)
        .get(`/api/students/${createdStudentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('student');
      expect(response.body.student).toHaveProperty('id', createdStudentId);
      expect(response.body.student).toHaveProperty('name', testStudent.name);
      expect(response.body.student).toHaveProperty('email', testStudent.email.toLowerCase());
    });

    test('✅ Should update student', async () => {
      const updatedData = {
        name: 'Updated Name',
        email: testStudent.email, // Keep same email (required field)
        phone: '9999999999',
        course: testStudent.course // Keep course (required field)
      };

      const response = await request(app)
        .put(`/api/students/${createdStudentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Student updated successfully');
    });

    test('❌ Should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/students')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    test('✅ Should delete student', async () => {
      const response = await request(app)
        .delete(`/api/students/${createdStudentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Student deleted successfully');
    });
  });
});
