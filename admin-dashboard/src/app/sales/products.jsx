import { useState } from "react";
import {  Edit, Trash } from "lucide-react";
import { Modal } from "../../components/modal/modal";



export default function ProductList() {
  const [products, setProducts] = useState(
    [
        {
          "id": 1,
          "name": "Laptop Pro X",
          "category": "Laptops",
          "brand": "Brand A",
          "description": "High-performance laptop for professionals.",
          "total_quantity": 150,
          "price": "$1200",
          "image": "https://via.placeholder.com/150" 
        },
        {
          "id": 2,
          "name": "Gaming Laptop G7",
          "category": "Laptops",
          "brand": "Brand C",
          "description": "Powerful gaming laptop with dedicated graphics card.",
          "total_quantity": 80,
          "price": "$1800",
          "image": "https://via.placeholder.com/150"
        },
        {
          "id": 3,
          "name": "Ultrabook S1",
          "category": "Laptops",
          "brand": "Brand B",
          "description": "Lightweight and portable ultrabook for travel.",
          "total_quantity": 120,
          "price": "$1100",
          "image": "https://via.placeholder.com/150"
        },
        {
          "id": 4,
          "name": "Desktop PC D5",
          "category": "Desktops",
          "brand": "Brand A",
          "description": "Reliable desktop PC for home and office use.",
          "total_quantity": 100,
          "price": "$800",
          "image": "https://via.placeholder.com/150"
        },
        {
          "id": 5,
          "name": "Gaming PC G10",
          "category": "Desktops",
          "brand": "Brand C",
          "description": "High-end gaming PC with top-of-the-line components.",
          "total_quantity": 50,
          "price": "$2500",
          "image": "https://via.placeholder.com/150"
        },
        {
          "id": 6,
          "name": "Monitor 27-inch",
          "category": "Monitors",
          "brand": "Brand A",
          "description": "27-inch monitor with high resolution.",
          "total_quantity": 80,
          "price": "$300",
          "image": "https://via.placeholder.com/150"
        },
        {
          "id": 7,
          "name": "Curved Monitor 34-inch",
          "category": "Monitors",
          "brand": "Brand B",
          "description": "Immersive 34-inch curved monitor for gaming and multimedia.",
          "total_quantity": 60,
          "price": "$500",
          "image": "https://via.placeholder.com/150"
        },
        {
          "id": 8,
          "name": "Wireless Keyboard K1",
          "category": "Keyboards & Mice",
          "brand": "Brand D",
          "description": "Wireless keyboard with comfortable typing experience.",
          "total_quantity": 150,
          "price": "$50",
          "image": "https://via.placeholder.com/150"
        },
        {
          "id": 9,
          "name": "Gaming Mouse M3",
          "category": "Keyboards & Mice",
          "brand": "Brand E",
          "description": "Gaming mouse with high precision and customizable buttons.",
          "total_quantity": 100,
          "price": "$80",
          "image": "https://via.placeholder.com/150"
        },
        {
          "id": 10,
          "name": "External Hard Drive 1TB",
          "category": "Storage",
          "brand": "Brand F",
          "description": "1TB external hard drive for data storage.",
          "total_quantity": 200,
          "price": "$60",
          "image": "https://via.placeholder.com/150"
        },
        {
          "id": 11,
          "name": "SSD 500GB",
          "category": "Storage",
          "brand": "Brand A",
          "description": "500GB solid state drive for fast data access.",
          "total_quantity": 120,
          "price": "$80",
          "image": "https://via.placeholder.com/150"
        },
        {
          "id": 12,
          "name": "Webcam HD",
          "category": "Peripherals",
          "brand": "Brand B",
          "description": "High-definition webcam for video conferencing.",
          "total_quantity": 120,
          "price": "$40",
          "image": "https://via.placeholder.com/150"
        },
        {
          "id": 13,
          "name": "Printer Inkjet",
          "category": "Printers",
          "brand": "Brand D",
          "description": "Inkjet printer for home and office use.",
          "total_quantity": 90,
          "price": "$150",
          "image": "https://via.placeholder.com/150"
        }
      ]
);

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
