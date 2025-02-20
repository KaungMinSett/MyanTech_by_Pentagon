import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axios";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/hr/employees/");

      const transformedData = response.data.map((employee) => ({
        id: employee.id,
        name: employee.user.username,
        email: employee.user.email,
        role: employee.role,
        department: employee.department,
        status: employee.status || "Available",
        joinDate: employee.created_at,
      }));

      return transformedData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch employees"
      );
    }
  }
);

export const fetchRoles = createAsyncThunk(
  "employees/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/hr/roles/");
      const transformedRoles = response.data.map((role) => ({
        id: role.id,
        name: role.name,
      }));
      return transformedRoles;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch roles"
      );
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  "employees/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/hr/departments/");
      const transformedDepartments = response.data.map((dept) => ({
        id: dept.id,
        name: dept.name,
      }));
      return transformedDepartments;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch departments"
      );
    }
  }
);

export const createStaff = createAsyncThunk(
  "employees/createStaff",
  async (staffData, { rejectWithValue, dispatch }) => {
    try {
      const formattedData = {
        username: staffData.username.trim(),
        email: staffData.email.trim(),
        password: staffData.password,
        role: parseInt(staffData.role),
        department: parseInt(staffData.department),
        status: staffData.status || "Available",
      };

      const response = await axiosInstance.post(
        "/hr/employees/",
        formattedData
      );

      await dispatch(fetchEmployees());

      return {
        id: response.data.id,
        name: response.data.user.username,
        email: response.data.user.email,
        role: response.data.role,
        department: response.data.department,
        status: response.data.status,
        joinDate: response.data.created_at,
      };
    } catch (error) {
      if (error.response?.status === 201 || error.response?.status === 200) {
        await dispatch(fetchEmployees());
        return {};
      }

      const errorData = error.response?.data;
      if (errorData?.username)
        return rejectWithValue("Username is already taken");
      if (errorData?.email) return rejectWithValue("Email is already in use");
      if (errorData?.role) return rejectWithValue("Invalid role selected");
      if (errorData?.department)
        return rejectWithValue("Invalid department selected");
      if (errorData?.password) return rejectWithValue("Password is required");

      return rejectWithValue("Failed to create employee");
    }
  }
);

export const updateStaffAsync = createAsyncThunk(
  "employees/updateStaff",
  async (staffData, { rejectWithValue }) => {
    try {
      // Format the data according to the API's expected structure
      const formattedData = {
        user: {
          username: staffData.name,
          email: staffData.email,
          id: staffData.userId, // Add the user ID to identify the existing user
        },
        role: Number(staffData.role),
        department: Number(staffData.department),
        status: staffData.status || "Available",
      };

      const response = await axiosInstance.put(
        `/hr/employees/${staffData.id}/`,
        formattedData
      );

      if (response.data) {
        return {
          id: response.data.id,
          userId: response.data.user.id,
          name: response.data.user.username,
          email: response.data.user.email,
          role: response.data.role,
          department: response.data.department,
          status: response.data.status,
          joinDate: response.data.created_at,
        };
      }
      return rejectWithValue("Failed to update employee");
    } catch (error) {
      console.error("Update error:", error.response?.data);
      if (error.response?.data?.user?.email) {
        // If it's an email error, but we're updating the same user, ignore it
        if (
          error.response.data.user.email[0] ===
          "user with this email already exists."
        ) {
          return rejectWithValue(
            "Cannot update: Email already exists for another user"
          );
        }
      }
      return rejectWithValue(
        error.response?.data?.detail || "Failed to update employee"
      );
    }
  }
);

export const deleteStaffAsync = createAsyncThunk(
  "employees/deleteStaff",
  async (staffId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/hr/employees/${staffId}/`);
      return staffId;
    } catch (error) {
      console.error("Delete error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.detail || "Failed to delete employee"
      );
    }
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    staffMembers: [],
    roles: [],
    departments: [],
    selectedStaff: null,
    filter: "",
    searchQuery: "",
    loading: false,
    error: null,
  },
  reducers: {
    addStaff: (state, action) => {
      const maxId = Math.max(
        ...state.staffMembers.map((staff) => Number(staff.id)),
        0
      );

      const newStaff = {
        ...action.payload,
        id: maxId + 1,
        status: "Available",
        joinDate: new Date().toISOString().split("T")[0],
      };
      state.staffMembers.push(newStaff);
    },
    updateStaff: (state, action) => {
      const index = state.staffMembers.findIndex(
        (member) => member.id === action.payload.id
      );
      if (index !== -1) {
        state.staffMembers[index] = action.payload;
      }
    },
    deleteStaff: (state, action) => {
      state.staffMembers = state.staffMembers.filter(
        (member) => member.id !== action.payload
      );
    },
    setSelectedStaff: (state, action) => {
      state.selectedStaff = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.staffMembers = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
        state.loading = false;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
        state.loading = false;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.staffMembers.push(action.payload);
        state.loading = false;
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStaffAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaffAsync.fulfilled, (state, action) => {
        const index = state.staffMembers.findIndex(
          (staff) => staff.id === action.payload.id
        );
        if (index !== -1) {
          state.staffMembers[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateStaffAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteStaffAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaffAsync.fulfilled, (state, action) => {
        state.staffMembers = state.staffMembers.filter(
          (member) => member.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteStaffAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectFilteredStaff = (state) => {
  const { staffMembers, filter, searchQuery } = state.employees;
  return staffMembers.filter(
    (member) =>
      [member.name, member.role, member.email]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery?.toLowerCase() || "") &&
      (filter === "" || member.role === filter || member.status === filter)
  );
};

export const {
  addStaff,
  updateStaff,
  deleteStaff,
  setSelectedStaff,
  setFilter,
  setSearchQuery,
} = employeesSlice.actions;

export default employeesSlice.reducer;
