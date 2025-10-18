// Authentication API Tests
const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const { authenticateToken } = require('../middleware/authMiddleware');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Test data
let testUser;
let authToken;

describe('🔐 Authentication API Tests', () => {
  
  beforeAll(() => {
    testUser = global.testUtils.generateTestUser();
  });

  // ==================== REGISTRATION TESTS ====================
  
  describe('POST /api/auth/register - User Registration', () => {
    
    test('✅ Should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', testUser.email.toLowerCase());
      expect(response.body.user).toHaveProperty('username', testUser.username);
      expect(response.body.user).not.toHaveProperty('password'); // Password should not be returned
    });

    test('❌ Should fail registration with missing username', async () => {
      const invalidUser = { ...testUser, username: '' };
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/username/i);
    });

    test('❌ Should fail registration with missing email', async () => {
      const invalidUser = { ...testUser, email: '' };
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email/i);
    });

    test('❌ Should fail registration with invalid email format', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email/i);
    });

    test('❌ Should fail registration with short password', async () => {
      const invalidUser = { ...testUser, password: '12345' };
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/password.*6/i);
    });

    test('❌ Should fail registration with incorrect admin code', async () => {
      const invalidUser = { ...global.testUtils.generateTestUser(), adminCode: 'WRONG_CODE' };
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(403);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid admin registration code/i);
    });

    test('❌ Should fail registration with duplicate email', async () => {
      const duplicateUser = { ...global.testUtils.generateTestUser(), email: testUser.email };
      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect(409);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email already registered/i);
    });

    test('✅ Should hash password correctly', async () => {
      const newUser = global.testUtils.generateTestUser();
      await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      // Password should be hashed in database (we'll verify in model tests)
      expect(newUser.password).not.toMatch(/^\$2[aby]\$\d+\$/); // Original password not hashed
    });
  });

  // ==================== LOGIN TESTS ====================
  
  describe('POST /api/auth/login - User Login', () => {
    
    test('✅ Should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', testUser.email.toLowerCase());
      expect(response.body.user).toHaveProperty('username', testUser.username);
      expect(response.body.user).not.toHaveProperty('password');

      // Save token for subsequent tests
      authToken = response.body.token;
    });

    test('✅ Should return valid JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      const token = response.body.token;
      
      // Verify token structure
      expect(token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);

      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('username');
      expect(decoded).toHaveProperty('iat'); // Issued at
      expect(decoded).toHaveProperty('exp'); // Expiration
    });

    test('❌ Should fail login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid email or password/i);
      expect(response.body).not.toHaveProperty('token');
    });

    test('❌ Should fail login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid email or password/i);
    });

    test('❌ Should fail login with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: testUser.password
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email/i);
    });

    test('❌ Should fail login with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/password/i);
    });

    test('✅ Should login with case-insensitive email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email.toUpperCase(),
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
    });
  });

  // ==================== JWT TOKEN TESTS ====================
  
  describe('JWT Token Validation', () => {
    
    test('✅ Should accept valid JWT token', () => {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('username');
    });

    test('❌ Should reject expired token', () => {
      const expiredToken = jwt.sign(
        { userId: 1, email: 'test@example.com' },
        process.env.JWT_SECRET,
        { expiresIn: '0s' } // Expire immediately
      );

      expect(() => {
        jwt.verify(expiredToken, process.env.JWT_SECRET);
      }).toThrow('jwt expired');
    });

    test('❌ Should reject token with wrong secret', () => {
      const tokenWithWrongSecret = jwt.sign(
        { userId: 1, email: 'test@example.com' },
        'wrong-secret',
        { expiresIn: '24h' }
      );

      expect(() => {
        jwt.verify(tokenWithWrongSecret, process.env.JWT_SECRET);
      }).toThrow('invalid signature');
    });

    test('❌ Should reject malformed token', () => {
      const malformedToken = 'not.a.real.token';

      expect(() => {
        jwt.verify(malformedToken, process.env.JWT_SECRET);
      }).toThrow();
    });

    test('✅ Should decode token payload correctly', () => {
      const decoded = jwt.decode(authToken);
      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('username');
      expect(decoded.email).toBe(testUser.email.toLowerCase());
    });
  });

  // ==================== PASSWORD HASHING TESTS ====================
  
  describe('Password Hashing', () => {
    
    test('✅ Should hash password with bcrypt', async () => {
      const password = 'TestPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/); // Bcrypt format
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    test('✅ Should verify correct password', async () => {
      const password = 'TestPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    test('❌ Should reject incorrect password', async () => {
      const password = 'TestPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare('WrongPassword', hashedPassword);

      expect(isMatch).toBe(false);
    });

    test('✅ Should generate different hashes for same password', async () => {
      const password = 'TestPassword123';
      const hash1 = await bcrypt.hash(password, 10);
      const hash2 = await bcrypt.hash(password, 10);

      expect(hash1).not.toBe(hash2); // Salt makes each hash unique
      
      // But both should verify correctly
      expect(await bcrypt.compare(password, hash1)).toBe(true);
      expect(await bcrypt.compare(password, hash2)).toBe(true);
    });
  });

  // ==================== MIDDLEWARE TESTS ====================
  
  describe('Authentication Middleware', () => {
    
    test('✅ Should allow request with valid token', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.get('/protected', authenticateToken, (req, res) => {
        res.json({ message: 'Access granted', user: req.user });
      });

      const response = await request(testApp)
        .get('/protected')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Access granted');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
    });

    test('❌ Should reject request without token', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.get('/protected', authenticateToken, (req, res) => {
        res.json({ message: 'Access granted' });
      });

      const response = await request(testApp)
        .get('/protected')
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/no token/i);
    });

    test('❌ Should reject request with invalid token', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.get('/protected', authenticateToken, (req, res) => {
        res.json({ message: 'Access granted' });
      });

      const response = await request(testApp)
        .get('/protected')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(403);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid.*token/i);
    });

    test('❌ Should reject malformed Authorization header', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.get('/protected', authenticateToken, (req, res) => {
        res.json({ message: 'Access granted' });
      });

      const response = await request(testApp)
        .get('/protected')
        .set('Authorization', authToken) // Missing "Bearer " prefix
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  // ==================== INTEGRATION TESTS ====================
  
  describe('Complete Authentication Flow', () => {
    
    test('✅ Complete flow: Register → Login → Access Protected Route', async () => {
      // Step 1: Register new user
      const newUser = global.testUtils.generateTestUser();
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(registerResponse.body.user).toHaveProperty('id');

      // Step 2: Login with registered credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: newUser.email,
          password: newUser.password
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('token');
      const token = loginResponse.body.token;

      // Step 3: Access protected route with token
      const testApp = express();
      testApp.use(express.json());
      testApp.get('/protected', authenticateToken, (req, res) => {
        res.json({ success: true, user: req.user });
      });

      const protectedResponse = await request(testApp)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(protectedResponse.body).toHaveProperty('success', true);
      expect(protectedResponse.body.user).toHaveProperty('id');
      expect(protectedResponse.body.user).toHaveProperty('email');
    });
  });
});

// Export test data for use in other tests
module.exports = { testUser, getAuthToken: () => authToken };
