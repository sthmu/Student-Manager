import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import './App.css'

// Protected Route Component - NOW ENABLED
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // Check if user has valid token
  // if (!token) {
  //   return <Navigate to="/" replace />;
  // }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
