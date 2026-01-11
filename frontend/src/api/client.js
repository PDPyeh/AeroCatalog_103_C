import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

// Aircraft APIs
export const aircraftAPI = {
  getAll: (params) => apiClient.get('/aircraft', { params }),
  getById: (id) => apiClient.get(`/aircraft/${id}`),
  create: (data) => apiClient.post('/aircraft', data),
  update: (id, data) => apiClient.put(`/aircraft/${id}`, data),
  delete: (id) => apiClient.delete(`/aircraft/${id}`),
};

// Manufacturer APIs
export const manufacturerAPI = {
  getAll: () => apiClient.get('/manufacturers'),
  getById: (id) => apiClient.get(`/manufacturers/${id}`),
  create: (data) => apiClient.post('/manufacturers', data),
  update: (id, data) => apiClient.put(`/manufacturers/${id}`, data),
  delete: (id) => apiClient.delete(`/manufacturers/${id}`),
};

// Category APIs
export const categoryAPI = {
  getAll: () => apiClient.get('/categories'),
  getById: (id) => apiClient.get(`/categories/${id}`),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};

// API Key APIs
export const apiKeyAPI = {
  generate: (data) => apiClient.post('/admin/api-keys/generate', data),
  getAll: () => apiClient.get('/admin/api-keys'),
  revoke: (keyId) => apiClient.delete(`/admin/api-keys/${keyId}`),
};

// User APIs
export const userAPI = {
  getProfile: () => apiClient.get('/users/profile/me'),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
};

export default apiClient;
