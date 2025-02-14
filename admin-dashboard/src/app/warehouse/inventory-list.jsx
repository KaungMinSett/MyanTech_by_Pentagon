import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  setSelectedWarehouse,
  setSelectedBrand,
  setSelectedCategory,
  setCurrentPage,
  selectFilteredInventory,
  fetchInventory,
} from "@/redux/features/warehouse/warehouseSlice";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function InventoryList() {
  const dispatch = useDispatch();
  const {
    selectedWarehouse,
    selectedBrand,
    selectedCategory,
    currentPage,
    itemsPerPage,
    products,
    brands,
    categories,
    warehouses,
    loading,
    error,
  } = useSelector((state) => state.warehouse);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const filteredInventory = useSelector(selectFilteredInventory);

  const getProductDetails = (productId) => {
    const product = products.find((p) => p.id === productId);
    const brand = brands.find((b) => b.id === product?.brand_id);
    const category = categories.find((c) => c.id === product?.category_id);
    return { product, brand, category };
  };

  const getWarehouseName = (warehouseId) => {
    return warehouses.find((w) => w.id === warehouseId)?.name;
  };

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <FormControl
              size="small"
              sx={{
                minWidth: 120,
                "& .MuiInputBase-root": {
                  height: "32px",
                  fontSize: "14px",
                },
              }}
            >
              <Select
                value={selectedCategory}
                onChange={(e) => {
                  dispatch(
                    setSelectedCategory(
                      e.target.value === "all" ? "all" : Number(e.target.value)
                    )
                  );
                  dispatch(setCurrentPage(1));
                }}
                displayEmpty
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                minWidth: 120,
                "& .MuiInputBase-root": {
                  height: "32px",
                  fontSize: "14px",
                },
              }}
            >
              <Select
                value={selectedBrand}
                onChange={(e) => {
                  dispatch(
                    setSelectedBrand(
                      e.target.value === "all" ? "all" : Number(e.target.value)
                    )
                  );
                  dispatch(setCurrentPage(1));
                }}
                displayEmpty
              >
                <MenuItem value="all">All Brands</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                minWidth: 120,
                "& .MuiInputBase-root": {
                  height: "32px",
                  fontSize: "14px",
                },
              }}
            >
              <Select
                value={selectedWarehouse}
                onChange={(e) => {
                  dispatch(
                    setSelectedWarehouse(
                      e.target.value === "all" ? "all" : Number(e.target.value)
                    )
                  );
                  dispatch(setCurrentPage(1));
                }}
                displayEmpty
                startAdornment={
                  <MapPin className="h-5 w-5 text-gray-500 ml-2 mr-2" />
                }
              >
                <MenuItem value="all">All Warehouses</MenuItem>
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Brand
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Warehouse
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedInventory.map((item) => {
                  const { product, brand, category } = getProductDetails(
                    item.product_id
                  );
                  return (
                    <tr
                      key={`${item.product_id}-${item.warehouse_id}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product?.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {category?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {brand?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {getWarehouseName(item.warehouse_id)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            item.quantity > 30
                              ? "bg-green-100 text-green-800"
                              : item.quantity > 10
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.quantity} units
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() =>
                  dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))
                }
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  dispatch(
                    setCurrentPage(Math.min(currentPage + 1, totalPages))
                  )
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredInventory.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredInventory.length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => dispatch(setCurrentPage(idx + 1))}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                        ${
                          currentPage === idx + 1
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      dispatch(
                        setCurrentPage(Math.min(currentPage + 1, totalPages))
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
