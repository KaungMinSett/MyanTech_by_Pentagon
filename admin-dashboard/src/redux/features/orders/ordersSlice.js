import { createSlice } from '@reduxjs/toolkit';
import { orders as mockOrders } from '@/mocks/data';

const initialState = {
  orders: mockOrders,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.loading;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addOrder, setOrders, setLoading, setError } = ordersSlice.actions;
export default ordersSlice.reducer;