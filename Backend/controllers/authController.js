// Authentication logic
// In the future, you can add bcrypt password hashing here

// Temporary users (replace with database later)
const users = [
  { id: 1, email: "jagath@hotmail.com", password: "jagath123" },
  { id: 2, email: "john@example.com", password: "john123" }
];

const authController = {
  
  // Login handler
  login: (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validation
      if (!email || !password) {
        return res.status(400).json({ 
          message: 'Email and password are required' 
        });
      }
      
      // Find user
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Success
        res.json({ 
          message: 'Login successful', 
          user: { 
            id: user.id, 
            email: user.email 
          }
        });
      } else {
        // Failed
        res.status(401).json({ 
          message: 'Invalid email or password' 
        });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Error during login',
        error: error.message 
      });
    }
  },

  // Logout handler (for future use)
  logout: (req, res) => {
    // In a real app, you would invalidate the JWT token here
    res.json({ message: 'Logout successful' });
  },

  // Register handler (for future use)
  register: (req, res) => {
    // TODO: Implement user registration with password hashing
    res.json({ message: 'Registration endpoint - coming soon' });
  }
};

module.exports = authController;
