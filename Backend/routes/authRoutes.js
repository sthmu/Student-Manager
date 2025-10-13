const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define all authentication-related routes
// Base path: /api/auth

// POST /api/auth/login - User login
router.post('/login', authController.login);

// POST /api/auth/logout - User logout
router.post('/logout', authController.logout);

// POST /api/auth/register - User registration (future)
router.post('/register', authController.register);

module.exports = router;
