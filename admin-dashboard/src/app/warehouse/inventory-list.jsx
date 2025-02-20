import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin } from "lucide-react";
import { CircularProgress } from "@mui/material";
import {
  setSelectedWarehouse,
  setSelectedBrand,
  setSelectedCategory,
  setCurrentPage,
  fetchInventory,
} from "@/redux/features/warehouse/warehouseSlice";
import { FilterControls } from "@/components/warehouse/FilterControls";
import { Pagination } from "@/components/warehouse/Pagination";

// Component for inventory table row
const InventoryRow = ({ item, product, brand, category, warehouse }) => (
  <tr key={item.id}>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {item.id}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{product?.name}</div>
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
        <span className="text-sm text-gray-900">{warehouse?.name}</span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {item.quantity}
    </td>
  </tr>
);

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
    loading,
    error,
  } = useSelector((state) => state.warehouse);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchInventory()).unwrap();
        dispatch(setCurrentPage(1));
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      }
    };

    if (!inventory.length || !products.length) {
      loadData();
    }
  }, [dispatch, inventory.length, products.length]);

  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [dispatch, selectedWarehouse, selectedBrand, selectedCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading inventory: {error}
      </div>
    );
  }

  if (!inventory.length) {
    return (
      <div className="text-gray-500 text-center p-4">
        No inventory items found
      </div>
    );
  }

  const filteredInventory = inventory.filter((item) => {
    const product = products.find((p) => p.id === item.product);
    if (!product) return false;

    return (
      (selectedWarehouse === "" ||
        item.warehouse === parseInt(selectedWarehouse)) &&
      (selectedBrand === "" || product.brand === parseInt(selectedBrand)) &&
      (selectedCategory === "" ||
        product.category === parseInt(selectedCategory))
    );
  });

  const totalPages = Math.ceil((filteredInventory?.length || 0) / itemsPerPage);
  const paginatedInventory = filteredInventory?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FilterControls
          warehouses={warehouses}
          brands={brands}
          categories={categories}
          selectedValues={{
            warehouse: selectedWarehouse,
            brand: selectedBrand,
            category: selectedCategory,
          }}
          onWarehouseChange={(e) =>
            dispatch(setSelectedWarehouse(e.target.value))
          }
          onBrandChange={(e) => dispatch(setSelectedBrand(e.target.value))}
          onCategoryChange={(e) =>
            dispatch(setSelectedCategory(e.target.value))
          }
        />
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
            {paginatedInventory.map((item) => {
              const product = products.find((p) => p.id === item.product);
              const brand = brands.find((b) => b.id === product?.brand);
              const category = categories.find(
                (c) => c.id === product?.category
              );
              const warehouse = warehouses.find((w) => w.id === item.warehouse);

              return (
                <InventoryRow
                  key={item.id}
                  item={item}
                  product={product}
                  brand={brand}
                  category={category}
                  warehouse={warehouse}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
      />
    </div>
  );
}
