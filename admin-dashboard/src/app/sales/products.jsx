import { useState } from "react";
import {  Edit, Trash } from "lucide-react";
import { Modal } from "../../components/modal/modal";
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

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDelete = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleUpdate = () => {
    setProducts(products.map(product => 
      product.id === selectedProduct.id ? selectedProduct : product
    ));
    setEditModalOpen(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter ? product.category === categoryFilter : true) &&
    (brandFilter ? product.brand === brandFilter : true)
  );

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Product List</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select onChange={(e) => setCategoryFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Furniture">Furniture</option>
        </select>
        <select onChange={(e) => setBrandFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Brands</option>
          <option value="Brand A">Brand A</option>
          <option value="Brand B">Brand B</option>
        </select>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Brand</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">{product.brand}</td>
                <td className="p-4">{product.total_quantity}</td>
                <td className="p-4">{product.price}</td>
                <td className="p-4 flex flex-col gap-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-500 hover:underline">
                    <Edit className="w-4 h-4 inline-block mr-1" /> Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:underline">
                    <Trash className="w-4 h-4 inline-block mr-1" /> Delete
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
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
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
            <label className="block">
              <span className="text-gray-700">Price</span>
              <input
                type="text"
                value={selectedProduct.price}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <button onClick={handleUpdate} className="w-full bg-blue-500 text-white p-2 rounded mt-4">Update</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
