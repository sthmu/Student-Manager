const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// ===== MIDDLEWARE =====
app.use(cors());                    // Enable CORS
app.use(express.json());            // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ===== ROUTES =====

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Student Manager API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            students: '/api/students'
        }
    });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Student routes
app.use('/api/students', studentRoutes);

// ===== ERROR HANDLING =====
app.use(notFound);          // Handle 404 errors
app.use(errorHandler);      // Handle all other errors

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('=================================');
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log('=================================');
});