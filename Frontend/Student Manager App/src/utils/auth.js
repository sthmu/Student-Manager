/**
 * Authentication Utilities
 * Handles token management, validation, and session checking
 */

/**
 * Store authentication token and user data
 */
export const setAuthToken = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get authentication token
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get user data
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Clear authentication data (logout)
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  // Check if token is expired
  try {
    const payload = parseJWT(token);
    if (!payload || !payload.exp) return false;
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const isExpired = payload.exp * 1000 < Date.now();
    
    if (isExpired) {
      clearAuth();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking token:', error);
    return false;
  }
};

/**
 * Parse JWT token to get payload
 */
export const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

/**
 * Get token expiry time in milliseconds
 */
export const getTokenExpiry = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  const payload = parseJWT(token);
  if (!payload || !payload.exp) return null;
  
  return payload.exp * 1000; // Convert to milliseconds
};

/**
 * Get time until token expires (in milliseconds)
 */
export const getTimeUntilExpiry = () => {
  const expiry = getTokenExpiry();
  if (!expiry) return 0;
  
  return expiry - Date.now();
};

/**
 * Check if token will expire soon (within 5 minutes)
 */
export const isTokenExpiringSoon = () => {
  const timeUntilExpiry = getTimeUntilExpiry();
  return timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000; // 5 minutes
};
