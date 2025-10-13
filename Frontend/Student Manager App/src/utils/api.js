// API utility functions for authenticated requests

const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with authorization token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Authenticated GET request
export const apiGet = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    // Check if token is invalid/expired
    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      throw new Error('Unauthorized - please login again');
    }
    
    return response;
  } catch (error) {
    console.error('API GET error:', error);
    throw error;
  }
};

// Authenticated POST request
export const apiPost = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      throw new Error('Unauthorized - please login again');
    }
    
    return response;
  } catch (error) {
    console.error('API POST error:', error);
    throw error;
  }
};

// Authenticated PUT request
export const apiPut = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      throw new Error('Unauthorized - please login again');
    }
    
    return response;
  } catch (error) {
    console.error('API PUT error:', error);
    throw error;
  }
};

// Authenticated DELETE request
export const apiDelete = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      throw new Error('Unauthorized - please login again');
    }
    
    return response;
  } catch (error) {
    console.error('API DELETE error:', error);
    throw error;
  }
};

// Handle unauthorized access
const handleUnauthorized = () => {
  // Clear stored auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect to login
  window.location.href = '/';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};
