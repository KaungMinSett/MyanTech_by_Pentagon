import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authenticateUser } from "@/mocks/auth/users";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Get user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Try API login first
      try {
        const response = await axiosInstance.post("/employees/login/", {
          email,
          password,
        });

        // Store token and user in localStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        return response.data;
      } catch (apiError) {
        // Fallback to mock data
        const mockResult = authenticateUser(email, password);
        if (!mockResult) {
          throw new Error("Invalid credentials");
        }

        // Store mock data in localStorage
        localStorage.setItem("token", mockResult.token);
        localStorage.setItem("user", JSON.stringify(mockResult.user));

        return mockResult;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isAuthenticated: !!getCurrentUser(),
  user: getCurrentUser(),
  token: localStorage.getItem("token"),
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
      localStorage.removeItem("token");
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
