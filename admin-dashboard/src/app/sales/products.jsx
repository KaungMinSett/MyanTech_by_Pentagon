import { useState, useCallback } from "react";
import { MoreVertical, Package2 } from "lucide-react";
import { Modal } from "../../components/modal/modal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { products as initialProducts } from "../../mocks/sales/products";

export default function ProductList() {
  const [products, setProducts] = useState(initialProducts);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleEdit = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setProducts(products.filter(product => product.id !== selectedProduct.id));
    handleMenuClose();
  };

  const handleUpdate = () => {
    setProducts(products.map(product => 
      product.id === selectedProduct.id ? selectedProduct : product
    ));
    setEditModalOpen(false);
  };

  const handleMenuOpen = useCallback((event, product) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter ? product.category === categoryFilter : true) &&
    (brandFilter ? product.brand === brandFilter : true)
  );

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 ">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Package2 className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-60"
          />
          <select onChange={(e) => setCategoryFilter(e.target.value)} className="border px-2 py-0 rounded text-sm">
            <option value="" className="text-sm">All Categories</option>
            <option value="Laptops">Laptops</option>
            <option value="Furniture">Furniture</option>
          </select>
          <select onChange={(e) => setBrandFilter(e.target.value)} className="border px-2 py-0 rounded text-sm">
            <option value="" className="text-md">All Brands</option>
            <option value="Brand A">Brand A</option>
            <option value="Brand B">Brand B</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full border-collapse table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="pl-10 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="pl-14 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="pl-14 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="pl-14 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="pl-14 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="pl-8 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-4 pl-10 flex items-center space-x-2  text-gray-900">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="font-medium pl-8  text-gray-500 text-sm">{product.name}</td>
                <td className="pl-14  text-gray-500 text-sm">{product.category}</td>
                <td className="pl-14  text-gray-500 text-sm">{product.brand}</td>
                <td className="pl-14  text-gray-500 text-sm">{product.total_quantity}</td>
                <td className="pl-14  text-gray-500 text-sm">${product.price}</td>
                <td className="pl-14  text-gray-500 text-sm">
                  <button onClick={(e) => handleMenuOpen(e, product)}>
                    <MoreVertical className="w-5 h-4 text-gray-600 text-sm" />
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
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-indigo-500 text-white" : "bg-white"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "#DC2626" }}>Delete</MenuItem>
      </Menu>

      <Modal open={editModalOpen} onOpenChange={setEditModalOpen} title="Edit Product">
        {selectedProduct && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Product Name</span>
              <input
                type="text"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <button onClick={handleUpdate} className="w-full bg-indigo-500 text-white p-2 rounded mt-4">
              Update
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
