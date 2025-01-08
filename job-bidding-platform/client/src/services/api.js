import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to requests if available
apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

const api = {
  // Auth related endpoints
  auth: {
    login: async (email, password) => {
      const response = await apiClient.post('/auth/login', { email, password });
      return response;
    },
    
    register: async (userData) => {
      const response = await apiClient.post('/auth/register', userData);
      return response;
    },
    
    verify: async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.token) return false;
      const response = await apiClient.post('/auth/verify-token', { token: user.token });
      return response.data.valid;
    },
    
    logout: async () => {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    }
  },

  // Job related endpoints
  jobs: {
    create: async (jobData) => {
      const response = await apiClient.post('/jobs', jobData);
      return response.data;
    },
    
    getAll: async (params = {}) => {
      const response = await apiClient.get('/jobs', { params });
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`/jobs/${id}`);
      return response.data;
    },
    
    update: async (id, jobData) => {
      const response = await apiClient.put(`/jobs/${id}`, jobData);
      return response.data;
    },

    delete: async (id) => {
      const response = await apiClient.delete(`/jobs/${id}`);
      return response.data;
    },

    // Get jobs posted by the current employer
    getMyPostedJobs: async () => {
      const response = await apiClient.get('/jobs/my-posts');
      return response.data;
    }
  },
  
  // Bid related endpoints
  bids: {
    create: async (jobId, bidData) => {
      const response = await apiClient.post(`/jobs/${jobId}/bids`, bidData);
      return response.data;
    },
    
    getByJobId: async (jobId) => {
      const response = await apiClient.get(`/jobs/${jobId}/bids`);
      return response.data;
    },

    getByFreelancerId: async () => {
      const response = await apiClient.get('/bids/my-bids');
      return response.data;
    },

    updateStatus: async (jobId, bidId, status) => {
      const response = await apiClient.patch(`/jobs/${jobId}/bids/${bidId}/status`, { status });
      return response.data;
    },

    getBidDetails: async (jobId, bidId) => {
      const response = await apiClient.get(`/jobs/${jobId}/bids/${bidId}`);
      return response.data;
    }
  },

  // User related endpoints
  users: {
    updateProfile: async (userData) => {
      const response = await apiClient.put('/users/profile', userData);
      return response.data;
    },

    getProfile: async () => {
      const response = await apiClient.get('/users/profile');
      return response.data;
    },

    // Get freelancer profile by ID (public data)
    getFreelancerProfile: async (freelancerId) => {
      const response = await apiClient.get(`/users/freelancers/${freelancerId}`);
      return response.data;
    }
  }
};

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;