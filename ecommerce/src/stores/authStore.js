import { defineStore } from 'pinia';
import axiosInstance  from '../axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    user: null,
    isActive: false,
  }),
  actions: {
    async login(username, password) {
      await this.handleAsync(async () => {
        const res = await axiosInstance.post('auth/customers/login', {
          username,
          password,
        });
        this.saveToken(res.data.refresh, res.data.access);
        this.isActive = true;
      });
    },

    async signup(username, email, password) {
        await this.handleAsync(async () => {
            const res = await axiosInstance.post('auth/users/', {
              username,
              email,
              password
            });
          });
    },

    async getUser() {
      if (localStorage.getItem('token') && !this.user) {
        await this.handleAsync(
          () => this.fetchUserData(),
          async (error) => this.handleTokenError(error)
        );
      } else {
        console.log('No token found or user already loaded');
      }
    },

    async fetchUserData() {
      const res = await axiosInstance.get('auth/users/me');
      this.user = res.data;
      this.isActive = true;
    },

    async handleTokenError(error) {
      if (error.response && error.response.data.code === 'token_not_valid') {
        await this.refreshToken();
      } else {
        this.logoutUser();
      }
    },

    async refreshToken() {
      try {
        const refreshResponse = await axiosInstance.post('auth/jwt/refresh', {
          refresh: localStorage.getItem('refresh'),
        });
        localStorage.setItem('token', refreshResponse.data.access);
        location.reload();
      } catch (refreshError) {
        this.logoutUser();
      }
    },

    logoutUser() {
      this.removeToken();
      location.reload();
    },

    saveToken(refresh, access) {
      localStorage.setItem('token', access);
      localStorage.setItem('refresh', refresh);
    },

    removeToken() {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
    },

    removeUserData() {
      this.user = null;
      this.removeToken();
      this.isActive = false;
    },

    timeAgo(timestamp) {
      const now = new Date();
      const past = new Date(timestamp);
      const diffInSeconds = Math.floor((now - past) / 1000);

      const seconds = diffInSeconds;
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) {
        return `${seconds} seconds ago`;
      } else if (minutes < 60) {
        return `${minutes} minutes ago`;
      } else if (hours < 24) {
        return `${hours} hours ago`;
      } else if (days === 1) {
        return 'yesterday';
      } else {
        return `${days} days ago`;
      }
    },

    async handleAsync(task, errorTask, errorMessage = 'Something went wrong', loading = true) {
      this.loading = loading;
      try {
        const result = await task();
        return result;
      } catch (error) {
        if (errorTask) {
          await errorTask(error);
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});