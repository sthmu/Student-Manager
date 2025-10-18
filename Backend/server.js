const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database initializer
const dbInitializer = require('./database/initializer');

// Import routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// ===== MIDDLEWARE =====

// Enhanced CORS configuration for both local dev and Azure deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',           // Vite dev server (default)
      'http://localhost:5174',           // Vite dev server (alternate)
      'http://127.0.0.1:5173',           // Local IP variant
      'http://127.0.0.1:5174',           // Local IP variant
      'http://20.81.132.208',            // Your Azure VM IP
      /\.azurestaticapps\.net$/          // Any Azure Static Web Apps domain
    ];
    
    // Check if origin matches allowed patterns
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked request from origin: ${origin}`);
      callback(null, true); // Allow anyway for now (remove in production)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));         // Enable CORS with custom config
app.use(express.json());            // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Handle preflight requests
app.options('*', cors(corsOptions));

// ===== ROUTES =====

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Student Manager API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            students: '/api/students',
            health: '/health'
        }
    });
});

// Health check route with database status
app.get('/health', async (req, res) => {
    try {
        const dbStatus = await dbInitializer.getStatus();
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: {
                connected: true,
                name: dbStatus.database,
                tables: dbStatus.tables,
                users: dbStatus.users,
                students: dbStatus.students
            }
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            database: {
                connected: false,
                error: error.message
            }
        });
    }
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

// Initialize database before starting server
async function startServer() {
    try {
        // Auto-initialize database
        console.log('\n🚀 Starting Student Manager API...\n');
        
        const initResult = await dbInitializer.initialize();
        
        if (!initResult.success) {
            console.error('\n⚠️  Warning: Database initialization failed');
            console.error('⚠️  Server will start, but database may not be ready');
            console.error('⚠️  Error:', initResult.error);
            console.error('\n');
        }

        // Start Express server
        app.listen(PORT, () => {
            console.log('\n' + '='.repeat(60));
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📍 http://localhost:${PORT}`);
            console.log('='.repeat(60));
            console.log('\nAPI Endpoints:');
            console.log('  POST   /api/auth/login       - User login');
            console.log('  POST   /api/auth/register    - User registration');
            console.log('  GET    /api/students         - Get all students');
            console.log('  POST   /api/students         - Add new student');
            console.log('  PUT    /api/students/:id     - Update student');
            console.log('  DELETE /api/students/:id     - Delete student');
            console.log('='.repeat(60) + '\n');
        });

    } catch (error) {
        console.error('\n❌ Failed to start server');
        console.error('Error:', error.message);
        console.error('\nPlease check:');
        console.error('  1. MySQL server is running');
        console.error('  2. Database credentials in .env file');
        console.error('  3. Required npm packages are installed\n');
        process.exit(1);
    }
}

// Start the server
startServer();