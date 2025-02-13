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
