import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { initialStaffMembers } from "@/mocks/employees/staff-data";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = initialStaffMembers.find(
        (staff) => staff.email === email && staff.password === password
      );

      if (user) {
        // Create a sanitized user object without the password
        const { password: _, ...userWithoutPassword } = user;
        const result = {
          user: userWithoutPassword,
          token: `mock-token-${user.id}-${Date.now()}`,
        };

        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        return result;
      }

      return rejectWithValue("Invalid email or password");
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
