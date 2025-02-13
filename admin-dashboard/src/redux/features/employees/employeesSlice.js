import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { initialStaffMembers } from "@/mocks/employees/staff-data";
import axiosInstance from "@/api/axios";

// Create new staff member
export const createStaff = createAsyncThunk(
  "employees/createStaff",
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/hr/employees/", staffData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create staff");
    }
  }
);

const initialState = {
  staffMembers: initialStaffMembers,
  selectedStaff: null,
  filter: "",
  searchQuery: "",
  loading: false,
  error: null,
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addStaff: (state, action) => {
      // Explicitly convert IDs to numbers and find max
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
