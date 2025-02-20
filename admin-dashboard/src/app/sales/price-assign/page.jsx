import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, MapPin } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  fetchInventory,
  setSelectedWarehouse,
  setSelectedBrand,
  setSelectedCategory,
} from "@/redux/features/warehouse/warehouseSlice";
import { FilterControls } from "@/components/warehouse/FilterControls";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";

const TABLE_HEADERS = [
  { id: "no", label: "No", width: "w-[5%]" },
  { id: "product", label: "Product", width: "w-[20%]" },
  { id: "brand", label: "Brand", width: "w-[10%]" },
  { id: "category", label: "Category", width: "w-[10%]" },
  { id: "warehouse", label: "Warehouse", width: "w-[15%]" },
  { id: "quantity", label: "Quantity", width: "w-[8%]" },
  { id: "image", label: "Image (Optional)", width: "w-[17%]" },
  { id: "price", label: "Price", width: "w-[8%]" },
  { id: "actions", label: "Actions", width: "w-[7%]" },
];

export function PriceAssignPage() {
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
    loading,
    error,
  } = useSelector((state) => state.warehouse);
  const [prices, setPrices] = useState({});
  const [images, setImages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [priceAssignments, setPriceAssignments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchInventory()).unwrap();
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
        toast.error("Failed to load inventory data");
      }
    };

    const fetchPriceAssignments = async () => {
      try {
        const response = await axiosInstance.get("/sales/api/price-assign/");
        setPriceAssignments(response.data);
      } catch (error) {
        console.error("Failed to fetch price assignments:", error);
      }
    };

    if (!inventory.length || !products.length) {
      loadData();
    }

    fetchPriceAssignments();
  }, [dispatch, inventory.length, products.length]);

  const handlePriceChange = (itemId, value) => {
    setPrices((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleImageChange = (itemId, file) => {
    if (file) {
      setImages((prev) => ({
        ...prev,
        [itemId]: file,
      }));
    }
  };

  const handleAssignPrice = async (item) => {
    const price = prices[item.id];
    if (!price || isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("price", parseFloat(price));
      formData.append("is_published", true);
      formData.append("product", item.id);

      if (images[item.id]) {
        formData.append("image", images[item.id]);
      }

      // First, check if the product already exists in price assignments
      const priceAssignResponse = await axiosInstance.get(
        "/sales/api/price-assign/"
      );
      const existingPriceAssign = priceAssignResponse.data.find(
        (p) => p.product === item.id
      );

      if (existingPriceAssign) {
        // Delete the existing price assignment
        await axiosInstance.delete(
          `/sales/api/price-assign/${existingPriceAssign.id}/`
        );

        // Create a new price assignment
        await axiosInstance.post("/sales/api/price-assign/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Price updated successfully");
      } else {
        // Create new price assignment
        await axiosInstance.post("/sales/api/price-assign/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Price assigned successfully");
      }

      // Clear the inputs
      setPrices((prev) => {
        const newPrices = { ...prev };
        delete newPrices[item.id];
        return newPrices;
      });
      setImages((prev) => {
        const newImages = { ...prev };
        delete newImages[item.id];
        return newImages;
      });

      // Refresh the inventory data
      dispatch(fetchInventory());
    } catch (error) {
      console.error("Failed to assign price:", error);
      toast.error(error.response?.data?.message || "Failed to assign price");
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const product = products.find((p) => p.id === item.product);
    if (!product) return false;

    const searchMatch = product.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const warehouseMatch =
      !selectedWarehouse || item.warehouse === parseInt(selectedWarehouse);
    const brandMatch =
      !selectedBrand || product.brand === parseInt(selectedBrand);
    const categoryMatch =
      !selectedCategory || product.category === parseInt(selectedCategory);

    return searchMatch && warehouseMatch && brandMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <TextField
          size="small"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search className="w-4 h-4 text-gray-400 mr-2" />,
          }}
          sx={{
            width: "300px",
            "& .MuiInputBase-root": {
              height: "32px",
              fontSize: "14px",
            },
          }}
        />
      </div>

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
        onCategoryChange={(e) => dispatch(setSelectedCategory(e.target.value))}
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header.id}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width}`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item, index) => {
                const product = products.find((p) => p.id === item.product);
                const brand = brands.find((b) => b.id === product?.brand);
                const category = categories.find(
                  (c) => c.id === product?.category
                );
                const warehouse = warehouses.find(
                  (w) => w.id === item.warehouse
                );

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                        {product?.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-[250px]">
                        {product?.sku}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="truncate max-w-[100px]">
                        {brand?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="truncate max-w-[100px]">
                        {category?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate max-w-[150px]">
                          {warehouse?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <label
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 
                          rounded-md hover:bg-blue-100 cursor-pointer text-xs font-semibold w-fit"
                        >
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageChange(item.id, e.target.files[0])
                            }
                            className="hidden"
                          />
                        </label>
                        {images[item.id] ? (
                          <>
                            <span className="text-xs text-gray-500 truncate max-w-[150px]">
                              {images[item.id].name}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No file chosen
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TextField
                        size="small"
                        type="number"
                        value={prices[item.id] || ""}
                        onChange={(e) =>
                          handlePriceChange(item.id, e.target.value)
                        }
                        placeholder={
                          priceAssignments.find((p) => p.product === item.id)
                            ?.price || "Price"
                        }
                        sx={{
                          width: "80px",
                          "& .MuiInputBase-input": {
                            padding: "4px 8px",
                            fontSize: "0.875rem",
                          },
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAssignPrice(item)}
                        disabled={!prices[item.id]}
                        sx={{
                          padding: "4px 12px",
                          fontSize: "0.75rem",
                        }}
                      >
                        Assign
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
