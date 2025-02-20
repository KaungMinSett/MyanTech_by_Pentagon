import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axios";
import { createSelector } from "reselect";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const [
        ordersResponse,
        employeesResponse,
        usersResponse,
        productsResponse,
        customersResponse,
      ] = await Promise.all([
        axiosInstance.get("/sales/api/orders"),
        axiosInstance.get("/hr/employees/"),
        axiosInstance.get("/auth/users/"),
        axiosInstance.get("/api/shop/productlist/"),
        axiosInstance.get("/sales/api/customers/"),
      ]);

      // Create lookup objects
      const employees = employeesResponse.data.reduce((acc, emp) => {
        acc[emp.id] = emp.user.username;
        return acc;
      }, {});

      const users = usersResponse.data.reduce((acc, user) => {
        acc[user.id] = user.username;
        return acc;
      }, {});

      const products = productsResponse.data.reduce((acc, product) => {
        acc[product.id] = product.name;
        return acc;
      }, {});

      const customers = customersResponse.data.reduce((acc, customer) => {
        acc[customer.id] = customer.full_name;
        return acc;
      }, {});

      const transformedData = ordersResponse.data.map((order) => ({
        id: `#${order.id}`,
        products: order.order_items.map(
          (item) => products[item.product] || `Product ${item.product}`
        ),
        quantities: order.order_items.map((item) => item.quantity),
        date: new Date(order.order_date).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        customer: customers[order.customer] || `Customer ${order.customer}`,
        payment:
          order.reconciliation_status === "COMPLETED" ? "Success" : "Pending",
        total: order.order_items
          .reduce(
            (sum, item) => sum + parseFloat(item.unit_price) * item.quantity,
            0
          )
          .toFixed(2),
        items: order.order_items.length,
        order_type: order.order_type,
        employee: employees[order.employee] || "System",
        status: order.status,
      }));

      return transformedData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const payload = {
        customer: orderData.customer,
        address: orderData.address,
        order_type: orderData.order_type,
        order_items: orderData.order_items.map((item) => ({
          product: item.product,
          quantity: parseInt(item.quantity),
          unit_price: item.unit_price,
        })),
        status: "Pending",
        warehouse_ready: false,
        reconciliation_status: "PENDING",
      };

      const response = await axiosInstance.post("/sales/api/orders/", payload);

      const transformedOrder = {
        id: `#${response.data.id}`,
        products: response.data.order_items.map(
          (item) => `Product ${item.product} (${item.quantity})`
        ),
        date: new Date(response.data.order_date).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        customer: response.data.customer,
        payment: "Pending",
        total: response.data.order_items
          .reduce(
            (sum, item) => sum + parseFloat(item.unit_price) * item.quantity,
            0
          )
          .toFixed(2),
        items: response.data.order_items.length,
        order_type: response.data.order_type,
        status: response.data.status,
      };
      return transformedOrder;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create order");
    }
  }
);

const initialState = {
  orders: [],
  selectedOrder: null,
  dateFilter: {
    startDate: "",
    endDate: "",
  },
  searchQuery: "",
  loading: false,
  error: null,
  notifications: {
    newOrders: 0,
  },
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    incrementOrderNotification: (state) => {
      state.notifications.newOrders += 1;
    },
    clearOrderNotifications: (state) => {
      state.notifications.newOrders = 0;
    },
    acceptOrder: (state, action) => {
      const order = state.orders.find((order) => order.id === action.payload);
      if (order) {
        order.status = "Confirmed";
        order.payment = "Success";
        order.warehouse_ready = true;
      }
    },
    rejectOrder: (state, action) => {
      const order = state.orders.find((order) => order.id === action.payload);
      if (order) {
        order.status = "Rejected";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectOrdersState = (state) => ({
  orders: state.orders.orders,
  dateFilter: state.orders.dateFilter,
  searchQuery: state.orders.searchQuery,
});

export const selectFilteredOrders = createSelector(
  [selectOrdersState],
  ({ orders, dateFilter, searchQuery }) => {
    return orders.filter((order) => {
      const matchesSearch =
        !searchQuery ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());

      const orderDate = new Date(order.date);
      const startDate = dateFilter.startDate
        ? new Date(dateFilter.startDate)
        : null;
      const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

      const matchesDate =
        !startDate ||
        !endDate ||
        (orderDate >= startDate &&
          orderDate <= new Date(endDate.setHours(23, 59, 59)));

      return matchesSearch && matchesDate;
    });
  }
);

export const selectPendingOrders = createSelector(
  [selectOrdersState],
  ({ orders, dateFilter, searchQuery }) => {
    return orders.filter((order) => {
      const matchesSearch =
        !searchQuery ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        order.status !== "Confirmed" && order.status !== "Rejected";

      if (!dateFilter.startDate || !dateFilter.endDate) {
        return matchesSearch && matchesStatus;
      }

      const orderDate = new Date(order.date);
      const start = new Date(dateFilter.startDate);
      const end = new Date(dateFilter.endDate);
      end.setHours(23, 59, 59);

      return (
        matchesSearch && matchesStatus && orderDate >= start && orderDate <= end
      );
    });
  }
);

export const {
  setDateFilter,
  setSearchQuery,
  incrementOrderNotification,
  clearOrderNotifications,
  acceptOrder,
  rejectOrder,
} = ordersSlice.actions;

export const selectOrderNotifications = (state) =>
  state.orders.notifications.newOrders;

export default ordersSlice.reducer;
