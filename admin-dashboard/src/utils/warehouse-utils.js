export const calculatePagination = (currentPage, itemsPerPage, totalItems) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    startIndex,
    endIndex,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

export const formatQuantity = (quantity, unit = "pcs") => {
  return `${quantity} ${unit}`;
};

export const getProductFullName = (product, brand) => {
  return `${brand?.name || ""} ${product?.name || ""}`.trim();
};

export const selectInventoryBase = (state) => ({
  inventory: state.warehouse.inventory,
  selectedWarehouse: state.warehouse.selectedWarehouse,
  selectedBrand: state.warehouse.selectedBrand,
  selectedCategory: state.warehouse.selectedCategory,
  products: state.warehouse.products,
});

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
      if (!product) return false;
      
      return (
        (selectedWarehouse === "all" ||
          item.warehouse_id === selectedWarehouse) &&
        (selectedBrand === "all" || product.brand === selectedBrand) &&
        (selectedCategory === "all" ||
          product.category === selectedCategory)
      );
    });
  }
);
