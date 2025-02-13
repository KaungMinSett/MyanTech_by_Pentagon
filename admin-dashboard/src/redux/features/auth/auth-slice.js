import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authenticateUser } from "@/mocks/auth/users";
import axiosInstance from "@/api/axios";

// Get user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      try {
        const response = await axiosInstance.post("/employees/login/", {
          username,
          password,
        });

        console.log("API Response:", response.data);

        // Validate response structure
        if (
          !response.data.access ||
          !response.data.refresh ||
          !response.data.user
        ) {
          throw new Error("Invalid response format from server");
        }

        // Store tokens and user in localStorage
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return {
          user: response.data.user,
          token: response.data.access,
        };
      } catch (apiError) {
        console.error("API Error:", apiError);

        // Log detailed error information
        if (apiError.data) {
          console.error("API Error Details:", apiError.data);
        }

        // During development, fallback to mock data
        const mockResult = authenticateUser(username, password);
        if (!mockResult) {
          throw new Error("Invalid credentials");
        }

        // Store mock tokens and user in localStorage
        localStorage.setItem("access_token", mockResult.access);
        localStorage.setItem("refresh_token", mockResult.refresh);
        localStorage.setItem("user", JSON.stringify(mockResult.user));

        return {
          user: mockResult.user,
          token: mockResult.access,
        };
      }
    } catch (error) {
      // Handle both API and mock errors
      const errorMessage =
        error.data?.detail || error.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  isAuthenticated: !!localStorage.getItem("access_token"),
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("access_token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
