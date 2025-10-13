// Authentication logic with JWT and bcrypt
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// Get admin registration code from environment variables
const ADMIN_REGISTRATION_CODE = process.env.ADMIN_REGISTRATION_CODE || 'ADMIN2024';

const authController = {
  
  // Login handler with JWT - Now uses database
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validation
      if (!email || !password) {
        return res.status(400).json({ 
          message: 'Email and password are required' 
        });
      }
      
      // Find user in database by email
      const user = await User.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({ 
          message: 'Invalid email or password' 
        });
      }
      
      // Compare password with hashed password from database
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({ 
          message: 'Invalid email or password' 
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          username: user.username 
        },
        JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 24 hours
      );
      
      // Success - send token and user info (without password_hash)
      res.json({ 
        message: 'Login successful',
        token: token,
        user: { 
          id: user.id, 
          email: user.email,
          username: user.username
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Error during login',
        error: error.message 
      });
    }
  },

  // Logout handler
  logout: (req, res) => {
    // Client-side should remove token from localStorage
    res.json({ message: 'Logout successful' });
  },

  // Register handler with admin code verification
  register: async (req, res) => {
    try {
      const { username, email, password, adminCode } = req.body;
      
      // Validation
      if (!username || !email || !password || !adminCode) {
        return res.status(400).json({ 
          message: 'All fields are required: username, email, password, and admin code' 
        });
      }

      // Verify admin registration code
      if (adminCode !== ADMIN_REGISTRATION_CODE) {
        return res.status(403).json({ 
          message: 'Invalid admin registration code' 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          message: 'Invalid email format' 
        });
      }

      // Validate username (alphanumeric and underscore only)
      const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ 
          message: 'Username must be 3-50 characters and contain only letters, numbers, and underscores' 
        });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({ 
          message: 'Password must be at least 6 characters long' 
        });
      }

      // Check if username already exists
      const usernameExists = await User.usernameExists(username);
      if (usernameExists) {
        return res.status(409).json({ 
          message: 'Username already exists' 
        });
      }

      // Check if email already exists
      const emailExists = await User.emailExists(email);
      if (emailExists) {
        return res.status(409).json({ 
          message: 'Email already registered' 
        });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user in database
      const newUser = await User.create({
        username,
        email,
        password_hash
      });

      // Generate JWT token for immediate login
      const token = jwt.sign(
        { 
          id: newUser.id, 
          email: newUser.email,
          username: newUser.username 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Success
      res.status(201).json({ 
        message: 'User registered successfully',
        token: token,
        user: { 
          id: newUser.id, 
          email: newUser.email,
          username: newUser.username
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: 'Error during registration',
        error: error.message 
      });
    }
  }
};

module.exports = authController;
