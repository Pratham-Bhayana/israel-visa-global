// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/api/auth/login`,
  REGISTER: `${API_URL}/api/auth/register`,
  LOGOUT: `${API_URL}/api/auth/logout`,
  
  // Applications
  APPLICATIONS: `${API_URL}/api/applications`,
  
  // Admin
  ADMIN_DASHBOARD: `${API_URL}/api/admin/dashboard`,
  ADMIN_APPLICATIONS: `${API_URL}/api/admin/applications`,
  ADMIN_USERS: `${API_URL}/api/admin/users`,
  ADMIN_BLOGS: `${API_URL}/api/admin/blogs`,
  ADMIN_VISA_TYPES: `${API_URL}/api/admin/visa-types`,
  
  // Public
  BLOGS: `${API_URL}/api/blogs`,
  VISA_TYPES: `${API_URL}/api/visa-types`,
};

export default API_URL;
