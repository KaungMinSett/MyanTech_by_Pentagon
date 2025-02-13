import { createSlice } from "@reduxjs/toolkit";
import { orders as mockOrders } from "@/mocks/data";
import { deliveredOrders as mockDeliveredOrders } from "@/mocks/sales/order-history";
import { createSelector } from "reselect";

const initialState = {
  orders: mockOrders,
  deliveredOrders: mockDeliveredOrders,
  selectedOrder: null,
  dateFilter: {
    startDate: "",
    endDate: "",
  },
  searchQuery: "",
  sortBy: "date",
  sortOrder: "desc",
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        id: `#${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      state.orders.unshift(newOrder);
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(
        (order) => order.id === action.payload.id
      );
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    moveToDelivered: (state, action) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) {
        state.deliveredOrders.push({ ...order, status: "delivered" });
        state.orders = state.orders.filter((o) => o.id !== action.payload);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Base selector
export const selectOrdersState = (state) => ({
  orders: state.orders.orders,
  dateFilter: state.orders.dateFilter,
  searchQuery: state.orders.searchQuery,
});

// Memoized selector
export const selectFilteredOrders = createSelector(
  [selectOrdersState],
  ({ orders, dateFilter, searchQuery }) => {
    return orders.filter((order) => {
      const matchesSearch =
        !searchQuery ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate =
        !dateFilter.startDate ||
        (new Date(order.created_at) >= new Date(dateFilter.startDate) &&
          new Date(order.created_at) <= new Date(dateFilter.endDate));
      return matchesSearch && matchesDate;
    });
  }
);

export const {
  addOrder,
  setOrders,
  updateOrder,
  setSelectedOrder,
  setDateFilter,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  moveToDelivered,
  setLoading,
  setError,
} = ordersSlice.actions;

export default ordersSlice.reducer;
