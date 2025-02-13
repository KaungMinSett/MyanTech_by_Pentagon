export const products = [
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