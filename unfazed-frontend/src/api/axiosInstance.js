import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('unfazed_auth_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Keep the COMPLETE Axios response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      'API Error:',
      error.response?.status,
      error.response?.data?.message || error.message
    );

    return Promise.reject(error);
  }
);

export default axiosInstance;