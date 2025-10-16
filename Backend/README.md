# Student Manager - Backend API

A RESTful API built with Node.js, Express, and MySQL for managing student records with authentication.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.16.0 | JavaScript runtime |
| **Express** | 4.21.1 | Web framework |
| **MySQL** | 8.0+ | Database |
| **mysql2** | 3.11.5 | MySQL client |
| **bcrypt** | 5.1.1 | Password hashing |
| **jsonwebtoken** | 9.0.2 | JWT authentication |
| **dotenv** | 16.4.7 | Environment variables |
| **cors** | 2.8.5 | Cross-origin requests |

---

## ✨ Features

- ✅ **User Authentication** - JWT-based login/register
- ✅ **Student CRUD Operations** - Create, Read, Update, Delete students
- ✅ **Filtering & Search** - Filter by active/inactive status
- ✅ **Secure Password Storage** - Bcrypt hashing
- ✅ **Protected Routes** - JWT middleware for authentication
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **CORS Enabled** - Cross-origin resource sharing
- ✅ **Environment Configuration** - Dotenv for secrets

---

## 📁 Project Structure

```
Backend/
├── config/
│   └── database.js          # MySQL connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic (login, register)
│   └── studentController.js # Student CRUD operations
├── database/
│   └── initializer.js       # Database & table initialization
├── middleware/
│   ├── authMiddleware.js    # JWT verification middleware
│   └── errorHandler.js      # Global error handler
├── models/
│   ├── studentModel.js      # Student database queries
│   └── userModel.js         # User database queries
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   └── studentRoutes.js     # Student routes
├── tests/
│   └── userModel.test.js    # User model tests
├── .env                      # Environment variables (not in git)
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies & scripts
├── server.js                # Express app entry point
└── README.md                # This file
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 20.16.0 or higher
- **MySQL** 8.0 or higher
- **npm** or **yarn** package manager

### Step 1: Install Dependencies

```bash
cd Backend
npm install
```

### Step 2: Setup MySQL Database

1. **Create Database:**
   ```sql
   CREATE DATABASE student_manager;
   ```

2. **Create MySQL User:**
   ```sql
   CREATE USER 'studentapp'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON student_manager.* TO 'studentapp'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your settings:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=studentapp
   DB_PASSWORD=your_password
   DB_NAME=student_manager

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your_super_secret_jwt_key_here

   # Admin Registration Code (required for creating admin users)
   ADMIN_CODE=admin123
   ```

### Step 4: Initialize Database Tables

The tables will be created automatically when you start the server:

```bash
npm start
```

You should see:
```
✓ Database initialized successfully
✓ Server running on http://localhost:5000
```

### Step 5: Verify Installation

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 🔐 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Server port |
| `NODE_ENV` | No | development | Environment (development/production) |
| `DB_HOST` | Yes | localhost | MySQL host |
| `DB_USER` | Yes | - | MySQL username |
| `DB_PASSWORD` | Yes | - | MySQL password |
| `DB_NAME` | Yes | student_manager | Database name |
| `JWT_SECRET` | Yes | - | Secret for JWT signing |
| `ADMIN_CODE` | Yes | - | Code required for registration |

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

---

### Authentication Endpoints

#### 1. Register User

Create a new admin user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "adminCode": "admin123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- `400` - Missing fields or invalid admin code
- `409` - Email already exists

---

#### 2. Login

Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

### Student Endpoints

**All student endpoints require authentication.** Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

#### 3. Get All Students

Retrieve all students with optional filtering.

**Endpoint:** `GET /students`

**Query Parameters:**
- `status` (optional): Filter by status
  - `active` - Only active students (default)
  - `inactive` - Only inactive students
  - `all` - All students

**Example Requests:**
```bash
# Get active students (default)
GET /students

# Get inactive students
GET /students?status=inactive

