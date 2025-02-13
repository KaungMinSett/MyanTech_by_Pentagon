import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth-slice";
import ordersReducer from "./features/orders/ordersSlice";
import employeesReducer from "./features/employees/employeesSlice";
import warehouseReducer from "./features/warehouse/warehouseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    employees: employeesReducer,
    warehouse: warehouseReducer,
  },
});
