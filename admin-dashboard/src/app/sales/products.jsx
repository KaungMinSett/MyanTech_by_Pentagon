import { useState, useCallback, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { Modal } from "../../components/modal/modal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleEdit = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `/api/shop/productlist/${selectedProduct.id}/`
      );
      setProducts(
        products.filter((product) => product.id !== selectedProduct.id)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
    handleMenuClose();
  };

  const handleUpdate = async () => {
    try {
      const response = await axiosInstance.put(
        `/api/shop/productlist/${selectedProduct.id}/`,
        {
          name: selectedProduct.name,
          details: {
            ...selectedProduct.details,
            price: selectedProduct.details.price,
          },
        }
      );
      setProducts(
        products.map((product) =>
          product.id === selectedProduct.id ? response.data : product
        )
      );
      toast.success("Product updated successfully");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product");
    }
  };

  const handleMenuOpen = useCallback((event, product) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter ? product.category === parseInt(categoryFilter) : true) &&
      (brandFilter ? product.brand === parseInt(brandFilter) : true)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-60"
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
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
              onChange={(e) => setBrandFilter(e.target.value)}
              label="Brand"
            >
              <MenuItem value="">All Brands</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full border-collapse table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500">{product.id}</td>
                <td className="p-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${
                      product.details.image
                    }`}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-4 text-sm text-gray-500">{product.name}</td>
                <td className="p-4 text-sm text-gray-500">
                  {categories.find((c) => c.id === product.category)?.name ||
                    product.category}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {brands.find((b) => b.id === product.brand)?.name ||
                    product.brand}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  ${product.details.price}
                </td>
                <td className="p-4">
                  <button onClick={(e) => handleMenuOpen(e, product)}>
                    <MoreVertical className="w-5 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === index + 1
                ? "bg-indigo-500 text-white"
                : "bg-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "#DC2626" }}>
          Delete
        </MenuItem>
      </Menu>

      <Modal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="Edit Product"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Product Name</span>
              <input
                type="text"
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Price</span>
              <input
                type="number"
                value={selectedProduct.details.price}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    details: {
                      ...selectedProduct.details,
                      price: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded mt-1"
                step="0.01"
              />
            </label>
            <button
              onClick={handleUpdate}
              className="w-full bg-indigo-500 text-white p-2 rounded mt-4"
            >
              Update
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
