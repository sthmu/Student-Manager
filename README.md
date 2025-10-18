# 🎓 Student Manager

A full-stack web application for managing student records with secure authentication, advanced filtering, and modern UI/UX.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Security](#security)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## 🌟 Overview

Student Manager is a comprehensive student information management system built with React and Node.js. It provides secure user authentication, CRUD operations for student records, advanced search/filter/sort capabilities, and a responsive Material-UI interface.

**Perfect for:**
- Educational institutions
- Training centers
- Course management platforms
- Student data administrators

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Secure password hashing (bcrypt)
- Protected routes with auto-logout
- Session expiry warnings
- Admin code verification for registration

### 👨‍🎓 Student Management
- Create, Read, Update, Delete (CRUD) operations
- Soft delete functionality (active/inactive status)
- Bulk operations (select and delete multiple students)
- Advanced search across name, email, and course
- Multi-level filtering (active/inactive/all)
- Multi-field sorting (ID, name, email, course, date)

### 🎨 User Interface
- Modern Material-UI components
- Responsive design (mobile, tablet, desktop)
- Loading states and spinners
- Error handling with user-friendly messages
- Customizable table view
- Dark-themed interface

### 📊 Data Management
- Pagination with configurable records per page
- Clickable rows for quick view
- Modal dialogs for add/edit/view operations
- Settings persistence (localStorage)
- Real-time data updates

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI framework |
| React Router | 7.9.4 | Client-side routing |
| Material-UI | 7.3.4 | Component library |
| Vite | 7.1.9 | Build tool |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.16.0 | JavaScript runtime |
| Express | 4.21.1 | Web framework |
| MySQL | 8.0 | Database |
| JWT | 9.0.2 | Authentication |
| bcrypt | 5.1.1 | Password hashing |

---

## 📁 Project Structure

```
Student Manager/
├── Backend/                    # Node.js/Express API
│   ├── config/                # Database configuration
│   ├── controllers/           # Request handlers
│   ├── database/              # DB initialization
│   ├── middleware/            # Auth & error handling
│   ├── models/                # Data models
│   ├── routes/                # API routes
│   ├── tests/                 # Unit tests
│   ├── server.js              # Entry point
│   ├── package.json           # Dependencies
│   └── README.md              # API documentation
│
├── Frontend/                   # React application
│   └── Student Manager App/
│       ├── src/
│       │   ├── components/   # Reusable components
│       │   ├── pages/        # Page components
│       │   ├── utils/        # Utilities (auth, API)
│       │   ├── App.jsx       # Root component
│       │   └── main.jsx      # Entry point
│       ├── public/           # Static assets
│       ├── package.json      # Dependencies
│       └── README.md         # Frontend documentation
│
├── SECURITY_FEATURES.md       # Security implementation guide
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.16.0 or higher
- **MySQL** 8.0 or higher
- **npm** or **yarn**

### 1. Clone Repository

```bash
git clone <repository-url>
cd "Student Manager"
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_db
DB_PORT=3306
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h
ADMIN_CODE=your_admin_code
```

Initialize database:
```bash
node database/initializer.js
```

Start server:
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Setup Frontend

```bash
cd "Frontend/Student Manager App"
npm install
npm run dev
# App opens at http://localhost:5173
```

### 4. Create Admin Account

**IMPORTANT:** Registration requires an admin code for security.

1. Open `http://localhost:5173`
2. Click **"Sign Up"** (not "Sign In")
3. Fill in the registration form:
   - Username
   - Email
   - Password
   - Confirm Password
   - **Admin Code** (use `ADMIN_REGISTRATION_CODE` from Backend `.env` file)
     - Example: If your `.env` has `ADMIN_REGISTRATION_CODE=ADMIN2024`, enter `ADMIN2024`
4. After successful registration, you'll be redirected to login
5. Login with your email and password
6. Start managing students!

**Note:** Without the correct admin code from the `.env` file, registration will fail. This prevents unauthorized account creation.

---

## 📚 Documentation

Detailed documentation is available in each module:

### Backend Documentation
📄 [`Backend/README.md`](./Backend/README.md)
- API endpoints reference
- Database schema
- Setup instructions
- Testing guide
- Deployment guides (Azure, Heroku, AWS)

### Frontend Documentation
📄 [`Frontend/Student Manager App/README.md`](./Frontend/Student%20Manager%20App/README.md)
- Component documentation
- State management
- Authentication flow
- Build & deployment
- Troubleshooting

### Security Features
📄 [`SECURITY_FEATURES.md`](./SECURITY_FEATURES.md)
- JWT authentication
- Protected routes
- Auto-logout mechanism
- Security best practices

---

## 🔒 Security

This application implements industry-standard security practices:

✅ **Password Security**
- bcrypt hashing with salt rounds
- No plaintext password storage

✅ **Token-Based Authentication**
- JWT with configurable expiration
- Secure token storage (localStorage)
- Token validation on every request

✅ **Protected Routes**
- Frontend route guards
- Backend middleware verification
- Automatic session management

✅ **Input Validation**
- Email format validation
- Password strength requirements
- SQL injection prevention (parameterized queries)

✅ **Error Handling**
- Secure error messages (no sensitive info exposure)
- Proper HTTP status codes
- Centralized error middleware

For complete security implementation details, see [`SECURITY_FEATURES.md`](./SECURITY_FEATURES.md).

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login

### Students (Protected)
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Soft delete student
- `DELETE /api/students` - Bulk delete students

For detailed API documentation with request/response examples, see [`Backend/README.md`](./Backend/README.md#-api-endpoints).

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Students Table
```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  course VARCHAR(100),
  enrolment_date DATE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

For complete schema documentation, see [`Backend/README.md`](./Backend/README.md#-database-schema).

---

## 🚀 Deployment

### Backend Deployment (Azure App Service)

1. **Prepare Configuration**
   ```bash
   # Set environment variables in Azure Portal
   DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, ADMIN_CODE
   ```

2. **Deploy Code**
   ```bash
   # Using Azure CLI
   az webapp up --name your-app-name --resource-group your-rg
   ```

3. **Initialize Database**
   - Run `database/initializer.js` once
   - Can use Azure Cloud Shell or local connection

### Frontend Deployment (Azure Static Web Apps)

1. **Build Production**
   ```bash
   cd "Frontend/Student Manager App"
   npm run build
   ```

2. **Deploy to Azure**
   - Create Static Web App in Azure Portal
   - Connect to GitHub repository
   - Set build settings:
     - App location: `/Frontend/Student Manager App`
     - Output location: `dist`

3. **Update API URL**
   ```javascript
   // src/utils/api.js
   const API_BASE_URL = 'https://your-backend.azurewebsites.net/api';
   ```

For detailed deployment guides for multiple platforms, see:
- [`Backend/README.md - Deployment`](./Backend/README.md#-deployment)
- [`Frontend README - Build & Deployment`](./Frontend/Student%20Manager%20App/README.md#-build--deployment)

---

## 🧪 Testing

### Backend Tests

```bash
cd Backend
npm test
```

Test coverage includes:
- User model validation
- Password hashing
- User creation
- Email uniqueness

### Manual Testing

Use the comprehensive testing checklists in:
- [`Backend/README.md - Testing`](./Backend/README.md#-testing)
- [`Frontend README - Testing`](./Frontend/Student%20Manager%20App/README.md#-testing)

Includes:
- cURL examples for all endpoints
- Postman collection guidance
- Frontend UI/UX checklist

---

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
- ✅ Check MySQL is running
- ✅ Verify `.env` credentials
- ✅ Ensure database exists
- ✅ Check port 5000 is free

#### Frontend can't connect to API
- ✅ Verify backend is running on port 5000
- ✅ Check `API_BASE_URL` in `src/utils/api.js`
- ✅ Ensure CORS is enabled

#### Database connection errors
- ✅ Test MySQL connection manually
- ✅ Check firewall rules
- ✅ Verify user has proper permissions

#### Session expired loop
- ✅ Clear browser localStorage
- ✅ Check JWT_SECRET matches between sessions
- ✅ Verify token expiration time

For detailed troubleshooting, see module-specific READMEs.

---

## 📸 Screenshots

### Login Page
Modern authentication interface with validation

### Dashboard
Comprehensive student management with search, filter, and sort

### Student Table
Responsive table with pagination and bulk operations

### Modals
Add, Edit, View student dialogs with form validation

---

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Complete authentication system
- ✅ Full CRUD operations
- ✅ Advanced search/filter/sort
- ✅ Responsive UI with Material-UI
- ✅ Loading states and error handling
- ✅ Session management with auto-logout
- ✅ Comprehensive documentation

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Test thoroughly before submitting PR

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Authors

**Student Manager Development Team**

---

## 🙏 Acknowledgments

- Material-UI for the excellent component library
- Express.js community for robust backend framework
- React team for the amazing frontend library
- MySQL for reliable database management

---

## 📧 Support

For questions, issues, or feature requests:
1. Check the [documentation](#documentation)
2. Review the [troubleshooting](#troubleshooting) section
3. Open an issue on GitHub
4. Contact the development team

---

## 🗺️ Roadmap

Future enhancements planned:
- [ ] Export student data (CSV, Excel)
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] Role-based access control (Admin, Teacher, Viewer)
- [ ] Student import (bulk upload)
- [ ] Attendance tracking
- [ ] Grade management integration
- [ ] Mobile app (React Native)

---

**Built with ❤️ for educational institutions**
