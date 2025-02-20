import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axiosInstance from "@/api/axios";

export const fetchInventory = createAsyncThunk(
  "warehouse/fetchInventory",
  async (_, { rejectWithValue }) => {
    try {
      const [
        inventoryRes,
        productsRes,
        warehousesRes,
        brandsRes,
        categoriesRes,
      ] = await Promise.all([
        axiosInstance.get("/warehouse/api/inventory/"),
        axiosInstance.get("/warehouse/api/products/"),
        axiosInstance.get("/warehouse/api/warehouses/"),
        axiosInstance.get("/warehouse/api/brands/"),
        axiosInstance.get("/warehouse/api/categories/"),
      ]);

      return {
        inventory: inventoryRes.data,
        products: productsRes.data,
        warehouses: warehousesRes.data,
        brands: brandsRes.data,
        categories: categoriesRes.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch inventory data"
      );
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "warehouse/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const [productsRes, categoriesRes, brandsRes, warehousesRes] =
        await Promise.all([
          axiosInstance.get("/warehouse/api/products/"),
          axiosInstance.get("/warehouse/api/categories/"),
          axiosInstance.get("/warehouse/api/brands/"),
          axiosInstance.get("/warehouse/api/warehouses/"),
        ]);

      return {
        products: productsRes.data,
        categories: categoriesRes.data,
        brands: brandsRes.data,
        warehouses: warehousesRes.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

export const createInboundOrder = createAsyncThunk(
  "warehouse/createInboundOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/warehouse/api/inbounds/",
        orderData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create inbound order"
      );
    }
  }
);

export const fetchInboundOrders = createAsyncThunk(
  "warehouse/fetchInboundOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const [inboundResponse, usersResponse] = await Promise.all([
        axiosInstance.get("/warehouse/api/inbounds/"),
        axiosInstance.get("/auth/users/"),
      ]);

      const state = getState();

      if (
        !state.warehouse.products.length ||
        !state.warehouse.warehouses.length
      ) {
        throw new Error("Products and warehouses must be loaded first");
      }

      const users = usersResponse.data.reduce((acc, user) => {
        acc[user.id] = user.username;
        return acc;
      }, {});

      const mappedOrders = inboundResponse.data.map((order) => {
        const product = state.warehouse.products.find(
          (p) => p.id === order.product
        );
        const warehouse = state.warehouse.warehouses.find(
          (w) => w.id === order.warehouse
        );

        return {
          id: order.id,
          status: order.status,
          quantity: order.quantity,
          created_at: order.created_at,
          updated_at: order.updated_at,
          product: {
            id: order.product,
            name: product?.name || `Product ${order.product}`,
          },
          warehouse: {
            id: order.warehouse,
            name: warehouse?.name || `Warehouse ${order.warehouse}`,
          },
          created_by: {
            id: order.created_by,
            name: users[order.created_by] || `User ${order.created_by}`,
          },
        };
      });

      return mappedOrders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch inbound orders"
      );
    }
  }
);

export const approveInboundOrder = createAsyncThunk(
  "warehouse/approveInboundOrder",
  async ({ orderId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const order = state.warehouse.inboundOrders.find((o) => o.id === orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      // Send complete order data with updated status
      const response = await axiosInstance.put(
        `/warehouse/api/inbounds/${orderId}/`,
        {
          product: order.product.id,
          warehouse: order.warehouse.id,
          quantity: order.quantity,
          status: "approved",
        }
      );

      if (response.status === 200) {
        // Handle inventory updates after successful status change
        const inventoryResponse = await axiosInstance.get(
          "/warehouse/api/inventory/"
        );
        const existingItem = inventoryResponse.data.find(
          (item) =>
            item.product === order.product.id &&
            item.warehouse === order.warehouse.id
        );

        if (existingItem) {
          await axiosInstance.patch(
            `/warehouse/api/inventory/${existingItem.id}/`,
            {
              quantity:
                parseInt(existingItem.quantity) + parseInt(order.quantity),
            }
          );
        } else {
          await axiosInstance.post("/warehouse/api/inventory/", {
            product: order.product.id,
            warehouse: order.warehouse.id,
            quantity: parseInt(order.quantity),
          });
        }

        await dispatch(fetchInventory());
        return response.data;
      }

      return rejectWithValue("Failed to approve order");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data ||
          "Failed to approve inbound order"
      );
    }
  }
);

export const rejectInboundOrder = createAsyncThunk(
  "warehouse/rejectInboundOrder",
  async ({ orderId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const order = state.warehouse.inboundOrders.find((o) => o.id === orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      await axiosInstance.put(`/warehouse/api/inbounds/${orderId}/`, {
        product: order.product.id,
        warehouse: order.warehouse.id,
        quantity: order.quantity,
        status: "declined",
      });

      return orderId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to reject inbound order"
      );
    }
  }
);

// Constants
const initialState = {
  // Data
  inventory: [],
  products: [],
  warehouses: [],
  brands: [],
  categories: [],
  inboundOrders: [],
  outboundOrders: [],

  // Form State
  form: {
    product: null,
    productInput: "",
    category: null,
    categoryInput: "",
    brand: null,
    brandInput: "",
    warehouse: null,
    warehouseInput: "",
    quantity: "",
    showDropdowns: {
      product: false,
      warehouse: false,
    },
  },

  // Filters and Pagination
  selectedWarehouse: "",
  selectedBrand: "",
  selectedCategory: "",
  currentPage: 1,
  itemsPerPage: 10,

  // Status
  loadingStates: {
    inventory: false,
    products: false,
    inboundOrders: false,
  },
  error: null,
  notifications: {
    inboundOrders: [],
    outboundOrders: [],
  },
};

