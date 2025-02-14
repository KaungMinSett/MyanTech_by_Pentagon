import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { inventoryData } from "@/mocks/warehouse/inventory-data";
import {
  inboundData,
  outboundData,
} from "@/mocks/warehouse/inbound-outbound-data";
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

      // Transform inventory data to match expected structure
      const inventory = Array.isArray(inventoryRes.data)
        ? inventoryRes.data.map((item) => ({
            id: item.id,
            product_id: item.product,
            warehouse_id: item.warehouse,
            quantity: item.quantity,
            zone: item.zone,
          }))
        : [];

      const payload = {
        inventory,
        products: productsRes.data,
        warehouses: warehousesRes.data,
        brands: brandsRes.data,
        categories: categoriesRes.data,
      };

      return payload;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Data from mock
  inventory: inventoryData.inventory,
  products: inventoryData.products,
  warehouses: inventoryData.warehouses,
  brands: inventoryData.brands,
  categories: inventoryData.categories,
  inboundOrders: inboundData,
  outboundOrders: outboundData,

  // Form state
  form: {
    productInput: "",
    product: null,
    categoryInput: "",
    category: null,
    brandInput: "",
    brand: null,
    warehouseInput: "",
    warehouse: null,
    quantity: "",
    showDropdowns: {
      product: false,
      category: false,
      brand: false,
      warehouse: false,
    },
  },

  // UI State
  selectedWarehouse: "",
  selectedBrand: "",
  selectedCategory: "",
  currentPage: 1,
  itemsPerPage: 10,

  // Async State
  loading: false,
  error: null,

  notifications: {
    inboundOrders: [],
    outboundOrders: []
  },
};

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    setSelectedWarehouse: (state, action) => {
      state.selectedWarehouse = action.payload;
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
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
    approveInboundOrder: (state, action) => {
      const { orderId } = action.payload;
      const orderIndex = state.inboundOrders.findIndex(
        (order) => order.id === orderId
      );

      if (orderIndex !== -1) {
        const order = state.inboundOrders[orderIndex];

        // Update order status
        state.inboundOrders[orderIndex] = {
          ...order,
          status: "approved",
          updated_at: new Date().toISOString(),
        };

        // Update inventory
        const existingItem = state.inventory.find(
          (item) =>
            item.product_id === order.product.id &&
            item.warehouse_id === order.warehouse.id
        );

        if (existingItem) {
          existingItem.quantity += order.quantity;
        } else {
          state.inventory.push({
            product_id: order.product.id,
            warehouse_id: order.warehouse.id,
            quantity: order.quantity,
          });
        }
      }
    },

    rejectInboundOrder: (state, action) => {
      const { orderId } = action.payload;
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
    },

    createInboundOrder: (state, action) => {
      const newOrder = {
        id: Math.max(...state.inboundOrders.map((order) => order.id)) + 1,
        product: {
          id: action.payload.product.id,
          name: action.payload.product.name,
          sku: action.payload.product.sku,
          category: action.payload.product.category,
          brand: action.payload.product.brand,
        },
        warehouse: {
          id: action.payload.warehouse.id,
          name: action.payload.warehouse.name,
        },
        quantity: action.payload.quantity,
        status: "pending",
        created_by: action.payload.created_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Important: Create a new array reference to trigger state update
      state.inboundOrders = [...state.inboundOrders, newOrder];
      state.notifications.inboundOrders.push(newOrder.id);
    },
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
    setSelectedProductForm: (state, action) => {
      const product = action.payload;
      state.form = {
        ...state.form,
        product: product,
        productInput: product.name || "",
        category: null,
        categoryInput: "",
        brand: null,
        brandInput: "",
        warehouse: null,
        warehouseInput: "",
      };
    },
    setSelectedItem: (state, action) => {
      const { type, item } = action.payload;
      state.form[type] = item;
      state.form[`${type}Input`] = item.name;
    },
    clearInboundNotification: (state) => {
      state.notifications.inboundOrders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        console.log("Reducer Received Data:", action.payload);
        state.inventory = action.payload.inventory;
        state.products = action.payload.products;
        state.warehouses = action.payload.warehouses;
        state.brands = action.payload.brands;
        state.categories = action.payload.categories;
        state.loading = false;
        console.log("State After Update:", state.inventory);
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.inventory = [];
        state.products = [];
        state.warehouses = [];
        state.brands = [];
        state.categories = [];
      });
  },
});

// Base selectors
export const selectInboundOrders = (state) => state.warehouse.inboundOrders;
export const selectOutboundOrders = (state) => state.warehouse.outboundOrders;
export const selectInventoryBase = (state) => ({
  inventory: state.warehouse.inventory,
  selectedWarehouse: state.warehouse.selectedWarehouse,
  selectedBrand: state.warehouse.selectedBrand,
  selectedCategory: state.warehouse.selectedCategory,
  products: state.warehouse.products,
});

// Memoized
export const selectPendingInboundOrders = createSelector(
  [(state) => state.warehouse.inboundOrders],
  (inboundOrders) => inboundOrders.filter((order) => order.status === "pending")
);

export const selectFilteredInventory = createSelector(
  [selectInventoryBase],
  (state) => {
    const {
      inventory,
      selectedWarehouse,
      selectedBrand,
      selectedCategory,
      products,
    } = state;

    if (!inventory || !products) return [];

    return inventory.filter((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return (
        (selectedWarehouse === "" || item.warehouse_id === selectedWarehouse) &&
        (selectedBrand === "" || product?.brand === selectedBrand) &&
        (selectedCategory === "" || product?.category === selectedCategory)
      );
    });
  }
);

export const selectInboundNotifications = (state) => state.warehouse.notifications.inboundOrders;

export const {
  setSelectedWarehouse,
  setSelectedBrand,
  setSelectedCategory,
  setCurrentPage,
  updateInventoryQuantity,
  approveInboundOrder,
  rejectInboundOrder,
  createInboundOrder,
  setFormField,
  setDropdownVisibility,
  resetForm,
  setSelectedProductForm,
  setSelectedItem,
  clearInboundNotification,
} = warehouseSlice.actions;

export default warehouseSlice.reducer;
