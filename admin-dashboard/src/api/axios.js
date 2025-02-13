import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

    // Check if error.response exists before accessing status
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${API_URL}/jwt/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem("access_token", response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Return a structured error object
    return Promise.reject({
      status: error.response?.status,
      data: error.response?.data,
      message: error.message || "Network error occurred",
    });
  }
);

export default axiosInstance;
