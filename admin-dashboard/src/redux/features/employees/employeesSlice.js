import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { initialStaffMembers, departments } from "@/mocks/employees/staff-data";
import axiosInstance from "@/api/axios";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      try {
        const response = await axiosInstance.get("/hr/employees/");
        console.log("API Response:", response.data);

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
      } catch (apiError) {
        console.log("API Error, falling back to mock data:", apiError);
        return initialStaffMembers;
      }
    } catch (error) {
      console.error("Error details:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch employees"
      );
    }
  }
);

export const createStaff = createAsyncThunk(
  "employees/createStaff",
  async (staffData, { rejectWithValue }) => {
    try {
      try {
        const response = await axiosInstance.post("/hr/employees/", staffData);
        console.log("API Response:", response.data);
        return response.data;
      } catch (apiError) {
        console.log("API Error, falling back to mock data:", apiError);

        const maxId = Math.max(
          ...initialStaffMembers.map((staff) => staff.id),
          0
        );

        const mockResult = {
          id: maxId + 1,
          name: staffData.username,
          email: staffData.email,
          password: staffData.password,
          role: staffData.role === 1 ? "Manager" : "Staff",
          department: departments.find((d) => d.id === staffData.department)
            ?.label,
          joinDate: staffData.joinDate,
          status: staffData.status,
        };

        console.log("Created mock staff:", mockResult);
        return mockResult;
      }
    } catch (error) {
      console.error("Error details:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data ||
          "Failed to create staff"
      );
    }
  }
);

export const updateStaffAsync = createAsyncThunk(
  "employees/updateStaff",
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/hr/employees/${staffData.id}/`,
        {
          user: {
            username: staffData.name,
            email: staffData.email,
          },
          role: staffData.role,
          department: staffData.department,
          status: staffData.status,
        }
      );

      if (response.data) {
        // Transform the response data to match your frontend structure
        const transformedData = {
          id: response.data.id,
          name: response.data.user.username,
          email: response.data.user.email,
          role: response.data.role,
          department: response.data.department,
          status: response.data.status,
          joinDate: response.data.created_at,
        };
        return transformedData;
      }
      return rejectWithValue("Failed to update employee");
    } catch (error) {
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
      const response = await axiosInstance.delete(`/hr/employees/${staffId}/`);
      if (response.status === 204) {
        return staffId;
      }
      return rejectWithValue("Failed to delete employee");
    } catch (error) {
      if (error.status === 404) {
        return rejectWithValue("Employee not found");
      }
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
