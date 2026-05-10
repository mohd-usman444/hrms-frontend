import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Determine the role from the current page URL
const getRoleFromPath = () => {
  const path = window.location.pathname;
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/user')) return 'user';
  return null;
};

// Add a request interceptor to add the correct token based on current route
api.interceptors.request.use(
  (config) => {
    // Allow callers to explicitly specify the role via config._role
    const role = config._role || getRoleFromPath();
    if (role) {
      const token = localStorage.getItem(`hrms_${role}_token`);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const role = getRoleFromPath();
      if (role) {
        localStorage.removeItem(`hrms_${role}_token`);
        localStorage.removeItem(`hrms_${role}_user`);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
