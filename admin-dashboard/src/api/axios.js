import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track token refresh state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip authentication for public routes
    const publicRoutes = ['/sales/api/orders', '/api/shop/productlist/'];
    if (publicRoutes.some(route => config.url?.includes(route))) {
      return config;
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip token refresh for public routes
    const publicRoutes = ['/sales/api/orders', '/api/shop/productlist/'];
    if (publicRoutes.some(route => originalRequest.url?.includes(route))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `JWT ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${API_URL}/auth/jwt/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem("token", access);
        
        axiosInstance.defaults.headers.common['Authorization'] = `JWT ${access}`;
        originalRequest.headers.Authorization = `JWT ${access}`;
        
        processQueue(null, access);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        
        if (window.location.pathname !== '/login') {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;