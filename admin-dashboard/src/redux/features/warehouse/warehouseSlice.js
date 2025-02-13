import { createSlice, createSelector } from "@reduxjs/toolkit";
import { inventoryData } from "@/mocks/warehouse/inventory-data";
import {
  inboundData,
  outboundData,
} from "@/mocks/warehouse/inbound-outbound-data";

const initialState = {
  inventory: inventoryData.inventory,
  products: inventoryData.products,
  brands: inventoryData.brands,
  categories: inventoryData.categories,
  warehouses: inventoryData.warehouses,
  inboundOrders: inboundData,
  outboundOrders: outboundData,
  selectedWarehouse: "all",
  selectedBrand: "all",
  selectedCategory: "all",
  currentPage: 1,
  itemsPerPage: 7,
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
          status: "rejected",
          updated_at: new Date().toISOString(),
        };
      }
    },
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
} = warehouseSlice.actions;

export default warehouseSlice.reducer;
