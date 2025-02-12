import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/auth-slice';
import ordersReducer from './features/orders/ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
  },
});