# Student Manager - Frontend

A modern, responsive React application for managing student records with authentication and advanced UI features.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [Components Documentation](#components-documentation)
- [State Management](#state-management)
- [Authentication Flow](#authentication-flow)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework |
| **React Router** | 7.9.4 | Client-side routing |
| **Material-UI** | 7.3.4 | Component library |
| **Vite** | 7.1.9 | Build tool & dev server |
| **JavaScript** | ES6+ | Programming language |

---

## ✨ Features

### Authentication & Security
- ✅ **JWT Authentication** - Secure login/register with token storage
- ✅ **Protected Routes** - Redirect unauthorized users
- ✅ **Auto-logout on Token Expiry** - Session monitoring
- ✅ **Session Warning** - Alert 5 minutes before expiry
- ✅ **Form Validation** - Email, password validation

### Student Management
- ✅ **CRUD Operations** - Create, Read, Update, Delete students
- ✅ **Advanced Search** - Search by name, email, course
- ✅ **Multi-filter** - Filter by active/inactive/all
- ✅ **Multi-sort** - Sort by ID, name, email, course, date (asc/desc)
- ✅ **Bulk Operations** - Select and delete multiple students
- ✅ **Pagination** - Configurable records per page (5/8/10/15/20)

### UI/UX Features
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **Dark Theme** - Material-UI themed components
- ✅ **Loading States** - Spinners for async operations
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Modal Dialogs** - Add, Edit, View student modals
- ✅ **Customizable Columns** - Show/hide table columns
- ✅ **Settings Persistence** - localStorage for preferences

### Advanced Features
- ✅ **Clickable Rows** - Click to view student details
- ✅ **Conditional Rendering** - Different actions for active/inactive students
- ✅ **Sidebar Navigation** - Collapsible sidebar
- ✅ **User Profile** - View/edit user information
- ✅ **Settings Panel** - Customize table view

---

## 📁 Project Structure

```
Frontend/Student Manager App/
├── public/                   # Static assets
├── src/
│   ├── assets/              # Images, icons, etc.
│   ├── components/          # Reusable React components
│   │   ├── ActionToolbar.jsx       # Filter, Sort, Select All controls
│   │   ├── AddStudentModal.jsx     # Add student dialog
│   │   ├── EditStudentModal.jsx    # Edit student dialog
│   │   ├── FilterPopup.jsx         # Filter menu (legacy)
│   │   ├── LoadingSpinner.jsx      # Loading indicator
│   │   ├── ProtectedRoute.jsx      # Route authentication guard
│   │   ├── SearchBar.jsx           # Search component (legacy)
│   │   ├── SettingsModal.jsx       # Table settings dialog
│   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   ├── StudentTable.jsx        # Student data table
│   │   ├── TopBar.jsx              # App header with search
│   │   ├── UserProfileModal.jsx    # User profile dialog
│   │   └── ViewStudentModal.jsx    # Student details dialog
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx           # Main dashboard page
│   │   ├── LoginPage.jsx           # Login form
│   │   └── RegisterPage.jsx        # Registration form
│   ├── utils/               # Utility functions
│   │   ├── api.js                  # API request helpers
│   │   └── auth.js                 # Authentication utilities
│   ├── App.css              # Global styles
│   ├── App.jsx              # Root component
│   ├── index.css            # Base styles
│   └── main.jsx             # React entry point
├── .gitignore               # Git ignore rules
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML template
├── package.json             # Dependencies & scripts
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 20.16.0 or higher
- **npm** or **yarn** package manager
- **Backend API** running on `http://localhost:5000`

### Step 1: Install Dependencies

```bash
cd "Frontend/Student Manager App"
npm install
```

### Step 2: Configure API Endpoint

Edit `src/utils/api.js` if your backend runs on a different URL:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';  // Change if needed
```

### Step 3: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173` (or next available port).

### Step 4: Create Admin Account

1. Navigate to registration page
2. Fill in the form with admin code (from backend `.env`)
3. Login with your credentials

---

## 🔧 Environment Configuration

### Development Mode

The app runs in development mode by default with:
- Hot Module Replacement (HMR)
- Source maps for debugging
- Detailed error messages

### Production Build

```bash
npm run build
```

Creates optimized production build in `dist/` folder:
- Minified JavaScript/CSS
- Code splitting
- Tree shaking
- Asset optimization

### Preview Production Build

```bash
npm run preview
```

---

## 📦 Components Documentation

### Page Components

#### `LoginPage.jsx`
**Purpose:** User authentication interface

**Features:**
- Email & password validation
- "Remember me" checkbox
- Password visibility toggle
- Loading state
- Error handling
- Auto-redirect if already logged in

**State:**
```javascript
{
  email: string,
  password: string,
  rememberMe: boolean,
  showPassword: boolean,
  errors: object,
  loginError: string,
  isLoading: boolean
}
```

---

#### `RegisterPage.jsx`
**Purpose:** New user registration

**Features:**
- Username, email, password fields
- Password confirmation
- Admin code verification
- Validation (email format, password length)
- Loading state

**Required Fields:**
- Username
- Email (valid format)
- Password (min 6 characters)
- Confirm Password (must match)
- Admin Code (from backend)

---

#### `Dashboard.jsx`
**Purpose:** Main application interface

**Features:**
- Student table with pagination
- Search, filter, sort controls
- Add/Edit/View/Delete students
- Bulk selection and deletion
- Session monitoring
- Settings customization

**State Management:**
```javascript
{
  students: array,           // All students
  displayedStudents: array,  // Current page students
  searchQuery: string,
  selectedStudents: array,
  filterStatus: string,      // 'active' | 'inactive' | 'all'
  sortConfig: object,        // { field, order }
  currentPage: number,
  recordsPerPage: number,
  visibleColumns: array,
  sessionWarning: boolean
}
```

---

### Reusable Components

#### `TopBar.jsx`
**Purpose:** Application header with search and user menu

**Props:**
```javascript
{
  user: object,
  onLogout: function,
  pageTitle: string,
  searchQuery: string,
  onSearchChange: function,
  onSearch: function,
  onOpenSettings: function
}
```

**Features:**
- Global search bar
- User avatar and menu
- Profile access
- Settings access
- Logout option

---

#### `ActionToolbar.jsx`
**Purpose:** Filter, sort, and bulk selection controls

**Props:**
```javascript
{
  selectAll: boolean,
  onSelectAllChange: function,
  selectedCount: number,
  onFilterChange: function,
  currentFilter: string,
  onSortChange: function,
  currentSort: object
}
```

**Filter Options:**
- Active Students
- Inactive Students
- All Students

**Sort Options:**
- ID (Ascending/Descending)
- Name (A-Z / Z-A)
- Email (A-Z / Z-A)
- Course (A-Z / Z-A)
- Enrolment Date (Oldest/Newest)

---

#### `StudentTable.jsx`
**Purpose:** Display students in table format

**Props:**
```javascript
{
  students: array,
  selectedStudents: array,
  selectAll: boolean,
  onSelectAll: function,
  onSelectStudent: function,
  onView: function,
  onEdit: function,
  onDelete: function,
  visibleColumns: array
}
```

**Features:**
- Checkbox selection
- Clickable rows (opens view modal)
- Conditional action buttons (active vs inactive)
- Customizable columns
- Responsive layout

---

#### `AddStudentModal.jsx`
**Purpose:** Dialog for adding new students

**Form Fields:**
```javascript
{
  name: string (required),
  email: string (required, unique),
  phone: string,
  course: string,
  enrolment_date: date
}
```

**Validation:**
- Name is required
- Email must be valid format
- Email must be unique

---

#### `EditStudentModal.jsx`
**Purpose:** Dialog for editing existing students

**Features:**
- Pre-populated form fields
- Active status toggle
- Same validation as Add
- Success/error alerts

---

#### `ViewStudentModal.jsx`
**Purpose:** Read-only student details view

**Displays:**
- Name
- Email
- Phone
- Course
- Enrolment Date
- Active Status
- Created Date
- Last Updated

---

#### `SettingsModal.jsx`
**Purpose:** Customize table view preferences

**Settings:**
- Records per page (5/8/10/15/20)
- Visible columns (ID, Name, Phone, Email, Course)

**Persistence:** Saved to localStorage

---

#### `ProtectedRoute.jsx`
**Purpose:** Guard routes requiring authentication

**Logic:**
```javascript
if (!isAuthenticated()) {
  return <Navigate to="/" replace />;
}
return children;
```

---

#### `LoadingSpinner.jsx`
**Purpose:** Reusable loading indicator

**Modes:**
- Inline loading
- Full-screen overlay

**Props:**
```javascript
{
  message: string,
  size: number,
  overlay: boolean
}
```

---

## 🔐 Authentication Flow

### 1. Login Process

```
User enters credentials → Validate form → Valid?
  ├─ No → Show errors
  └─ Yes → Send POST to /api/auth/login
      └─ Response OK?
          ├─ Yes → Store token & user → Navigate to dashboard
          └─ No → Show error message
```

### 2. Protected Route Access

```javascript
// User tries to access /dashboard
ProtectedRoute checks:
  ├─ Token exists in localStorage?
  │  ├─ Yes → Parse JWT
  │  │  ├─ Token expired?
  │  │  │  ├─ Yes → Clear auth, redirect to login
  │  │  │  └─ No → Allow access
  │  └─ No → Redirect to login
```

### 3. Session Monitoring

```javascript
// Every 60 seconds (Dashboard component)
Check authentication:
  ├─ Token valid?
  │  ├─ No → Auto-logout, redirect with message
  │  └─ Yes → Token expiring soon?
  │     ├─ Yes → Show warning snackbar
  │     └─ No → Continue
```

### 4. API Request Authentication

```javascript
// Every API call (api.js)
1. Get token from localStorage
2. Add to Authorization header
3. Send request
4. Response status 401/403?
   ├─ Yes → Clear auth, redirect to login
   └─ No → Process response
```

---

## 🗂️ State Management

### Global State (Dashboard)

Managed in `Dashboard.jsx` component:

```javascript
const [students, setStudents] = useState([]);
const [allStudents, setAllStudents] = useState([]);
const [displayedStudents, setDisplayedStudents] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [selectedStudents, setSelectedStudents] = useState([]);
const [filterStatus, setFilterStatus] = useState('active');
const [sortConfig, setSortConfig] = useState({ field: 'none', order: 'none' });
const [currentPage, setCurrentPage] = useState(1);
const [recordsPerPage, setRecordsPerPage] = useState(8);
const [visibleColumns, setVisibleColumns] = useState(['id', 'name', 'phone', 'email', 'course']);
```

### Local Storage

**Authentication:**
```javascript
localStorage.setItem('token', jwt_token);
localStorage.setItem('user', JSON.stringify(user_object));
```

**User Preferences:**
```javascript
localStorage.setItem('recordsPerPage', number);
localStorage.setItem('visibleColumns', JSON.stringify(array));
```

### Props Drilling

Props are passed down from Dashboard to child components:
```
Dashboard
  ├─ TopBar (search, user, logout)
  ├─ ActionToolbar (filter, sort, select)
  ├─ StudentTable (students, actions)
  └─ Modals (student data, callbacks)
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (see error)
- [ ] Register new account
- [ ] Register with existing email (see error)
- [ ] Logout and verify redirect
- [ ] Access /dashboard without login (redirects to login)
- [ ] Login and refresh page (stays logged in)

#### Student Operations
- [ ] View all students
- [ ] Add new student
- [ ] Edit existing student
- [ ] Delete student (soft delete)
- [ ] View student details (click row)
- [ ] Search students by name/email/course
- [ ] Filter by active/inactive/all
- [ ] Sort by different fields
- [ ] Select multiple students
- [ ] Bulk delete students

#### UI/UX
- [ ] Pagination works correctly
- [ ] Settings persist after refresh
- [ ] Loading spinners appear during API calls
- [ ] Error messages display correctly
- [ ] Modals open/close properly
- [ ] Sidebar collapses on mobile
- [ ] Responsive on different screen sizes

### Browser Compatibility

Tested on:
- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

---

## 🏗️ Build & Deployment

### Local Build

```bash
npm run build
```

Output in `dist/` folder:
```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── index.html
```

### Deploy to Azure Static Web Apps

1. **Build Production Files**
   ```bash
   npm run build
   ```

2. **Create Azure Static Web App**
   - Portal → Create Resource → Static Web App
   - Connect to GitHub repo
   - Build preset: React
   - App location: `/Frontend/Student Manager App`
   - Output location: `dist`

3. **Configure Environment**
   - No environment variables needed (API URL hardcoded)
   - To use dynamic API URL, add during build:
     ```javascript
     const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
     ```

### Deploy to Other Platforms

#### Netlify
```bash
npm run build
# Drag & drop dist/ folder to Netlify
```

#### Vercel
```bash
npm run build
vercel --prod
```

#### GitHub Pages
```bash
npm run build
# Copy dist/ to gh-pages branch
```

---

## 📊 Performance Optimization

### Code Splitting

Vite automatically splits code:
- Vendor bundles
- Route-based chunks
- Dynamic imports

### Asset Optimization

- **Images:** Compress before adding to `assets/`
- **Icons:** Using Material-UI icons (tree-shaken)
- **Fonts:** System fonts (no external loading)

### Best Practices

✅ Lazy loading for routes  
✅ Memoization for expensive calculations  
✅ Debounced search input  
✅ Pagination to limit DOM nodes  
✅ Virtual scrolling for large lists (future enhancement)  

---

## 🎨 Styling

### Material-UI Theme

Using default Material-UI theme with custom colors:

```javascript
// Primary gradient
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

// Paper background
bgcolor: 'white'

// Text colors
color: 'text.primary'
color: 'text.secondary'
```

### Responsive Breakpoints

```javascript
xs: 0px      // Mobile
sm: 600px    // Tablet
md: 900px    // Desktop
lg: 1200px   // Large desktop
xl: 1536px   // Extra large
```

### Custom Styles

Located in:
- `App.css` - Global styles
- `index.css` - Base reset
- Inline `sx` props - Component-specific

---

## 🔧 Configuration Files

### `vite.config.js`

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
```

### `package.json` Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Vite will automatically try next port
Port 5173 is in use, trying another one...
VITE ready in 925 ms
➜ Local: http://localhost:5174/
```

### API Connection Error

**Error:** "Cannot connect to server"

**Solutions:**
1. Verify backend is running on port 5000
2. Check `API_BASE_URL` in `src/utils/api.js`
3. Verify CORS enabled in backend

### Build Errors

**Error:** Node version incompatible

**Solution:** Downgrade Vite or upgrade Node.js
```bash
npm install vite@5.4.11 --save-dev
```

### Session Expired Loop

**Issue:** Keeps redirecting to login

**Solution:** Clear browser localStorage
```javascript
localStorage.clear();
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Material-UI Docs](https://mui.com/material-ui/getting-started/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Docs](https://reactrouter.com/en/main)

---

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Contributors

**Student Manager Team**

For support or feature requests, please contact the development team.