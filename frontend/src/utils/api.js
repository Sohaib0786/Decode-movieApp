import axios from 'axios';

const api = axios.create({
  baseURL: 'https://decode-movieapp-backend.onrender.com/api',
  timeout: 30000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
