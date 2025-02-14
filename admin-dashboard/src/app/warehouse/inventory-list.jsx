import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  setSelectedWarehouse,
  setSelectedBrand,
  setSelectedCategory,
  setCurrentPage,
  selectFilteredInventory,
} from "@/redux/features/warehouse/warehouseSlice";
import { FormControl, Select, MenuItem } from "@mui/material";
import { inventoryData } from "@/mocks/warehouse/inventory-data";

export default function InventoryList() {
  const dispatch = useDispatch();
  const {
    inventory,
    products,
    brands,
    categories,
    warehouses,
    selectedWarehouse,
    selectedBrand,
    selectedCategory,
    currentPage,
    itemsPerPage,
  } = useSelector((state) => state.warehouse);

  const filteredInventory = inventory.filter((item) => {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) return false;

    return (
      (selectedWarehouse === "" ||
        item.warehouse_id === parseInt(selectedWarehouse)) &&
      (selectedBrand === "" || product.brand_id === parseInt(selectedBrand)) &&
      (selectedCategory === "" ||
        product.category_id === parseInt(selectedCategory))
    );
  });

  const totalPages = Math.ceil((filteredInventory?.length || 0) / itemsPerPage);
  const paginatedInventory =
    filteredInventory?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  const getProductDetails = (productId) => {
    const product = products?.find((p) => p.id === productId);
    const brand = brands?.find((b) => b.id === product?.brand_id);
    const category = categories?.find((c) => c.id === product?.category_id);
    return { product, brand, category };
  };

  const getWarehouseName = (warehouseId) => {
    return warehouses?.find((w) => w.id === warehouseId)?.name;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={selectedWarehouse || ""}
              onChange={(e) => dispatch(setSelectedWarehouse(e.target.value))}
              displayEmpty
            >
              <MenuItem value="">All Warehouses</MenuItem>
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={selectedBrand || ""}
              onChange={(e) => dispatch(setSelectedBrand(e.target.value))}
              displayEmpty
            >
              <MenuItem value="">All Brands</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={selectedCategory || ""}
              onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
              displayEmpty
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warehouse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedInventory.map((item, index) => {
              const { product, brand, category } = getProductDetails(
                item.product_id
              );
              return (
                <tr key={`${item.product_id}-${item.warehouse_id}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.product_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product?.name}
                    </div>
                    <div className="text-sm text-gray-500">{product?.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {brand?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {getWarehouseName(item.warehouse_id)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => dispatch(setCurrentPage(index + 1))}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
