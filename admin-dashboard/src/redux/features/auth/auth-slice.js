import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authenticateUser } from "@/mocks/auth/users";
import axiosInstance from "@/api/axios";

// Get user info after login
export const fetchUserInfo = createAsyncThunk(
  "auth/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      // Get both employee and user info
      const employeeResponse = await axiosInstance.get("/auth/employees/me/");
      const usersResponse = await axiosInstance.get("/auth/users/");

      const employee = employeeResponse.data;
      const user = usersResponse.data.find(
        (u) => u.username === employee.user.username
      );

      if (!user) {
        throw new Error("User not found");
      }

      return {
        employee,
        user,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch user info");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    try {
      try {
        const response = await axiosInstance.post("/auth/employees/login/", {
          username,
          password,
        });

        if (!response.data.access || !response.data.refresh) {
          throw new Error("Invalid response format from server");
        }

        // Store tokens
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        // Fetch user info
        await dispatch(fetchUserInfo());

        return {
          token: response.data.access,
        };
      } catch (apiError) {
        console.error("API Error:", apiError);

        // During development, fallback to mock data
        const mockResult = authenticateUser(username, password);
        if (!mockResult) {
          throw new Error("Invalid credentials");
        }

        localStorage.setItem("access_token", mockResult.access);
        localStorage.setItem("refresh_token", mockResult.refresh);
        localStorage.setItem("user", JSON.stringify(mockResult.user));

        return {
          user: mockResult.user,
          token: mockResult.access,
        };
      }
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
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
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.employee = action.payload.employee;
        state.isAuthenticated = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
