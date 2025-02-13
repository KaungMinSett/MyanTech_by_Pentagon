import { useState } from 'react';
import Button from "@mui/material/Button";

export function CreateOrderForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    customer: '',
    phone: '',
    address: '',
    products: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const products = formData.products.split(',').map(p => p.trim());
    const total = "$0.00";
    
    onSubmit({
      ...formData,
      products,
      payment: 'Pending',
      total,
      items: `${products.length} ${products.length === 1 ? 'item' : 'items'}`,
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { 
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
        <input
          type="text"
          required
          value={formData.customer}
          onChange={(e) => setFormData({...formData, customer: e.target.value})}
          className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          required
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-0"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Products (comma-separated)</label>
        <input
          type="text"
          required
          value={formData.products}
          onChange={(e) => setFormData({...formData, products: e.target.value})}
          className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-0"
          placeholder="iPhone 14 Pro, AirPods Pro"
        />
      </div>
      <div className="flex justify-center space-x-2 pt-4">
        <Button
          type="submit"
          variant="contained"
          className="px-4 py-2 text-sm"
        >
          Create Order
        </Button>
      </div>
    </form>
  );
}