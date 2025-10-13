const jwt = require('jsonwebtoken');

// JWT Secret (should be in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }
    
    // Verify token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          message: 'Invalid or expired token.' 
        });
      }
      
      // Add user info to request object
      req.user = user;
      next();
    });
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Error authenticating token',
      error: error.message 
    });
  }
};

// Optional: Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Admin rights required.' 
    });
  }
};

module.exports = { 
  authenticateToken, 
  isAdmin,
  JWT_SECRET 
};
