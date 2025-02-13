import { createSlice } from "@reduxjs/toolkit";
import { initialStaffMembers } from "@/mocks/employees/staff-data";

const initialState = {
  staffMembers: initialStaffMembers,
  selectedStaff: null,
  filter: "",
  searchQuery: "",
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
