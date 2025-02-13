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
  async ({ email, password }, { rejectWithValue }) => {
    try {
      try {
        const response = await axiosInstance.post("/employees/login/", {
          email,
          password,
        });

        // Log the response to check the structure
        console.log("API Response:", response.data);

        // Validate response structure
        if (
          !response.data.access ||
          !response.data.refresh ||
          !response.data.user
        ) {
          throw new Error("Invalid response format from server");
        }

        // Validate user object structure
        const {
          id,
          email: userEmail,
          name,
          department,
          role,
        } = response.data.user;
        if (!id || !userEmail || !name || !department || !role) {
          throw new Error("Missing required user fields in response");
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
        console.error("API Error Response:", apiError.response?.data);

        // During development, fallback to mock data
        const mockResult = authenticateUser(email, password);
        if (!mockResult) {
          throw new Error("Invalid credentials");
        }
        return mockResult;
      }
    } catch (error) {
      return rejectWithValue(error.message);
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
