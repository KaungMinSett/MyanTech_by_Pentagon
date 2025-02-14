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
      try {
        const response = await axiosInstance.get("/warehouse/api/inventory/");
        console.log("API Response:", response.data);
        return response.data;
      } catch (apiError) {
        console.log("API Error, falling back to mock data:", apiError);
        return {
          warehouses: inventoryData.warehouses,
          categories: inventoryData.categories,
          brands: inventoryData.brands,
          products: inventoryData.products,
          inventory: inventoryData.inventory,
        };
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch inventory"
      );
    }
  }
);

const initialState = {
  // Data
  inventory: inventoryData.inventory,
  products: inventoryData.products,
  brands: inventoryData.brands,
  categories: inventoryData.categories,
  warehouses: inventoryData.warehouses,
  inboundOrders: inboundData,
  outboundOrders: outboundData,

  // UI State
  selectedWarehouse: "all",
  selectedBrand: "all",
  selectedCategory: "all",
  currentPage: 1,
  itemsPerPage: 7,

  // Form State
  form: {
    product: null,
    productInput: "",
    categoryInput: "",
    brandInput: "",
    warehouseInput: "",
    descriptionInput: "",
    quantity: "",
    showDropdowns: {
      product: false,
      category: false,
      brand: false,
      warehouse: false,
    },
  },

  // Async State
  loading: false,
  error: null,
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
        const inventoryItem = state.inventory.find(
          (item) =>
            item.product_id === order.product.id &&
            item.warehouse_id === order.warehouse.id
        );

        if (inventoryItem) {
          inventoryItem.quantity += order.quantity;
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
      state.inboundOrders.push(action.payload);
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
        product,
        productInput: product.name,
        categoryInput: product.category?.name || "",
        brandInput: product.brand?.name || "",
        descriptionInput: product.description || "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.warehouses = action.payload.warehouses;
        state.categories = action.payload.categories;
        state.brands = action.payload.brands;
        state.products = action.payload.products;
        state.inventory = action.payload.inventory;
        state.loading = false;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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

// Memoized selectors
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
  }) =>
    inventory.filter((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return (
        (selectedWarehouse === "all" ||
          item.warehouse_id === selectedWarehouse) &&
        (selectedBrand === "all" || product?.brand_id === selectedBrand) &&
        (selectedCategory === "all" ||
          product?.category_id === selectedCategory)
      );
    })
);

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
} = warehouseSlice.actions;

export default warehouseSlice.reducer;
