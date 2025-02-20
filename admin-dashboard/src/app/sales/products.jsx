import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";

const TABLE_HEADERS = [
  { id: "no", label: "No", width: "w-[5%]" },
  { id: "image", label: "Image", width: "w-[10%]" },
  { id: "product", label: "Product", width: "w-[15%]" },
  { id: "description", label: "Description", width: "w-[30%]" },
  { id: "category", label: "Category", width: "w-[10%]" },
  { id: "brand", label: "Brand", width: "w-[10%]" },
  { id: "price", label: "Price", width: "w-[10%]" },
  { id: "status", label: "Status", width: "w-[10%]" },
];

export default function ProductList() {
  // State Management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          axiosInstance.get("/api/shop/productlist/"),
          axiosInstance.get("/warehouse/api/categories/"),
          axiosInstance.get("/warehouse/api/brands/"),
        ]);

        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const categoryMatch =
      !categoryFilter || product.category === parseInt(categoryFilter);
    const brandMatch = !brandFilter || product.brand === parseInt(brandFilter);
    return searchMatch && categoryMatch && brandMatch;
  });

  // Pagination Logic
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  // Render Component
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <TextField
          size="small"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
        <div className="flex gap-4">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Brand</InputLabel>
            <Select
              value={brandFilter}
              label="Brand"
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header.id}
                    className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width}`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product, index) => {
                const category = categories.find(
                  (c) => c.id === product.category
                );
                const brand = brands.find((b) => b.id === product.brand);

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                      {product.details?.image ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${
                            product.details.image
                          }`}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/64x64?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {product.description || "No description available"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {category?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {brand?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">
                        ${parseFloat(product.details?.price || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          product.details?.is_published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {product.details?.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
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
