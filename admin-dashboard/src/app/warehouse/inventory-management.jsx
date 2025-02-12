import { useState } from "react";
import { Button } from "@radix-ui/themes/dist/cjs/index.js";
import toast, { Toaster } from "react-hot-toast";

const products = [
  {
    id: 1,
    name: "Dell XPS 15",
    category: { id: 1, name: "Laptops" },
    brand: { id: 1, name: "Dell" },
    description: "High-performance laptop with Intel i7 and 16GB RAM.",
    total_quantity: 50,
    warehouses: [
      { id: 1, name: "San Francisco Warehouse", quantity: 30 },
      { id: 2, name: "Los Angeles Warehouse", quantity: 20 }
    ]
  },
  {
    id: 2,
    name: "Apple MacBook Pro 16",
    category: { id: 1, name: "Laptops" },
    brand: { id: 2, name: "Apple" },
    description: "Apple MacBook Pro with M2 chip and 32GB RAM.",
    total_quantity: 40,
    warehouses: [
      { id: 1, name: "San Francisco Warehouse", quantity: 25 },
      { id: 3, name: "New York Warehouse", quantity: 15 }
    ]
  }
];

export default function ProductForm() {
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [quantity, setQuantity] = useState("");

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (name) => {
    const product = products.find(p => p.name === name);
    setQuery(name);
    setSelectedProduct(product || null);
    setShowDropdown(false);
    setQuantity(product ? product.total_quantity : "");
  };

  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        total_quantity: newQuantity
      });
    }
  };

  const handleSave = () => {
    // You can update the products array here with the new quantity if necessary
    toast.success("Product saved successfully!");
    setQuery("");
    setSelectedProduct(null);
    setQuantity("");
  };

  return (
    <div className="p-8 w-full max-w-5xl">
      <Toaster />
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Product Name</label>
          <div className="relative w-full">
            <input
              className="w-full border p-3 rounded"
              placeholder="Type product name"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedProduct(null);
                setShowDropdown(true);
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {query && showDropdown && filteredProducts.length > 0 && (
              <div className="absolute w-full border rounded mt-1 bg-white max-h-40 overflow-auto shadow-lg">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleSelect(p.name)}
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Category</label>
          <input className="w-full border p-3 rounded" value={selectedProduct?.category.name || ""} readOnly />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Brand</label>
          <input className="w-full border p-3 rounded" value={selectedProduct?.brand.name || ""} readOnly />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea className="w-full border p-3 rounded" value={selectedProduct?.description || ""} readOnly />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Quantity</label>
          <input
            className="w-full border p-3 rounded"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>
        <Button className="w-full p-3 bg-blue-600 text-white rounded mt-4" onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
