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

  if (loading || !categories || !brands || !warehouses) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getProductDetails = (productId) => {
    const product = products?.find((p) => p.id === productId);
    const brand = brands?.find((b) => b.id === product?.brand);
    const category = categories?.find((c) => c.id === product?.category);
    return { product, brand, category };
  };

  const getWarehouseName = (warehouseId) => {
    return warehouses?.find((w) => w.id === warehouseId)?.name;
  };

  const totalPages = Math.ceil((filteredInventory?.length || 0) / itemsPerPage);
  const paginatedInventory = filteredInventory?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

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

        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
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
                    {paginatedInventory.map((item) => {
                      const { product, brand, category } = getProductDetails(item.product_id);
                      return (
                        <tr key={`${item.product_id}-${item.warehouse_id}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {brand?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getWarehouseName(item.warehouse_id)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