// Slice Definition
const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    // Form Actions
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    setDropdownVisibility: (state, action) => {
      const { dropdown, isVisible } = action.payload;
      state.form.showDropdowns[dropdown] = isVisible;
    },
    resetForm: (state) => {
      state.form = initialState.form;
    },
    setQuantity: (state, action) => {
      state.form.quantity = action.payload;
    },

    // Selection Actions
    setSelectedWarehouse: (state, action) => {
      if (typeof action.payload === "object") {
        state.form.warehouse = action.payload;
        state.form.warehouseInput = action.payload.name;
      } else {
        state.selectedWarehouse = action.payload;
      }
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedProductForm: (state, action) => {
      const product = action.payload;
      state.form = {
        ...state.form,
        product: product,
        productInput: product.name,
        category: state.categories.find((c) => c.id === product.category),
        brand: state.brands.find((b) => b.id === product.brand),
      };
    },
    setSelectedItem: (state, action) => {
      const { type, item } = action.payload;
      state.form[type] = item;
      state.form[`${type}Input`] = item.name;
    },

    // Pagination Actions
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    // Inventory Actions
    updateInventoryQuantity: (state, action) => {
      const { productId, warehouseId, quantity } = action.payload;
      const item = state.inventory.find(
        (item) =>
          item.product_id === productId && item.warehouse_id === warehouseId
      );
      if (item) {
        item.quantity = quantity;
      }
    },

    // Notification Actions
    clearInboundNotification: (state) => {
      state.notifications.inboundOrders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.loadingStates.inventory = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingStates.inventory = false;
        state.inventory = action.payload.inventory || [];
        state.products = action.payload.products || [];
        state.warehouses = action.payload.warehouses || [];
        state.brands = action.payload.brands || [];
        state.categories = action.payload.categories || [];
        state.error = null;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.loadingStates.inventory = false;
        state.error = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.loadingStates.products = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingStates.products = false;
        state.products = action.payload.products || [];
        state.categories = action.payload.categories || [];
        state.brands = action.payload.brands || [];
        state.warehouses = action.payload.warehouses || [];
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.loadingStates.products = false;
        state.error = action.payload;
      })
      .addCase(fetchInboundOrders.pending, (state) => {
        state.loadingStates.inboundOrders = true;
        state.error = null;
      })
      .addCase(fetchInboundOrders.fulfilled, (state, action) => {
        state.loadingStates.inboundOrders = false;
        state.inboundOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchInboundOrders.rejected, (state, action) => {
        state.loadingStates.inboundOrders = false;
        state.error = action.payload;
      })
      .addCase(approveInboundOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const orderIndex = state.inboundOrders.findIndex(
          (order) => order.id === updatedOrder.id
        );

        if (orderIndex !== -1) {
          const oldOrder = state.inboundOrders[orderIndex];
          state.inboundOrders[orderIndex] = {
            ...oldOrder,
            status: "approved",
            updated_at: updatedOrder.updated_at,
          };
        }
      })
      .addCase(rejectInboundOrder.fulfilled, (state, action) => {
        const orderId = action.payload;
        const orderIndex = state.inboundOrders.findIndex(
          (order) => order.id === orderId
        );
        if (orderIndex !== -1) {
          state.inboundOrders[orderIndex] = {
            ...state.inboundOrders[orderIndex],
            status: "declined",
            updated_at: new Date().toISOString(),
          };
        }
      });
  },
});

// Selectors
export const selectInboundOrders = (state) => state.warehouse.inboundOrders;
export const selectOutboundOrders = (state) => state.warehouse.outboundOrders;
export const selectInventoryBase = (state) => ({
  inventory: state.warehouse.inventory,
  selectedWarehouse: state.warehouse.selectedWarehouse,
  selectedBrand: state.warehouse.selectedBrand,
  selectedCategory: state.warehouse.selectedCategory,
  products: state.warehouse.products,
});

// Memoized Selectors
export const selectPendingInboundOrders = createSelector(
  [selectInboundOrders],
  (inboundOrders) => inboundOrders.filter((order) => order.status === "pending")
);

export const selectFilteredInventory = createSelector(
  [selectInventoryBase],
  ({
    inventory,
    selectedWarehouse,
    selectedBrand,
    selectedCategory,
    products,
  }) => {
    if (!inventory || !products) return [];

    return inventory.filter((item) => {
      const product = products.find((p) => p.id === item.product);
      if (!product) return false;

      return (
        (!selectedWarehouse ||
          item.warehouse === parseInt(selectedWarehouse)) &&
        (!selectedBrand || product.brand === parseInt(selectedBrand)) &&
        (!selectedCategory || product.category === parseInt(selectedCategory))
      );
    });
  }
);

export const selectInboundNotifications = (state) =>
  state.warehouse.notifications.inboundOrders;

// Export actions and reducer
export const {
  setSelectedWarehouse,
  setSelectedBrand,
  setSelectedCategory,
  setCurrentPage,
  updateInventoryQuantity,
  setFormField,
  setDropdownVisibility,
  resetForm,
  setSelectedProductForm,
  setSelectedItem,
  clearInboundNotification,
  setQuantity,
} = warehouseSlice.actions;

export default warehouseSlice.reducer;
