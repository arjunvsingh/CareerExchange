// services/auth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const AUTH_TOKEN_KEY = 'user';

const authClient = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

const authService = {
  login: async (email, password) => {
    try {
      const response = await authClient.post('/login', { email, password });
      if (response.data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  },

  register: async (userData) => {
    try {
      const response = await authClient.post('/register', userData);
      if (response.data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    // Optional: Call backend to invalidate token
    authClient.post('/logout').catch(() => {
      // Ignore logout errors
      console.log('Logout completed');
    });
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem(AUTH_TOKEN_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Verify the current token is still valid
  verifyToken: async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user?.token) return false;

      const response = await authClient.post('/verify-token', {
        token: user.token
      });
      return response.data.valid;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  },

  // Update user's password
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await authClient.put('/password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await authClient.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to request password reset');
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await authClient.post('/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!user?.token;
  },

  // Get role-based access
  hasRole: (requiredRole) => {
    const user = authService.getCurrentUser();
    return user?.role === requiredRole;
  }
};

// Add authorization header to all requests if token exists
authClient.interceptors.request.use((config) => {
  const user = authService.getCurrentUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle token expiration
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default authService;