# Get all students
GET /students?status=all
```

**Response (200):**
```json
{
  "students": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "555-0101",
      "course": "Computer Science",
      "enrolment_date": "2024-01-15",
      "is_active": 1,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Errors:**
- `401` - Unauthorized (missing/invalid token)
- `500` - Server error

---

#### 4. Get Student by ID

Retrieve a single student by ID.

**Endpoint:** `GET /students/:id`

**Response (200):**
```json
{
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "555-0101",
    "course": "Computer Science",
    "enrolment_date": "2024-01-15",
    "is_active": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `404` - Student not found
- `401` - Unauthorized

---

#### 5. Create Student

Add a new student to the database.

**Endpoint:** `POST /students`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "555-0102",
  "course": "Business Administration",
  "enrolment_date": "2024-01-16"
}
```

**Response (201):**
```json
{
  "message": "Student created successfully",
  "student": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "555-0102",
    "course": "Business Administration",
    "enrolment_date": "2024-01-16",
    "is_active": 1
  }
}
```

**Validation Rules:**
- `name` - Required, string
- `email` - Required, valid email, unique
- `phone` - Optional, string
- `course` - Optional, string
- `enrolment_date` - Optional, date format

**Errors:**
- `400` - Missing required fields or validation error
- `409` - Email already exists
- `401` - Unauthorized

---

#### 6. Update Student

Update an existing student's information.

**Endpoint:** `PUT /students/:id`

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "phone": "555-9999",
  "course": "MBA",
  "enrolment_date": "2024-01-16",
  "is_active": true
}
```

**Response (200):**
```json
{
  "message": "Student updated successfully",
  "student": {
    "id": 2,
    "name": "Jane Smith Updated",
    "email": "jane.updated@example.com",
    "phone": "555-9999",
    "course": "MBA",
    "enrolment_date": "2024-01-16",
    "is_active": 1
  }
}
```

**Errors:**
- `404` - Student not found
- `400` - Validation error
- `401` - Unauthorized

---

#### 7. Delete Student

Soft delete a student (sets `is_active` to false).

**Endpoint:** `DELETE /students/:id`

**Response (200):**
```json
{
  "message": "Student deleted successfully"
}
```

**Errors:**
- `404` - Student not found
- `401` - Unauthorized

---

#### 8. Delete Multiple Students

Soft delete multiple students at once.

**Endpoint:** `POST /students/delete-multiple`

**Request Body:**
```json
{
  "ids": [1, 2, 3, 4, 5]
}
```

**Response (200):**
```json
{
  "message": "5 students deleted successfully"
}
```

**Errors:**
- `400` - Missing or invalid IDs array
- `401` - Unauthorized

---

## 🗄️ Database Schema

### Users Table

Stores admin user accounts.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user ID |
| `username` | VARCHAR(255) | NOT NULL | User's display name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Login email (unique) |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| `updated_at` | TIMESTAMP | AUTO UPDATE | Last update time |

---

### Students Table

Stores student records.

```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  course VARCHAR(255),
  enrolment_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique student ID |
| `name` | VARCHAR(255) | NOT NULL | Student's full name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Student email (unique) |
| `phone` | VARCHAR(20) | NULL | Contact phone number |
| `course` | VARCHAR(255) | NULL | Enrolled course name |
| `enrolment_date` | DATE | NULL | Date of enrollment |
| `is_active` | BOOLEAN | DEFAULT true | Active status (soft delete) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | AUTO UPDATE | Last update time |

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Manual API Testing

#### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "adminCode": "admin123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Students (replace YOUR_TOKEN)
curl http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create Student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Student",
    "email": "student@example.com",
    "phone": "555-1234",
    "course": "Testing 101",
    "enrolment_date": "2024-01-20"
  }'
```

#### Using Postman

1. Import the API endpoints
2. Create an environment variable for `{{token}}`
3. Test each endpoint with sample data

---

## 📦 Dependencies

```json
{
  "bcrypt": "^5.1.1",           // Password hashing
  "cors": "^2.8.5",             // CORS middleware
  "dotenv": "^16.4.7",          // Environment variables
  "express": "^4.21.1",         // Web framework
  "jsonwebtoken": "^9.0.2",     // JWT tokens
  "mysql2": "^3.11.5"           // MySQL client
}
```

---

## 🚀 Deployment

### Deploy to Azure App Service

1. **Create Azure Web App**
   ```bash
   az webapp create --name student-manager-api --resource-group myResourceGroup
   ```

2. **Configure Environment Variables**
   - Go to Azure Portal → Configuration
   - Add all `.env` variables as Application Settings

3. **Deploy Code**
   - Use VS Code Azure extension, or
   - Deploy from GitHub via Deployment Center

4. **Update Database Connection**
   - Use Azure Database for MySQL
   - Update `DB_HOST`, `DB_USER`, `DB_PASSWORD` in Azure config

### Deploy to Other Platforms

- **Heroku:** Use Heroku MySQL addon
- **AWS:** Use EC2 + RDS MySQL
- **DigitalOcean:** Use App Platform + Managed MySQL

---

## 🔒 Security Best Practices

1. ✅ **Never commit `.env` file** - Use `.env.example` template
2. ✅ **Use strong JWT_SECRET** - Generate random 256-bit string
3. ✅ **HTTPS in production** - Enable SSL/TLS
4. ✅ **Rate limiting** - Consider adding rate limiting middleware
5. ✅ **Input validation** - Validate all user inputs
6. ✅ **SQL injection protection** - Use parameterized queries (already implemented)
7. ✅ **Password requirements** - Enforce strong passwords in frontend

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start server in production mode |
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm test` | Run tests |

---

## 🐛 Troubleshooting

### Database Connection Error

```
Error: Access denied for user 'studentapp'@'localhost'
```

**Solution:** Check MySQL user permissions
```sql
GRANT ALL PRIVILEGES ON student_manager.* TO 'studentapp'@'localhost';
FLUSH PRIVILEGES;
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Change port in `.env` or kill process using port 5000

### JWT Token Expired

**Solution:** Token expires after 24 hours. Login again to get new token.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**Student Manager Team**

For questions or support, please contact the development team.
